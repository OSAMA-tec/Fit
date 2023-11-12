const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Quote', QuoteSchema);
