const express = require('express');
const router = express.Router();
const {getAllExercises,getExercisesByLevel,getExercisesByBodyPart} = require('../controllers/Exercises/getAll');



const verifyToken = require('../middleware/auth');



//Exercises For User
router.get('/exercise', getAllExercises);

//Exercise by Level
router.get('/exercise/level', getExercisesByLevel);


//Exercise by BodyPart
router.get('/exercise/body', getExercisesByBodyPart);




module.exports = router;