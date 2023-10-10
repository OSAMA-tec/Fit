const User = require('../../models/User'); 
const Plan = require('../../models/Plan'); 
const createPlan = async (req, res) => {
  try {
    // Check if plan name is provided
    if (!req.body.name) {
      return res.status(400).json({ error: 'Plan name is required' });
    }

    // Check if plan name is valid
    const planNames = ['Premium', 'Elite', 'Special'];
    if (!planNames.includes(req.body.name)) {
      return res.status(400).json({ error: 'Invalid plan name' });
    }

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new plan
    const plan = new Plan({ name: req.body.name });

    // Save the plan
    await plan.save();

    // Update user with the plan id
    user.plan = plan._id;
    await user.save();

    // Send response
    res.status(200).json({ message: 'Plan created successfully', plan });

  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'An error occurred while creating the plan' });
  }
};

module.exports={createPlan}