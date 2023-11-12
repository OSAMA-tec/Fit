



const express = require('express');
const router = express.Router();
const {generateAndGetMealPlan} = require('../controllers/Meal/generateMeal');
const {getMealPlanByUserId} = require('../controllers/Meal/getMeal');
const {getMealPlan} = require('../controllers/Meal/meal');



const verifyToken = require('../middleware/auth');



//Generate User Meal Plan
router.post('/meal/plan',verifyToken, generateAndGetMealPlan);


//get User Meal
router.get('/meal/plan',verifyToken, getMealPlanByUserId);


//get  Meal
router.get('/meal',verifyToken, getMealPlan);


module.exports = router;