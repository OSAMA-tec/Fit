const express = require('express');
const router = express.Router();
const {getAllExercises,getExercises,getExercisesByBodyPart,getExercisesByDayOfWeek,getExercisesByLevel} = require('../controllers/Exercises/getAll');
const {createExercise,upload} = require('../controllers/Exercises/createExercise');



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


//Create Exercise
router.post('/admin/exercise', upload.fields([{ name: 'gifs', maxCount: 10 }, { name: 'video', maxCount: 1 }]),verifyToken, createExercise);


module.exports = router;