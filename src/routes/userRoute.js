const express = require('express');
const router = express.Router();
const {signUp} = require('../controllers/Registration/signUp');
const {login} = require('../controllers/Registration/login');
const {recoverPassword,updatePassword,verifyUser} = require('../controllers/Registration/recoverPassword');
const {updateUserProfile,getUserProfile,uploadProfilePic} = require('../controllers/User/userData');



const verifyToken = require('../middleware/auth');



//Registration
router.post('/signup', signUp);
router.post('/login', login);
router.post('/recover/password', recoverPassword);
router.put('/update/password',verifyToken, updatePassword);
router.post('/verify/otp', verifyUser);





//Profile Update
router.post('/profile',verifyToken, updateUserProfile);
router.get('/profile',verifyToken, getUserProfile);
router.post('/profile/pic',verifyToken, uploadProfilePic);

module.exports = router;