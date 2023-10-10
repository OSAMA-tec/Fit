const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    name: {
      type: String,
      enum: ['Free', 'Premium', 'Elite', 'Special'],
      required: true
    },
    collections: [{
      type: Schema.Types.ObjectId,
      ref: 'Collection'
    }]
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Plan', PlanSchema);
