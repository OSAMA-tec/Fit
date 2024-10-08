const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExerciseSchema = new Schema({
  name: {
    type: String,
  },
  paid: {
    type: Boolean,
  },
  instructions: {
    type: [String],
  },
  about: {
    type: String,
    default:""
  },
  bodyPart: {
    type: String,
  },
  image: {
    type: [String],
  },
  gifUrl: {
    type: [String],
  },
  dayOfWeek: {
    type: String,
  },
  AI: {
    type: Boolean,
    default:false
  },
  backgroundPic: {
    type: String,
  },
  collectionRef: { 
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
  target: {
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
