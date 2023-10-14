const express = require('express');
const router = express.Router();
const {getAllExercises,getExercisesByLevel} = require('../controllers/Exercises/getAll');



const verifyToken = require('../middleware/auth');



//Exercises
router.get('/exercise', getAllExercises);
router.get('/exercise/level', getExercisesByLevel);


module.exports = router;