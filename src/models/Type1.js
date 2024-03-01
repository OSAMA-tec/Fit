const mongoose = require('mongoose');

const exerciseItemSchema = new mongoose.Schema({
  exerciseIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
  }],
  sets: {
    type: Number,
  },
  reps: {
    type: Number,
  },
  completed: {
    type: Boolean,
    default: false
  },
  eachExercise: {
    type: Boolean,
    default: false
  }
});

const dailyExerciseSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 14
  },
  exercises: {
    type: [exerciseItemSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 7']
  }
});

function arrayLimit(val) {
  return val.length === 7;
}

const challengeSchema = new mongoose.Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  dailyExercises: {
    type: [dailyExerciseSchema],
    validate: [daysArrayLimit, '{PATH} exceeds the limit of 14']
  },
  userId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
});

function daysArrayLimit(val) {
  return val.length === 14;
}

const Type1Challenge = mongoose.model('Type1Challenge', challengeSchema);

module.exports = Type1Challenge;
