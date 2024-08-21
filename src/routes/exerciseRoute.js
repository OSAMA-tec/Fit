const express = require('express');
const router = express.Router();
const {getAllExercises,getExercises,getExercisesByBodyPart,getExercisesByDayOfWeek,getExercisesByLevel,getExerciseById,getExerciseId,getPaidExercises} = require('../controllers/Exercises/getAll');
const {createExercise,upload} = require('../controllers/Exercises/createExercise');
const {addBodyParts} = require('../controllers/BodyParts/uploadBody');
const {getAllBodyParts} = require('../controllers/BodyParts/getBody');
const {getAiExercises,generateExercises,migrateExercises} = require('../controllers/Exercises/aiExercise');



const verifyToken = require('../middleware/auth');



//Exercises For User
router.get('/exercise/all', verifyToken, getAllExercises);

//Exercise for user
router.get('/exercise', verifyToken, getExercises);

//Exercise by BodyPart
router.get('/exercise/body', verifyToken, getExercisesByBodyPart);

//Exercise by weekDay
router.get('/exercise/day', verifyToken, getExercisesByDayOfWeek);

//Exercise by level
router.get('/exercise/level', verifyToken, getExercisesByLevel);

//Exercise by random
router.get('/exercise/random', verifyToken, getExerciseById);
//Exercise by Id
router.get('/exercise/Id', verifyToken, getExerciseId);
//Exercise by Id
router.get('/exercise/special', verifyToken, getPaidExercises);


//Create Exercise
router.post('/admin/exercise', upload.fields([{ name: 'gifs', maxCount: 10 }, { name: 'video', maxCount: 1 }]),verifyToken, createExercise);




// ===========================================================================================================

//Upload Body Parts
router.post('/body-part/upload', addBodyParts);

//Get body Parts
router.get('/body/part', getAllBodyParts);




router.get('/ai/exercise', generateExercises);
router.get('/ai/exercise/get', getAiExercises);
router.get('/ai/exercise/move', migrateExercises);





//create Challenge Exercies



module.exports = router;