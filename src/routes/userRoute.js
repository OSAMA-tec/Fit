const express = require('express');
const router = express.Router();
const {signUp} = require('../controllers/Registration/signUp');
const {login} = require('../controllers/Registration/login');
const {recoverPassword,updatePassword,verifyUser} = require('../controllers/Registration/recoverPassword');
const verifyToken = require('../middleware/auth');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/recover/password', recoverPassword);
router.put('/update/password',verifyToken, updatePassword);
router.post('/verify/otp', verifyUser);

module.exports = router;