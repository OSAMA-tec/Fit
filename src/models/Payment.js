const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  packageId: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'Pending'
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
