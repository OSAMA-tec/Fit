const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Exercise1Schema = new Schema({
  name: {
    type: String,
  },
  paid: {
    type: Boolean,
  },
  instructions: {
    type: [String],
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
    default:true
  },
  

  collectionRef: { 
    type: Schema.Types.ObjectId,
    ref: 'Collection',
  },

  level: {
    type: String,
  },

}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise1', Exercise1Schema);
//   mechanic: {
//     type: String,
//   },
//   target: {
//     type: String,
//   },
//   equipment: {
//     type: String,
//   },
//   primaryMuscles: {
//     type: [String],
//   },
//   secondaryMuscles: {
//     type: [String],
//   },
//   category: {
//     type: String,
//   },
//   id: {
//     type: String,
//   }
//   force: {
//     type: String,
//   },

//   backgroundPic: {
//     type: String,
//   },
//   about: {
//     type: String,
//   },