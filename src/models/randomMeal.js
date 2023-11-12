const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  meal: {
    type: String,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Meal', MealSchema);
