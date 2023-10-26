const User = require('../../models/User'); 

const addPoints = async (req, res) => {
  try {
    if (!req.body.points) {
      return res.status(400).json({ error: 'Points are required' });
    }

    const points = Number(req.body.points);
    if (isNaN(points)) {
      return res.status(400).json({ error: 'Invalid points value' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.points += points;

    await user.save();

    res.status(200).json({ message: 'Points added successfully', user });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding points' });
  }
};

module.exports={addPoints}