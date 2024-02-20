const express = require('express');
const router = express.Router();
const multer=require('multer')
const { createWeeklyExercisePlan, getWeeklyExercises,updateCustomExercisePlan,deleteCustomExercisePlan } = require('../controllers/Custom/customWeekly');


// In your routes file
const verifyToken = require('../middleware/auth');

// Challenge Routes
router.get('/custom/week/exercise', verifyToken, getWeeklyExercises);
router.post('/custom/week', verifyToken, createWeeklyExercisePlan);
router.put('/custom/week/update', verifyToken, updateCustomExercisePlan);
router.delete('/custom/week/delete', verifyToken, deleteCustomExercisePlan);


module.exports = router;
