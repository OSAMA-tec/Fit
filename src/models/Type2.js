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
    },
    eachExercise: {
        type: Boolean,
        default: false
      }
});

const DaySchemaType2 = new mongoose.Schema({
    dayNumber: {
        type: Number,
    },
    exercises: [ExerciseEntrySchema],
});

const Type2ChallengeSchema = new mongoose.Schema({
    requiredPoints: {
        type: Number,
        default: 50
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    exerciseSchedule: [DaySchemaType2],
});

module.exports = mongoose.model('Type2Challenge', Type2ChallengeSchema);
