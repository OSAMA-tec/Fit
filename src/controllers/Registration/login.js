const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const dotenv = require('dotenv');
const User = require('../../models/User');
dotenv.config();

const login = async (req, res) => {
  const { email, password, way } = req.body;

  if (way === 'google') {
    if (!email) {
      return res.status(400).send("Email is required");
    }
  } else {
    if (!(email && password)) {
      return res.status(400).send("Email and password are required");
    }
  }

  const user = await User.findOne({ email });

  if (user) {
    if (way !== 'google') {
      if (!(await argon2.verify(user.password, password))) {
        return res.status(400).send("Invalid Credentials");
      }
    }

    const jwtSecret = user.role === 'admin' ? process.env.JWT_SECRET_Admin : process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "30d" }
    );

    user.token = token;

    res.status(200).json({ msg: "Login Successfully!", TOKEN: token, user });
  } else {
    res.status(400).send("Invalid Credentials");
  }
};

module.exports = { login };
