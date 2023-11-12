const User = require('../../models/User');
const MealPlan = require('../../models/Meal');
const Plan = require('../../models/Plan');

const getMealPlan = async (req, res) => {
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

        if (user.mealplanid && user.mealplandate) {
            const daysSinceLastMealPlan = (currentDate - new Date(user.mealplandate)) / (1000 * 60 * 60 * 24);
            if (daysSinceLastMealPlan < 7) {
                const lastMealPlan = await MealPlan.findById(user.mealplanid);
                return res.status(200).json({ message: `Subscription period left: ${remainingDays} days`, mealPlan: lastMealPlan });
            }
        }

        let ageRange;
        if (user.age >= 40) {
            ageRange = '40+';
        } else if (user.age >= 35) {
            ageRange = '35-40';
        } else if (user.age >= 30) {
            ageRange = '30-35';
        } else if (user.age >= 25) {
            ageRange = '25-30';
        } else if (user.age >= 20) {
            ageRange = '20-25';
        } else if (user.age >= 15) {
            ageRange = '15-20';
        }

        const newMealPlan = await MealPlan.findOne({ topGoal: user.topGoal, age: ageRange });
        if (!newMealPlan) {
            return res.status(404).json({ message: 'No meal plan found for this user' });
        }


        user.mealplanid = newMealPlan._id;
        user.mealplandate = currentDate;
        await user.save();

        res.status(200).json({ message: `Subscription period left: ${remainingDays} days`, mealPlan: newMealPlan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMealPlan };
