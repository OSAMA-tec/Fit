





const express = require('express');
const router = express.Router();
const {createPlanAndUpdateUser} = require('../controllers/Plan/selectPlan');



const verifyToken = require('../middleware/auth');



//User Select Plan
router.post('/select/plan', createPlanAndUpdateUser);





module.exports = router;