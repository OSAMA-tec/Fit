const axios = require('axios');
const Payment = require('../../models/Payment');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
// const paypalAPI = 'https://api-m.sandbox.paypal.com';
const paypalAPI = 'https://api-m.paypal.com';

const basicAuthToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

async function createPayment(req, res) {
    const { amount } = req.body;
    const userId = req.user.id;

    try {
        const accessTokenResponse = await axios.post(`${paypalAPI}/v1/oauth2/token`, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${basicAuthToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = accessTokenResponse.data.access_token;

        const paymentResponse = await axios.post(`${paypalAPI}/v2/checkout/orders`, {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount.toString()
                }
            }],
            payment_method: {
                payer_selected: 'PAYPAL',
                payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
            },
            application_context: {
                brand_name: `Fitness APp`,
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                return_url: 'https://fitnessapp-666y.onrender.com/api/payment/success',
                cancel_url: 'https://fitnessapp-666y.onrender.com/api/payment/cancel'
            }
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        await Payment.deleteMany({ userId });

        const payment = new Payment({
            userId,
            amount,
            paypalPaymentId: paymentResponse.data.id
        });

        await payment.save();

        // Send the approval URL to the client
        const approvalUrl = paymentResponse.data.links.find(link => link.rel === 'approve').href;

        res.json({
            message: 'Payment created successfully',
            approvalUrl
        });
    } catch (error) {
        console.error('PayPal payment error:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
}


async function executePayment(req, res) {
    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerID;
    const payment = await Payment.findOne({ paypalPaymentId: paymentId });

    if (!payment) {
        return res.status(404).send('Payment not found');
    }

    try {
        const accessTokenResponse = await getAccessToken();
        const accessToken = accessTokenResponse.data.access_token;

        const response = await axios.post(`${paypalAPI}/v2/checkout/orders/${paymentId}/capture`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log(response.data);
        payment.paymentStatus = 'Success';
        payment.details = response.data;
        await payment.save();

        res.json({
            message: 'Payment successful',
            details: response.data
        });
    } catch (error) {
        console.error('Execute payment error:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

async function cancelPayment(req, res) {
    const paymentId = req.query.paymentId;
    const payment = await Payment.findOne({ paypalPaymentId: paymentId });

    if (!payment) {
        return res.status(404).send('Payment not found');
    }

    try {

        payment.paymentStatus = 'Canceled';
        await payment.save();

        res.json({
            message: 'Payment Cancel',
        });
    } catch (error) {
        console.error('Cancel payment error:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// async function cancelPayment(req, res) {

//     const { token } = req.query;
//     console.log(token)
//     try {
  
//       const accessToken = await getAccessToken();
      
//       const response = await axios.post(
//         `${paypalAPI}/v2/checkout/orders/${token}/cancel`, 
//         {},
//         {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         }
//       );
  
//       if(response.status === 204) {
//         return res.json({
//           message: "Payment cancelled successfully"
//         });
//       }
  
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//           message: "Error cancelling payment"  
//         });
//       }
  
//   }


async function getAccessToken() {
    const response=await axios.post(`${paypalAPI}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
            'Authorization': `Basic ${basicAuthToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const jsonData = response.json();
    return jsonData.access_token;
}




module.exports = {
    createPayment,
    executePayment,
    cancelPayment
};
