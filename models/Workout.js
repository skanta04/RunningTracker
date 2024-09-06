const mongoose = require('mongoose');
const Schema = mongoose.Schema

const workoutSchema = new Schema({
    date: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    distance: {
        type: Number,
        required: true
    },

    heartRate: {
        type: Number,
    }, 
    typeOfRun: { 
        type: String, 
        enum: ['race', 'long run', 'workout'], 
        required: true 
    }, 

    shoeType: {
        type: String
    },

    nickName: {
        type: String
    }
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
