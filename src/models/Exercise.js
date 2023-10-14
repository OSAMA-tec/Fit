const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExerciseSchema = new Schema({
  name: {
    type: String,
  },
  instructions: {
    type: [String], // Assuming instructions should be an array of strings
  },
  about: {
    type: String,
  },
  image: {
    type: [String],
  },
  dayOfWeek: {
    type: String,
  },
  backgroundPic: {
    type: String,
  },
  collectionRef: { // Changed from 'collection' to 'collectionRef'
    type: Schema.Types.ObjectId,
    ref: 'Collection',
  },
  force: {
    type: String,
  },
  level: {
    type: String,
  },
  mechanic: {
    type: String,
  },
  equipment: {
    type: String,
  },
  primaryMuscles: {
    type: [String],
  },
  secondaryMuscles: {
    type: [String],
  },
  category: {
    type: String,
  },
  id: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
