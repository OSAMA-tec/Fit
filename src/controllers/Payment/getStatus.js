const Payment = require('../../models/Payment');

const getPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const payment = await Payment.findOne({ userId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ paymentStatus: payment.paymentStatus });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ message: 'Server error while retrieving payment status' });
  }
};


module.exports={getPaymentStatus}