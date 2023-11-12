const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealPlanSchema = new Schema({
  topGoal: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  mealPlan: {
    type: Map,
    of: Map,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
