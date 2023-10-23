// controllers/exerciseController.js

const Exercise = require('../../models/Exercise');
const uploadImageToFirebase = require('../../firebase/firebaseImage');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const createExercise = async (req, res) => {
  try {
    const exerciseData = req.body;
    if(req.user.role!=='admin'){
      res.status(400).json({ message: 'You Not Admin'});
    }
    if (exerciseData.image) {
      const imageUrls = await Promise.all(exerciseData.image.map((base64Image, index) => uploadImageToFirebase(`exercise_${req.user.id}_${index}.jpg`, base64Image)));
      exerciseData.image = imageUrls;
    }

    if (req.files.gifs) {
      const gifUrls = await Promise.all(req.files.gifs.map((file, index) => {
        const gifName = `exercise_${req.user.id}_${index}.gif`;
        const gifPath = path.join(__dirname, '..', 'uploads', gifName);
        return uploadImageToFirebase(gifPath, file.buffer.toString('base64'));
      }));
      exerciseData.gifUrl = gifUrls;
    }

    if (req.files.video) {
      const videoFile = req.files.video[0];
      const videoName = `exercise_${req.user.id}.mp4`;
      const videoUrl = await uploadImageToFirebase(videoName, videoFile.buffer.toString('base64'));
      exerciseData.video = videoUrl;
    }
    
    const exercise = new Exercise(exerciseData);
    await exercise.save();

    res.status(200).json({ message: 'Exercise created', exercise });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createExercise, upload };