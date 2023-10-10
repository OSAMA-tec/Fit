const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true
    },
    exercises: [{
      type: Schema.Types.ObjectId,
      ref: 'Exercise'
    }]
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Collection', CollectionSchema);
