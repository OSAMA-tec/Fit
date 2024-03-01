const mongoose = require('mongoose');

const DailyStatusSchema = new mongoose.Schema({
    dayNumber: {
        type: Number,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    proofType: String,
    proofURL: String
});

const UserStatusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type2Challenge',
        required: true
    },
    dailyStatus: [DailyStatusSchema],
    overallStatus: {
        challengeCompleted: {
            type: Boolean,
            default: false
        },
        pointsEarned: {
            type: Number,
            default: 0
        },
        penaltyPaid: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = mongoose.model('UserStatus', UserStatusSchema);
