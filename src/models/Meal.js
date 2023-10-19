
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealPlanSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mealPlan: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      meals: [{
        mealName: {
          type: String,
          required: true
        },
        mealItems: {
          type: [String],
          required: true
        }
      }]
    }],
    date: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });
  
module.exports = mongoose.model('MealPlan', MealPlanSchema);