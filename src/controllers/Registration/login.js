const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const dotenv = require('dotenv');
const User = require('../../models/User');
dotenv.config();

const login = async (req, res) => {
  const { email, password, way } = req.body;

  if (!email || (way !== 'google' && !password)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (way !== 'google' && !(await argon2.verify(user.password, password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const jwtSecret = user.role === 'admin' ? process.env.JWT_SECRET_Admin : process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "30d" }
    );

    res.status(200).json({ 
      msg: "Login Successfully!", 
      TOKEN: token, 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { login };

