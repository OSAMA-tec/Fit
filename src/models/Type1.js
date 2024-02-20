const mongoose = require('mongoose');

const ExerciseEntrySchema = new mongoose.Schema({
    exerciseIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
    }],
    reps: {
        type: Number,
    },
    sets: {
        type: Number,
    }
});

const DaySchemaType1 = new mongoose.Schema({
    dayNumber: {
        type: Number,
    },
    exercises: [ExerciseEntrySchema]
});

const Type1ChallengeSchema = new mongoose.Schema({
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    exerciseSchedule: [DaySchemaType1]
});

module.exports = mongoose.model('Type1Challenge', Type1ChallengeSchema);
