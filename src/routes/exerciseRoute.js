const express = require('express');
const router = express.Router();
const {getAllExercises,getExercises,getExercisesByBodyPart,getExercisesByDayOfWeek} = require('../controllers/Exercises/getAll');



const verifyToken = require('../middleware/auth');



//Exercises For User
router.get('/exercise/all', getAllExercises);

//Exercise by Level
router.get('/exercise',verifyToken, getExercises);


//Exercise by BodyPart
router.get('/exercise/body', getExercisesByBodyPart);


//Exercise by weekDay
router.get('/exercise/day', getExercisesByDayOfWeek);




module.exports = router;