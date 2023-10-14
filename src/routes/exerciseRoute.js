const express = require('express');
const router = express.Router();
const {getAllExercises} = require('../controllers/Exercises/getAll');



const verifyToken = require('../middleware/auth');



//Exercises
router.get('/exercise', getAllExercises);


module.exports = router;