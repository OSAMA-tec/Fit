



const express = require('express');
const router = express.Router();
const {generateAndSaveMealPlan} = require('../controllers/Meal/generateMeal');



const verifyToken = require('../middleware/auth');



//User Meal Plan
router.post('/meal/plan',verifyToken, generateAndSaveMealPlan);





module.exports = router;