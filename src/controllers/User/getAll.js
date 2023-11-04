const User = require('../../models/User');

const getNonAdminUsers =async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' }}).populate('plan');
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports={getNonAdminUsers};