const express = require('express');
const {createPayment,executePayment,cancelPayment} = require('../controllers/Payment/payPal');
const router = express.Router();

router.post('/payment/create',createPayment);

router.get('/payment/success', executePayment);

router.get('/payment/cancel', cancelPayment);

module.exports = router;
