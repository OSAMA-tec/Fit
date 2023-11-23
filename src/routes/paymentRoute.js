const express = require('express');
const {createPayment,executePayment,cancelPayment} = require('../controllers/Payment/payPal');
const {getPaymentStatus} = require('../controllers/Payment/getStatus');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.post('/payment/create',verifyToken,createPayment);

router.get('/payment/success',verifyToken, executePayment);

router.post('/payment/cancel',verifyToken, cancelPayment);



router.get('/payment/status',verifyToken, getPaymentStatus);


module.exports = router;
