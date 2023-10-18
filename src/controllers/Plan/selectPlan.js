// controllers/planController.js

const Plan = require('../../models/Plan');
const User = require('../../models/User');

const createPlanAndUpdateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planName, subscription } = req.body;

    // Create new plan
    const newPlan = new Plan({
      name: planName,
      subscription: subscription,
      durationInDays: subscription === 'one month' ? 30 : subscription === 'three months' ? 90 : subscription === 'six months' ? 180 : 365
    });

    const plan = await newPlan.save();

    // Update user with new plan ID
    const user = await User.findByIdAndUpdate(userId, { plan: plan._id }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Plan created and user updated', plan, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports={createPlanAndUpdateUser}