const axios = require('axios');
const User = require('../../models/User');
const MealPlan = require('../../models/Meal');
const Plan = require('../../models/Plan');
require('dotenv').config();

const generateAndSaveMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.plan) {
      return res.status(403).json({ message: 'No plan activated' });
    }

    const plan = await Plan.findById(user.plan);
    const startDate = plan.startDate;
    const durationInDays = plan.durationInDays;
    const endDate = startDate.setDate(startDate.getDate() + durationInDays);
    const currentDate = new Date();
    const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

    if (plan.name !== 'elite') {
      return res.status(403).json({ message: 'You need to subscribe to an elite plan to generate a meal plan', remainingDays });
    }

    console.log(user.plan)
    console.log(user.plan.name)
    if (!user.plan || plan.name !== 'elite') {
      return res.status(403).json({ message: 'You need to subscribe to a elite plan to generate a meal plan' });
    }

    const lastMealPlan = await MealPlan.findOne({ user: userId }).sort({ date: -1 });
    if (lastMealPlan) {
      const currentDate = new Date();
      const daysSinceLastMealPlan = (currentDate - lastMealPlan.date) / (1000 * 60 * 60 * 24);
      if (daysSinceLastMealPlan < 7) {
        return res.status(400).json({ message: 'You cannot generate a new meal plan within 7 days of your last meal plan' });
      }
    }
    await MealPlan.findOneAndDelete({ user: userId });

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

module.exports={generateAndSaveMealPlan};