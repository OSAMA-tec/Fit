const User = require('../../models/User'); 

const updateUserProfile = async (req, res) => {
  const updates = {
    gender: req.body.gender,
    age: req.body.age,
    height: req.body.height,
    weight: req.body.weight,
    workoutRoutine: req.body.workoutRoutine,
    fitnessLevel: req.body.fitnessLevel,
    topGoal: req.body.topGoal,
    workoutPerWeek: req.body.workoutPerWeek
  };

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    for (let key in updates) {
      if (updates[key]) {
        user[key] = updates[key];
      }
    }

    await user.save();

    return res.status(200).json({ message: 'User profile updated successfully', user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -_id');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports={updateUserProfile,getUserProfile}