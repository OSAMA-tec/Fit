const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    collections: [{
      type: Schema.Types.ObjectId,
      ref: 'Collection'
    }],
    subscription: {
      type: String,
      // enum: ['one month', 'three months', 'six months', 'one year'],
      required: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    durationInDays: {
      type: Number,
      required: true
    }
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Plan', PlanSchema);