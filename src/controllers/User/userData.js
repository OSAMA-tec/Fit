const User = require('../../models/User'); 
const uploadImageToFirebase = require('../../firebase/firebaseImage')


const updateUserProfile = async (req, res) => {
  const updates = {
    username: req.body.username,
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
    const user = await User.findById(req.body.id);
console.log(req.body.id)
console.log(user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    for (let key in updates) {
      if (updates[key]) {
        user[key] = updates[key];
      }
    }
    if(user.weight && user.height) {
      let heightInMeters = user.height / 100;
      let bmi = user.weight / Math.pow(heightInMeters, 2);
      user.bmi = parseFloat(bmi.toFixed(2));
    }
    
    
    console.log(user.bmi)
    await user.save();

    return res.status(200).json({ message: 'User profile updated successfully', user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('plan'); 

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




const uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const base64Image = req.body.image;
    const url = await uploadImageToFirebase(`${user.username}_profile_pic.jpeg`, base64Image);

    user.profilePic = url;

    await user.save();

    return res.status(200).json({ message: 'Profile picture uploaded successfully', url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports={updateUserProfile,getUserProfile,uploadProfilePic}