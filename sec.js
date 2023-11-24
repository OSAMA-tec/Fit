const https = require('https');
const querystring = require('querystring');

// Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your actual credentials
const clientId = 'AWR_XVcg539W0BgtKS6G5OhxKN5mABPlRnYTBUzWrjob0OURiVU5kp7sn0iXUanJTg7_wfL5Y7wEbeYn';
const clientSecret = 'EIr2qg5Vyv80wXrP98FXQ2-gQz45pUQvLlPAukiz1iEgu37TF1k-xy_4LYTPyHDIJaBYw1a8yGRlbNRB';

// Base64 encode the client ID and client secret
const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Prepare the data
const postData = querystring.stringify({
  'grant_type': 'client_credentials'
});

const options = {
  hostname: 'api.sandbox.paypal.com',
  path: '/v1/oauth2/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'Accept-Language': 'en_US',
    'Authorization': `Basic ${base64Credentials}`,
    'Content-Length': postData.length
  }
};

// Make the request
const req = https.request(options, (res) => {
  let body = '';

  res.on('data', (d) => {
    body += d;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      // If the call was successful, parse the body
      const parsedBody = JSON.parse(body);
      console.log('Access Token:', parsedBody.access_token);
    } else {
      // If the call was not successful, log the entire response
      console.error('Failed to get access token:', body);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Send the request with the data
req.write(postData);
req.end();
