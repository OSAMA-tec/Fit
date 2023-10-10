const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  collection: {
    type: Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
