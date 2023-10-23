
const MealPlan = require('../../models/Meal');
const User = require('../../models/User');
const Plan = require('../../models/Plan');
const getMealPlanByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const mealPlan = await MealPlan.findOne({ user: userId });

    if (!mealPlan) {
      return res.status(404).json({ message: 'No meal plan found for this user' });
    }

    // Fetch the user's plan
    const user = await User.findById(userId);
    if (!user.plan) {
      return res.status(200).json({ message: 'No plan activated', mealPlan });
    }

    const plan = await Plan.findById(user.plan);
    const startDate = plan.startDate;
    const durationInDays = plan.durationInDays;
    const endDate = startDate.setDate(startDate.getDate() + durationInDays);
    const currentDate = new Date();
    const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

    res.status(200).json({ message: `Subscription period left: ${remainingDays} days`, mealPlan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports={getMealPlanByUserId}