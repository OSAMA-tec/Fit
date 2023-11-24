const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID || 'AWR_XVcg539W0BgtKS6G5OhxKN5mABPlRnYTBUzWrjob0OURiVU5kp7sn0iXUanJTg7_wfL5Y7wEbeYn';
  let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'EIr2qg5Vyv80wXrP98FXQ2-gQz45pUQvLlPAukiz1iEgu37TF1k-xy_4LYTPyHDIJaBYw1a8yGRlbNRB';

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = {client};