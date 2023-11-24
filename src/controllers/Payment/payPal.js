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






//new
// const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
// // let accessTokenCache = {
// //   value: null,
// //   expiration: null,
// // };

// function environment() {
//   let clientId = process.env.PAYPAL_ID || 'YOUR_CLIENT_ID';
//   let clientSecret = process.env.PAYPAL_SECRET || 'YOUR_CLIENT_SECRET';

//   console.log('Client ID:', clientId); // Log client ID
//   console.log('Client Secret:', clientSecret); // Log client secret

//   return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
// }

// async function getAccessToken() {
//   const now = new Date();

//   if (accessTokenCache.value && now < accessTokenCache.expiration) {
//     console.log('Using cached access token:', accessTokenCache.value); // Log cached access token
//     return { data: { access_token: accessTokenCache.value } };
//   }

//   try {
//     const response = await new checkoutNodeJssdk.core.PayPalHttpClient(environment()).fetchAccessToken();
//     console.log('Access token response:', response); // Log access token response

//     accessTokenCache.value = response._accessToken;
//     accessTokenCache.expiration = new Date(now.getTime() + response._expiresIn * 1000);

//     console.log('New access token:', accessTokenCache.value); // Log new access token

//     return { data: { access_token: accessTokenCache.value } };
//   } catch (error) {
//     console.error('Error fetching access token:', error);
//     throw error; 
//   }
// }

// function client() {
//   const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(environment());

//   paypalClient.fetchAccessToken = async () => {
//     const accessToken = await getAccessToken();
//     console.log('Access token for client:', accessToken.data.access_token); // Log access token for client
//     return `Basic ${accessToken.data.access_token}`;
//   };

//   return paypalClient;
// }

// const createPayment = async (req, res) => {
//   const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
//   request.prefer("return=representation");
//   request.requestBody({
//     intent: 'CAPTURE',
//     purchase_units: [{
//       amount: {
//         currency_code: 'USD',
//         value: req.body.amount.toString()
//       }
//     }],
//     application_context: {
//       brand_name: `Fitness APP`,
//       landing_page: 'BILLING',
//       user_action: 'PAY_NOW',
//       return_url: 'https://fitnessapp-666y.onrender.com/api/payment/success',
//       cancel_url: 'https://fitnessapp-666y.onrender.com/api/payment/cancel'
//     }
//   });

//   try {
//     const order = await client().execute(request);
//     console.log('Order:', order); // Log order

//     const approvalLink = order.result.links.find(link => link.rel === 'approve').href;
//     res.json({ orderID: order.result.id, approvalUrl: approvalLink });   
//   } catch (err) {
//     console.error('Error creating payment:', err); // Log error
//     res.sendStatus(500);
//   }
// };

// const executePayment = async (req, res) => {
//   const orderId = req.query.token;

//   const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
//   request.requestBody({});

//   try {
//     const capture = await client().execute(request);
//     console.log('Capture:', capture); // Log capture

//     res.json({ captureID: capture.result.id });
//   } catch (err) {
//     console.error('Error executing payment:', err); // Log error
//     res.sendStatus(500);
//   }
// };

const cancelPayment = (req, res) => {
  console.log('Payment cancelled by user'); // Log cancellation
  res.json({ message: 'Order cancelled by the user' });
};

///new






////////////////////////////////////
// const axios = require('axios');

// const { PAYPAL_ID, PAYPAL_SECRET } = process.env;
// const base = "https://api-m.sandbox.paypal.com";
// let accessTokenCache = {
//   value: null,
//   expiration: null,
// };

// const generateAccessToken = async () => {
//   const now = new Date();
//   if (accessTokenCache.value && now < accessTokenCache.expiration) {
//     return accessTokenCache.value;
//   }

//   try {
//     if (!PAYPAL_ID || !PAYPAL_SECRET) {
//       throw new Error("MISSING_API_CREDENTIALS");
//     }
//     const auth = Buffer.from(`${PAYPAL_ID}:${PAYPAL_SECRET}`).toString("base64");
//     const response = await axios.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
//       headers: {
//         Authorization: `Basic ${auth}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     const data = response.data;
//     accessTokenCache.value = data.access_token;
//     accessTokenCache.expiration = new Date(now.getTime() + data.expires_in * 1000);
//     return data.access_token;
//   } catch (error) {
//     console.error("Failed to generate Access Token:", error);
//     throw error; 
//   }
// };

// // Controllers
// const createPayment = async (req, res) => {
//   try {
//     const accessToken = await generateAccessToken();
//     const url = `${base}/v2/checkout/orders`;
//     const payload = {
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           amount: {
//             currency_code: "USD",
//             value: req.body.amount, 
//           },
//         },
//       ],
//       application_context: {
//               brand_name: `Fitness APP`,
//               landing_page: 'BILLING',
//               user_action: 'PAY_NOW',
//               return_url: 'https://fitnessapp-666y.onrender.com/api/payment/success',
//               cancel_url: 'https://fitnessapp-666y.onrender.com/api/payment/cancel'
//             }
//     };

//     const response = await axios.post(url, payload, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const orderData = response.data;
//     const approvalUrl = orderData.links.find(link => link.rel === "approve").href;
//     res.json({ id: orderData.id, approvalUrl });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// const executePayment = async (req, res) => {
//   const orderId = req.query.token;

//   const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
//   request.requestBody({});

//   try {
//     const capture = await client().execute(request);
//     console.log('Capture:', capture); // Log capture

//     res.json({ captureID: capture.result.id });
//   } catch (err) {
//     console.error('Error executing payment:', err); // Log error
//     res.sendStatus(500);
//   }
// };

// const cancelPayment = (req, res) => {
//   console.log('Payment cancelled by user'); // Log cancellation
//   res.json({ message: 'Order cancelled by the user' });
// };
////////////////////////////////////



const Payment = require('../../models/Payment');
const axios = require("axios");

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, } = process.env;
// const base = "https://api-m.sandbox.paypal.com";
 const base = 'https://api-m.paypal.com';

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await axios.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = response.data;
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const amount = req.body.amount;
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: req.body.amount,
          },
        },
      ],
      application_context: {
        brand_name: `Fitness APP`,
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: 'https://fitnessapp-666y.onrender.com/api/payment/SuccessDonePayment',
        cancel_url: 'https://fitnessapp-666y.onrender.com/api/payment/CancelPayment'
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const orderData = response.data;
    const orderId = orderData.id;
    const approvalUrl = orderData.links.find(link => link.rel === "approve").href;
    res.status(response.status).json({ id: orderData.id, approvalUrl });

    let intervalId, intervalId2;

    setTimeout(() => {
      intervalId = setInterval(() => {
        executePayment(req, orderId, intervalId, intervalId2, userId, amount);
      }, 3000);

      setTimeout(() => {
        clearInterval(intervalId);

        intervalId2 = setInterval(() => {
          executePayment(req, orderId, intervalId, intervalId2, userId, amount);
        }, 1000);

        setTimeout(() => {
          clearInterval(intervalId2);

          setTimeout(async () => {
            const existingPayment = await Payment.findOne({ userId: userId, paypalPaymentId: orderId });
            if (existingPayment && existingPayment.paymentStatus == 'Pending') {
              existingPayment.paymentStatus = 'Failed';
              await existingPayment.save();
            }
          }, 2 * 60 * 1000);
        }, 5 * 60 * 1000);
      }, 2 * 60 * 1000);
    }, 0);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

const executePayment = async (req, orderId, intervalId, intervalId2, userId, amount) => {
  let captureData;
  try {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;

    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    captureData = response.data;

    await Payment.deleteMany({ userId: userId });

    const payment = new Payment({
      userId: userId,
      amount: amount,
      paypalPaymentId: orderId,
      paymentStatus: 'Success',
      details: JSON.stringify(captureData)
    });
    await payment.save();

    clearInterval(intervalId);
    clearInterval(intervalId2);
  } catch (error) {
    console.error("Failed to capture order:", error);

    await Payment.deleteMany({ userId: userId });

    const payment = new Payment({
      userId: userId,
      amount: amount,
      paypalPaymentId: orderId,
      paymentStatus: 'Failed',
      details: captureData ? JSON.stringify(captureData) : 'Capture data not available'
    });
    await payment.save();
    clearInterval(intervalId);
    clearInterval(intervalId2);
  }
};

module.exports = {
  createPayment,
  executePayment,
  cancelPayment
};