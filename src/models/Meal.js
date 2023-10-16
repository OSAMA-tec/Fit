const MealPlanSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    meals: {
      type: [String],
    },
    date: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });
  
  module.exports = mongoose.model('MealPlan', MealPlanSchema);
  