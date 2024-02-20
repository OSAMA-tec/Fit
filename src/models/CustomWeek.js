const mongoose = require('mongoose');

const CustomExerciseEntrySchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  exerciseIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  }]
});

const CustomizedExercisePlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  weeklyExercisePlan: [CustomExerciseEntrySchema]
});



module.exports = mongoose.model('CustomizedExercisePlan', CustomizedExercisePlanSchema);
