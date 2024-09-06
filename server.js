const express = require('express');
const mongoose = require('mongoose');
const Workout = require('./models/Workout');

const app = express()
const PORT = 3000

app.use(express.json())

mongoose.connect('mongodb://localhost/runningTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', function() {
    console.log("Connection is made wooooo!!!")
}).on('error', function(error) {
    console.log('Connection Error', error)
});

// Create a new workout
app.post('/workouts', async (req, res) => {
    try {
      const {date, duration, distance, heartRate, typeOfRun, shoeType, nickName } = req.body;
      const newWorkout = new Workout({ date, duration, distance, heartRate, typeOfRun, shoeType, nickName});
      await newWorkout.save();
      res.status(201).json(newWorkout);
    } 
    catch (error) {
      res.status(400).json({ message: 'Error creating workout', error });
    }
  });
  