const mongoose = require('mongoose');
const Schema = mongoose.Schema

const workoutSchema = new Schema({
    date: { type: Date, required: true},
    duration: { type: Number, required: true},
    distance: { type: Number, required: true},
    heartRate: { type: Number, required: true}, 
    typeOfRun: { type: String, enum: ['race', 'long run', 'workout'], required: true }, 
    shoeType: { type: String, default: null},
    name: { type: String},
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
