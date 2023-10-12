const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
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
  collection: {
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
  instructions: {
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
