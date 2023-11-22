const express = require('express');
const {createPayment,executePayment,cancelPayment} = require('../controllers/Payment/payPal');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.post('/payment/create',verifyToken,createPayment);

router.get('/payment/success',verifyToken, executePayment);

router.get('/payment/cancel',verifyToken, cancelPayment);

module.exports = router;
