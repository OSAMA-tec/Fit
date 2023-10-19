// controllers/mealPlanController.js

const axios = require('axios');
const User = require('../../models/User');
const MealPlan = require('../../models/Meal');
require('dotenv').config();

const generateAndSaveMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealPlan = [];

    for (let i = 0; i < 7; i++) {
      const options = {
        method: 'POST',
        url: 'https://api.perplexity.ai/chat/completions',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: process.env.PER_AI_KEY
        },
        data: {
          model: 'llama-2-70b-chat',
          messages: [
            {role: 'system', content: `give meal plan for ${days[i]}`},
            {role: 'user', content: `i wana ${user.topGoal},my age is ${user.age} my weight is ${user.weight} my height is ${user.height}.I am ${user.gender} my workout level is ${user.fitnessLevel} and my workout routine is ${user.workoutRoutine}`}
          ],
          max_tokens: 3000
        }
      };

      const response = await axios.request(options);
      const meals = response.data.choices[0].message.content.split('\n\n').map(meal => {
        const [mealName, ...mealItems] = meal.split('\n');
        return { mealName, mealItems };
      });
      mealPlan.push({ day: days[i], meals: meals });
    }

    const newMealPlan = new MealPlan({ user: userId, mealPlan: mealPlan });
    const savedMealPlan = await newMealPlan.save();

    res.status(200).json(savedMealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports={generateAndSaveMealPlan}