const User = require('../../models/User');

const getNonAdminUsers = (req, res) => {
  User.find({ role: { $ne: 'admin' }}, (err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    
    res.status(200).send(users);
  });
};

module.exports={getNonAdminUsers};