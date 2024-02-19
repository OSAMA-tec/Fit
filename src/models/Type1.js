const mongoose = require('mongoose');

const ExerciseEntrySchema = new mongoose.Schema({
    exerciseIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    }],
    reps: {
        type: Number,
        required: true
    },
    sets: {
        type: Number,
        required: true
    }
});

const DaySchemaType1 = new mongoose.Schema({
    dayNumber: {
        type: Number,
        required: true
    },
    exercises: [ExerciseEntrySchema]
});

const Type1ChallengeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    exerciseSchedule: [DaySchemaType1]
});

module.exports = mongoose.model('Type1Challenge', Type1ChallengeSchema);
