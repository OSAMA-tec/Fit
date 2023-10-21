const express = require('express');
const router = express.Router();
const {getAllExercises,getExercises,getExercisesByBodyPart,getExercisesByDayOfWeek,getExercisesByLevel} = require('../controllers/Exercises/getAll');



const verifyToken = require('../middleware/auth');



//Exercises For User
router.get('/exercise/all',verifyToken, getAllExercises);

//Exercise for user
router.get('/exercise',verifyToken, getExercises);


//Exercise by BodyPart
router.get('/exercise/body',verifyToken, getExercisesByBodyPart);


//Exercise by weekDay
router.get('/exercise/day',verifyToken, getExercisesByDayOfWeek);

//Exercise by level
router.get('/exercise/level',verifyToken, getExercisesByLevel);




module.exports = router;