const Exercise1 = require('../../models/Exercise1');
const { OpenAI } = require('openai');
const axios = require('axios');
const { createAndUploadGif } = require('../../firebase/gifupload');
const Exercise = require('../../models/Exercise');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const bodyParts = [
    "shoulders", "upper legs", "core", "biceps", "glutes",
    "back", "triceps", "chest", "lower legs"
];

const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const generateExercises = async (req, res) => {
    try {
        for (let bodyPart of bodyParts) {
            await generateExercisesForBodyPart(bodyPart);
        }
        res.status(200).json({ message: 'All exercises generated successfully' });
    } catch (error) {
        console.error('Error generating exercises:', error);
        res.status(500).json({ message: 'Error generating exercises', error: error.message });
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateExercisesForBodyPart(bodyPart) {
    for (let i = 0; i < 6; i++) {
        try {
            // Step 1: Generate exercise details and image prompts with GPT-4
            const completion = await openai.chat.completions.create({
                model: "gpt-4-0613",
                messages: [{
                    role: "system",
                    content: `You are a professional fitness trainer and visual artist with extensive knowledge of exercise physiology and image creation. 
                    Your task is to generate detailed, safe, and effective exercises for the ${bodyPart}, along with precise prompts for creating visual aids that show the exact same scene in two different stages of the exercise.`
                }, {
                    role: "user",
                    content: `Create a unique exercise for the ${bodyPart}. Provide the response in the following JSON format:
                    {
                      "exercise": {
                        "name": "Creative and descriptive name",
                        "instructions": [
                          "Step 1: Detailed instruction",
                          "Step 2: Detailed instruction",
                          "Step 3: Detailed instruction"
                        ],
                        "primaryMusclesWorked": ["Muscle 1", "Muscle 2"],
                        "difficultyLevel": "beginner/intermediate/advanced",
                        "equipmentNeeded": ["Equipment 1", "Equipment 2"] or "No equipment needed",
                        "modifications": {
                          "easier": "Description of easier modification",
                          "harder": "Description of harder modification"
                        },
                        "safetyTips": [
                          "Safety tip 1",
                          "Safety tip 2"
                        ],
                        "imagePrompts": {
                          "basePrompt": "A person performing an exercise on a plain white background. Full body view.",
                          "startingPosition": "Description of the starting position, focusing only on body positioning",
                          "endingPosition": "Description of the ending position, focusing only on body positioning"
                        }
                      }
                    }
                    
                    For the imagePrompts, follow these guidelines strictly:
                    1. The basePrompt should be simple and neutral.
                    2. The startingPosition and endingPosition should ONLY describe how the body position changes:
                       - Use precise anatomical terms (e.g., "arms at 90-degree angle", "palms facing forward")
                       - Describe the position of all relevant body parts, especially the ${bodyPart}
                       - Mention any interaction with equipment (e.g., "gripping the dumbbells firmly")
                       - Ensure the positions are distinct enough to show clear movement
                    3. Ensure absolute consistency between the two positions except for the movement itself
                    4. Use clear, simple language that will translate well into image generation
                    5. Avoid mentioning motion or transition - focus on static positions only
                    6. Ensure the exercise can be clearly represented in two static images
                    7. The exercise should be simple enough to be represented effectively in just two frames
                    
                    Remember, the goal is to create two images that are identical in every way except for the specific body position change required for the exercise. The images should be suitable for creating a smooth, two-frame GIF.`
                }],
            });

            // Check if the response is as expected
            if (!completion.choices || !completion.choices[0]) {
                console.error('Unexpected API response:', completion);
                continue;
            }

            let content = completion.choices[0].message.content;
            content = content.replace(/```json\n|```/g, '');

            let exerciseDetails;
            try {
                exerciseDetails = JSON.parse(content);
                console.log('Exercise details:', exerciseDetails);
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                continue;
            }

            // Ensure all required fields exist
            if (!exerciseDetails.exercise.instructions || 
                !exerciseDetails.exercise.imagePrompts ||
                !exerciseDetails.exercise.imagePrompts.basePrompt ||
                !exerciseDetails.exercise.imagePrompts.startingPosition ||
                !exerciseDetails.exercise.imagePrompts.endingPosition) {
                console.error('Missing required fields in the response:', exerciseDetails);
                continue;
            }

            // Step 2: Generate images with DALL-E 3
            const baseImagePrompt = `${exerciseDetails.exercise.imagePrompts.basePrompt} High-quality, photorealistic 3D render. The scene has a pure white background with no shadows or reflections. The lighting is bright and even, creating clear contrast between the subject and the background. The image should be crisp, detailed, and suitable for creating a smooth, two-frame GIF.`;
            
            const imagePrompts = [
                `${baseImagePrompt} ${exerciseDetails.exercise.imagePrompts.startingPosition}`,
                `${baseImagePrompt} ${exerciseDetails.exercise.imagePrompts.endingPosition}`
            ];
            
            const imageUrls = [];
            for (let prompt of imagePrompts) {
                try {
                    const response = await openai.images.generate({
                        model: "dall-e-3",
                        prompt: prompt,
                        n: 1,
                        size: "1024x1024",
                        quality: "hd",
                        style: "natural"
                    });
                    console.log('Image generation response:', response.data);
                    imageUrls.push(response.data[0].url);
                } catch (imageError) {
                    console.error('Error generating image:', imageError);
                }
            }
            console.log('Generated image URLs:', imageUrls);

            // Step 3 & 4: Convert images to GIF and upload to Firebase
            let gifUrl;
            try {
                gifUrl = await createAndUploadGif(imageUrls, exerciseDetails.exercise.name);
                console.log('GIF created and uploaded:', gifUrl);
            } catch (gifError) {
                console.error('Error creating or uploading GIF:', gifError);
            }

            // Step 5: Assign a weekday
            const dayOfWeek = weekDays[i % 7];

            // Step 6: Save to MongoDB
            const exercise = new Exercise1({
                name: exerciseDetails.exercise.name,
                paid: false,
                instructions: exerciseDetails.exercise.instructions,
                bodyPart: bodyPart,
                image: imageUrls,
                gifUrl: gifUrl ? [gifUrl] : [],
                dayOfWeek: dayOfWeek, 
                level: exerciseDetails.exercise.difficultyLevel,
                primaryMuscles: exerciseDetails.exercise.primaryMusclesWorked,
                equipment: exerciseDetails.exercise.equipmentNeeded,
                modifications: exerciseDetails.exercise.modifications,
                safetyTips: exerciseDetails.exercise.safetyTips,
            });

            try {
                await exercise.save();
                console.log(`Exercise ${i + 1} for ${bodyPart} generated and saved for ${dayOfWeek}.`);
            } catch (dbError) {
                console.error('Error saving exercise to database:', dbError);
            }

            // Add a delay between iterations to avoid rate limiting
            await delay(1000); // 1 second delay

        } catch (error) {
            console.error(`Error generating exercise ${i + 1} for ${bodyPart}:`, error);
        }
    }
}












const getAiExercises = async (req, res) => {
    try {
        const exercises = await Exercise1.find()
        res.status(200).json({ message: 'All exercises generated successfully ', exercises });
    } catch (error) {
        console.error('Error generating exercises:', error);
        res.status(500).json({ message: 'Error generating exercises', error: error.message });
    }
};




const migrateExercises = async (req, res) => {
    try {
        // Get all exercises from Exercise1 model
        const exercise1Data = await Exercise1.find({});

        // Calculate how many exercises should be paid (60%)
        const totalExercises = exercise1Data.length;
        const paidExercisesCount = Math.floor(totalExercises * 0.4);

        // Shuffle the array to randomize which exercises will be paid
        const shuffledExercises = exercise1Data.sort(() => 0.5 - Math.random());

        let migratedCount = 0;
        let errorCount = 0;

        // Function to convert day of week to number
        const dayToNumber = (day) => {
            const days = {
                'Monday': '1',
                'Tuesday': '2',
                'Wednesday': '3',
                'Thursday': '4',
                'Friday': '5',
                'Saturday': '6',
                'Sunday': '7'
            };
            return days[day] || '';
        };

        for (let i = 0; i < totalExercises; i++) {
            const oldExercise = shuffledExercises[i];
            
            try {
                const newExercise = new Exercise({
                    name: oldExercise.name,
                    paid: i > paidExercisesCount, // First 40% will be false
                    instructions: oldExercise.instructions,
                    bodyPart: oldExercise.bodyPart,
                    image: [],
                    gifUrl: oldExercise.gifUrl,
                    dayOfWeek: dayToNumber(oldExercise.dayOfWeek), // Convert day to number
                    AI: oldExercise.AI,
                    level: oldExercise.level,
                    collectionRef: oldExercise.collectionRef,
                    primaryMuscles: [], 
                    secondaryMuscles: [],
                    equipment: '', 
                    category: "",
                });

                await newExercise.save();
                migratedCount++;
                console.log(migratedCount);
            } catch (error) {
                console.error(`Error migrating exercise ${oldExercise._id}:`, error);
                errorCount++;
            }
        }

        res.status(200).json({
            message: 'Migration completed',
            totalExercises: totalExercises,
            migratedCount: migratedCount,
            errorCount: errorCount,
            paidExercisesCount: paidExercisesCount
        });

    } catch (error) {
        console.error('Error in migration process:', error);
        res.status(500).json({ message: 'Error in migration process', error: error.message });
    }
};



module.exports = { generateExercises, getAiExercises ,migrateExercises}


