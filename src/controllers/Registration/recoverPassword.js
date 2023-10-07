const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const jwt = require('jsonwebtoken');
require('dotenv').config();

SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;
async function sendOtpViaEmail(email, otp) {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
  
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.subject = 'FITNESS APP OTP';
    sendSmtpEmail.htmlContent = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          box-sizing: border-box;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e5e5;
        }
        .header h1 {
          font-size: 24px;
          color: #333333;
          margin: 0;
        }
        .content {
          padding: 20px 0;
          text-align: center;
        }
        .content p {
          font-size: 16px;
          color: #666666;
          line-height: 1.5;
          margin: 0;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #00466a;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Fitness APP</h1>
        </div>
        <div class="content">
          <p>Thank you for using Fitness APP. Please use the following One-Time Password (OTP) to complete your registration process. This OTP is valid for 5 minutes.</p>
          <div class="otp">${otp}</div>
          <p>If you did not request this OTP, please ignore this email.</p>
        </div>
        <div class="footer">
          &copy; Fitness APP. All rights reserved.
        </div>
      </div>
    </body>
    </html>`;
    sendSmtpEmail.sender = { email: process.env.EMAIL_FROM };
  
    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('OTP sent via Email');
    } catch (error) {
      console.error('Failed to send OTP via Email:', error);
      throw error;
    }
  }
const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(500).send('Email not passed');
        }

        let user = await User.findOne({ email }).catch((error) => {
            throw new Error('Error occurred during user search: ' + error.message);
        });

        if (!user) {
            return res.status(400).send('User not Found');
        }


        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        console.log(user)
        console.log(otp)
        await user.save().catch((error) => {
            throw new Error('Error occurred during user save: ' + error.message);
        });

        // Send OTP by email
        try {
            await sendOtpViaEmail(email, otp);
            console.log('Email sent');
        } catch (error) {
            throw new Error('Error occurred during email sending: ' + error.message);
        }

        return res.status(200).json({
            message: 'Otp send to Email',
            email
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
};


const updatePassword = async (req, res) => {
  try {
      const uid = req.user.id;
      console.log(uid)
      const password = req.body.password;
      if (!password) {
          return res.status(500).send('password not passed');
      }

      let user = await User.findById(uid);
      console.log(user)
      if (!user) {
          return res.status(400).send('User not Found');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({
          message: 'Password Updated',
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
}


const verifyUser = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      let user;
      if (email) {
        user = await User.findOne({ email });
      }
      else{
        return res.status(400).json({ msg: 'Email not passed ' });

      }
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist' });
      }
      console.log(otp)
      console.log(user.otp)
      if (otp === user.otp) {
        user.otp = null; // Clear OTP
        await user.save();
        const payload = {
          id: user.id,
          email: user.email,
          role: user.username,
        };
  
        let jwt_secret = '';
       
          jwt_secret = process.env.JWT_SECRET;
  
        jwt.sign(
          payload,
          jwt_secret,
          {
            expiresIn: '30 days'
  
          },
          async (err, token) => {
            if (err) {
              console.log('Error during JWT signing:', err);
              throw err;
            }
            console.log('Generated token:', token);
  
  
  
            res.json({
              message: 'Verified successfully',
              token,
              user: {
                id: user._id,
                name: user.username,
                email: user.email,
              },
            });
          }
        );
      } else {
        return res.status(400).json({ msg: 'Invalid OTP' });
      }
    } catch (err) {
      console.error('Error caught:', err.message);
      res.status(500).send('Server Error');
    }
  };


module.exports = { recoverPassword, updatePassword,verifyUser };
