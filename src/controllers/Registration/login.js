const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../../models/User');
dotenv.config();


const login= async (req, res) => {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
        return res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        // save user token
        user.token = token;

        // user
        res.status(200).json({msg:"Login Successfully!",TOKEN:token,user});
    } else {
        res.status(400).send("Invalid Credentials");
    }
};

module.exports={login};