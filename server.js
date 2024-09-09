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




// base URL route
app.get('/', (req, res) => {
    res.send('SERVER WORKS YAYAYAYAYAY!');
  });




// Creates a new workout
app.post('/workouts', async (req, res) => {
    try {
        let workouts = Array.isArray(req.body) ? req.body : [req.body];
        
        workouts = workouts.map((workout) => {
            const { name, date, duration, distance, heartRate, typeOfRun, shoeType } = workout;
            if (!date || !isValidDate(date)) {
                throw new Error('Invalid date format. Expected YYYY-MM-DD.');
            }
            return {
                name,
                date: new Date(date).toISOString(),  // Convert date to ISO format
                duration, 
                distance, 
                heartRate, 
                typeOfRun, 
                shoeType: shoeType || null,
            };
        });
        const newWorkouts = await Workout.insertMany(workouts);
        res.status(201).json({
            success: true,
            data: newWorkouts,
            message: 'Workouts created successfully',
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: 'Error creating workout',
            details: error.message 
        });
    }
}); 

// Function to check valid date format (YYYY-MM-DD)
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}




// Retrieve workouts with optional filters
app.get('/workouts', async (req, res) => {
    const { startDate, endDate, date, typeOfRun } = req.query;
  
    let filter = {};
    if (date) {
        if (date && !isValidDate(date)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Expected YYYY-MM-DD.'
            })
        }
        filter.date = new Date(date);
    } else if (startDate && endDate) {
        if ((startDate && !isValidDate(startDate) || endDate && !isValidDate(endDate))) {
            return res.status(400).json({
                success: false,
                error: 'Invalid startDate or endDate format. Expected YYYY-MM-DD.'
            })
        }
        filter.date = {$gte: new Date(startDate), $lte: new Date(endDate)};
    }
    if (typeOfRun) filter.typeOfRun = typeOfRun
    
  
    try {
        const workouts = await Workout.find(filter);
        res.status(200).json({
            success: true,
            data: workouts,
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: 'Error retrieving workouts',
            details: error.message
        });
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

        const formattedData = totalDistancePerWeek.map(item => ({
            week: item._id,
            totalDistance: item.totalDistance
        }));

        res.status(200).json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: 'Error aggregating total distance per week', 
            details: error.message });
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
        res.status(200).json({
            success: true,
            data: averageDuration
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: 'Error calculating average duration', 
            details: error.message 
        });
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

    const formattedData = totalDistancePerMonth.map(item => ({
        month: item._id,
        totalDistance: item.totalDistance
    }));

    res.status(200).json({
        success: true,
        data: formattedData,
    });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: 'Error aggregating total distance per month', 
            details: error.message 
        });
    }
});
  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
