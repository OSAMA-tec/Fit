const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  amount: {
    type: Number,
  },
  packageName: {
    type: String,
  },

  paypalPaymentId: {
    type: String
  },
  paymentStatus: {
    type: String,
    default:'Pending'
  },
  details: {
    type: String,
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
