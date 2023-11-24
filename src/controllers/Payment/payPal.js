// const axios = require('axios');
// const Payment = require('../../models/Payment');
// // const clientId = process.env.PAYPAL_CLIENT_ID;
// const clientId = "AWR_XVcg539W0BgtKS6G5OhxKN5mABPlRnYTBUzWrjob0OURiVU5kp7sn0iXUanJTg7_wfL5Y7wEbeYn";
// // const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
// const clientSecret = "EIr2qg5Vyv80wXrP98FXQ2-gQz45pUQvLlPAukiz1iEgu37TF1k-xy_4LYTPyHDIJaBYw1a8yGRlbNRB";
// const paypalAPI = 'https://api-m.sandbox.paypal.com';
// // const paypalAPI = 'https://api-m.paypal.com';

// const basicAuthToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// async function createPayment(req, res) {
//     const { amount } = req.body;
//     const userId = req.user.id;
//     if (!amount || isNaN(amount)) {
//         return res.status(400).send('Invalid amount');
//     }

//     try {
//         // Get access token
//         const tokenResponse = await getAccessToken();
//         const accessToken = tokenResponse.data.access_token;

//         // const accessTokenResponse = await axios.post(`${paypalAPI}/v1/oauth2/token`, 'grant_type=client_credentials', {
//         //     headers: {
//         //         'Authorization': `Basic ${basicAuthToken}`,
//         //         'Content-Type': 'application/x-www-form-urlencoded'
//         //     }
//         // });

//         // const accessToken = accessTokenResponse.data.access_token;

//         const paymentResponse = await axios.post(`${paypalAPI}/v2/checkout/orders`, {
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 amount: {
//                     currency_code: 'USD',
//                     value: amount.toString()
//                 }
//             }],
//             payment_method: {
//                 payer_selected: 'PAYPAL',
//                 payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
//             },
//             application_context: {
//                 brand_name: `Fitness APP`,
//                 landing_page: 'BILLING',
//                 user_action: 'PAY_NOW',
//                 return_url: 'https://fitnessapp-666y.onrender.com/api/payment/success',
//                 cancel_url: 'https://fitnessapp-666y.onrender.com/api/payment/cancel'
//             }
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         // Only proceed if payment creation succeeded
//         if (paymentResponse.status === 201) {

//             await Payment.deleteMany({ userId });

//             const payment = new Payment({
//                 userId,
//                 amount,
//                 paypalPaymentId: paymentResponse.data.id
//             });

//             await payment.save();

//             // Send approval URL
//             const approvalUrl = paymentResponse.data.links.find(link => link.rel === 'approve').href;

//             res.json({
//                 message: 'Payment created successfully',
//                 approvalUrl,
//                 paypalPaymentId: paymentResponse.data.id
//             });

//         } else {
//               throw new Error('Failed to create payment');
//           }
//       } catch (error) {
//             console.error('PayPal payment error:', error.response ? error.response.data : error.message);
//             res.status(500).send('Internal Server Error');
//         }
//     }




// async function executePayment(req, res) {
//     const paymentId = req.query.paymentId;
//     const payerId = req.query.PayerID;
//     if(!paymentId || !payerId) {
//       return res.status(400).send('Invalid request');
//     }

//     try {
//       const payment = await Payment.findOne({ paypalPaymentId: paymentId });

//       if(!payment) {
//         return res.status(404).send('Payment not found');
//       }

//       // Handle expired access token
//       let accessToken = await getAccessToken();

//       let captureResponse = await axios.post(`${paypalAPI}/v2/checkout/orders/${paymentId}/capture`, {}, {
//         headers: { 
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });

//       // If token expired, get new one
//       if(captureResponse.status === 401) {
//         accessToken = await getAccessToken();
//         captureResponse = await axios.post(`${paypalAPI}/v2/checkout/orders/${paymentId}/capture`, {}, {
//           headers: {
//             'Authorization': `Bearer ${accessToken}` 
//           }
//         });
//       }

//       payment.paymentStatus = 'Success';
//       payment.details = captureResponse.data;
//       await payment.save();

//       res.json({
//         message: 'Payment successful',
//         details: captureResponse.data
//       });

//     } catch (error) {
//       console.error('Execute payment error:', error);
//       res.status(500).send('Internal Server Error');
//     }
// }

// async function cancelPayment(req, res) {
//     const paymentId = req.query.paymentId;

//     const payment = await Payment.findOne({ paypalPaymentId: paymentId });

//     if(!payment) {
//       return res.status(404).send('Payment not found'); 
//     }

//     try {
//       // Get access token
//       let accessToken = await getAccessToken();

//       // Cancel payment on PayPal
//       let response = await axios.post(`${paypalAPI}/v2/checkout/orders/${paymentId}/cancel`, {}, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });

//       // If token expired, get new one
//       if(response.status === 401) {
//         accessToken = await getAccessToken();
//         response = await axios.post(`${paypalAPI}/v2/checkout/orders/${paymentId}/cancel`, {}, {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         });
//       }

//       if(response.status === 204) {
//         // Update payment status
//         payment.paymentStatus = 'Canceled';
//         await payment.save();

//         return res.json({
//           message: 'Payment cancelled successfully'
//         });
//       }

//     } catch (error) {
//       console.error('Cancel payment error:', error);
//       return res.status(500).send('Error cancelling payment');
//     }
// }


// let accessTokenCache = {
//   value: null,
//   expiration: null,
// };

// async function getAccessToken() {
//   const now = new Date();

//   // If we have a valid token in cache, return it
//   if (accessTokenCache.value && now < accessTokenCache.expiration) {
//     return { data: { access_token: accessTokenCache.value } };
//   }

//   // Otherwise, request a new token
//   const response = await axios.post(
//     `${paypalAPI}/v1/oauth2/token`,
//     'grant_type=client_credentials',
//     {
//       headers: {
//         'Authorization': `Basic ${basicAuthToken}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     }
//   );

//   // Cache the new token and set the expiration time
//   accessTokenCache.value = response.data.access_token;
//   accessTokenCache.expiration = new Date(now.getTime() + response.data.expires_in * 1000);

//   return response;
// }





const express = require('express');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function environment() {
  let clientId = process.env.PAYPAL_ID || 'YOUR_CLIENT_ID';
  let clientSecret = process.env.PAYPAL_SECRET || 'YOUR_CLIENT_SECRET';

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}


const createPayment = async (req, res) => {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: req.body.amount.toString()
      }
    }],
    application_context: {
      brand_name: `Fitness APP`,
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: 'https://fitnessapp-666y.onrender.com/api/payment/success',
      cancel_url: 'https://fitnessapp-666y.onrender.com/api/payment/cancel'
    }
  });

  try {
    const order = await environment().execute(request);
    res.json({ orderID: order.result.id });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const executePayment = async (req, res) => {
  const orderId = req.query.token;

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await environment().execute(request);
    res.json({ captureID: capture.result.id });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
const cancelPayment = (req, res) => {
  res.json({ message: 'Order cancelled by the user' });
};



module.exports = {
  createPayment,
  executePayment,
  cancelPayment
};
