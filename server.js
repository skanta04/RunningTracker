const express = require('express');
const mongoose = require('mongoose');
const Workout = require('./models/Workout');

const app = express()
const PORT = 3000

app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/runningTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', function() {
    console.log("Connection is made wooooo!!!")
}).on('error', function(error) {
    console.log('Connection Error', error)
});

// Root route for the base URL
app.get('/', (req, res) => {
    res.send('SERVER WORKS AYAYAYAYAYAY!');
  });

// Creates a new workout
app.post('/workouts', async (req, res) => {
    try {
      const {date, duration, distance, heartRate, typeOfRun, shoeType, name} = req.body;
      // Create a new workout document
    const newWorkout = new Workout({
        date, 
        duration, 
        distance, 
        heartRate, 
        typeOfRun, 
        shoeType: shoeType || null, 
        name, 
      });

      // save workout to database
      await newWorkout.save();
      res.status(201).json(newWorkout);
    } 
    catch (error) {
      res.status(400).json({ message: 'Error creating workout', error });
    }
  });

// Retrieve workouts with optional filters
app.get('/workouts', async (req, res) => {
    const { date, routeNickname, typeOfRun } = req.query;
  
    let filter = {};
    if (date) filter.date = { $gte: new Date(date) };
    if (routeNickname) filter.routeNickname = routeNickname;
    if (typeOfRun) filter.typeOfRun = typeOfRun; 
  
    try {
      const workouts = await Workout.find(filter);
      res.status(200).json(workouts);
    } catch (error) {
      res.status(400).json({ message: 'Error retrieving workouts', error });
    }
  });

app.get('/workouts/distance-per-week', async (req, res) => {
    try {
        // aggregate is MongoDB aggregation pipeline that allows us to process stuff from database
      const totalDistancePerWeek = await Workout.aggregate([
        {
            // groups are categroized with id week number and then the total distance for that week
          $group: {
            _id: { $week: "$date" },
            totalDistance: { $sum: "$distance" }
          }
        },
        {
            // sorts in ascending order
          $sort: { _id: 1 }
        }
      ]);
      res.status(200).json(totalDistancePerWeek);
    } catch (error) {
      res.status(400).json({ message: 'Error aggregating total distance per week', error });
    }
  });

// average run duration in total
app.get('/workouts/average-duration', async (req, res) => {
    try {
      const averageDuration = await Workout.aggregate([
        {
            // no id for group because there is only one average duration
          $group: {
            _id: null,
            avgDuration: { $avg: "$duration" }
          }
        }
      ]);
      res.status(200).json(averageDuration);
    } catch (error) {
      res.status(400).json({ message: 'Error calculating average duration', error });
    }
  });

app.get('/workouts/distance-per-month', async (req, res) => {
    try {
      const totalDistancePerMonth = await Workout.aggregate([
        {
          $group: {
            // finds month by date
            _id: { $month: "$date" },
            totalDistance: { $sum: "$distance" }
          }
        },
        {
            // sort in ascending
          $sort: { _id: 1 }
        }
      ]);
      res.status(200).json(totalDistancePerMonth);
    } catch (error) {
      res.status(400).json({ message: 'Error aggregating total distance per month', error });
    }
  });
  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
