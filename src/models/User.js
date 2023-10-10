const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    },
  points: {
    type: String,
    },
  otp: {
    type: String,
    },
  gender: {
    type: String,
    enum: ['male', 'female'],
    },
  age: {
    type: Number,
    },
  DateofBirth: {
    type: Date,
    },
  height: {
    type: Number,
    },
  weight: {
    type: Number,
    },
  workoutRoutine: {
    type: String,
    enum: ['Gym', 'Home'],
    },
  fitnessLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
  topGoal: {
    type: String,
    enum: ['Maintaining', 'Bulking', 'Cutting'],
    },
  workoutPerWeek: {
    type: Number,
    min: 1,
    max: 7,
    },
  points: {
    type: Number,
    default: 0
  },
  profilePic: {
    type: String,
    default: ''
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: 'Plan'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);