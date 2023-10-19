



const express = require('express');
const router = express.Router();
const {generateAndSaveMealPlan} = require('../controllers/Meal/generateMeal');
const {getMealPlanByUserId} = require('../controllers/Meal/getMeal');



const verifyToken = require('../middleware/auth');



//Generate User Meal Plan
router.post('/meal/plan',verifyToken, generateAndSaveMealPlan);


//get User Meal
router.get('/meal/plan',verifyToken, getMealPlanByUserId);


module.exports = router;