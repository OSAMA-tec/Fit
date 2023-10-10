const User = require('../../models/User'); 


const addPoints = async (req, res) => {
  try {
    // Check if points are provided
    if (!req.body.points) {
      return res.status(400).json({ error: 'Points are required' });
    }

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add points to the user
    user.points += req.body.points;

    // Save the user
    await user.save();

    // Send response
    res.status(200).json({ message: 'Points added successfully', user });

  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'An error occurred while adding points' });
  }
};


module.exports={addPoints}