const User = require('../../models/User');
const Plan = require('../../models/Plan');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const signUp = async (req, res) => {
  const { username, email, password, role, way } = req.body;

  // Check for required fields
  if (way === 'google') {
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }
  } else {
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
  }

  try {
    const existingUserEmail = await User.findOne({ email });
    const existingUserUsername = await User.findOne({ username });

    if (existingUserEmail || existingUserUsername) {
      return res.status(400).json({ error: 'A user with this email or username already exists' });
    }

    let hashedPassword = null;
    if (way !== 'google') {
      hashedPassword = await argon2.hash(password);
    }

    const plan = new Plan({
      name: 'free',
      subscription: 'one month',
      durationInDays: 30
    });

    await plan.save();

    const user = new User({
      username,
      email,
      fitnessLevel:'intermediate',
      password: hashedPassword,
      role: role || 'user',
      plan: plan._id 
    });

    await user.save();

    const jwtSecret = user.role === 'admin' ? process.env.JWT_SECRET_Admin : process.env.JWT_SECRET;
    const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: "30d" }
    );

    user.token = token;

    res.status(201).json({ message: 'User created successfully', TOKEN: token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

module.exports = { signUp };
