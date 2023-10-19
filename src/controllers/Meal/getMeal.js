// controllers/mealPlanController.js

const MealPlan = require('../../models/Meal');

const getMealPlanByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const mealPlan = await MealPlan.findOne({ user: userId });
    if (!mealPlan) {
      return res.status(404).json({ message: 'No meal plan found for this user' });
    }
    res.status(200).json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports={getMealPlanByUserId}