const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    name: {
      type: String,
    },
    collections: [{
      type: Schema.Types.ObjectId,
      ref: 'Collection'
    }],
    subscription: {
      type: String,
      // enum: ['one month', 'three months', 'six months', 'one year'],
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    durationInDays: {
      type: Number,
    }
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Plan', PlanSchema);