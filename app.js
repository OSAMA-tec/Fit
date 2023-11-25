// const express = require('express');
// const dbConnection = require('./src/config/db'); //  DB connection
// const signupRoute = require('./src/routes/userRoute');
// const exerciseRoute = require('./src/routes/exerciseRoute');
// const planRoute = require('./src/routes/planRoute');
// const mealRoute = require('./src/routes/mealRoute');
// const paymentRoute = require('./src/routes/paymentRoute');





// const cors=require('cors')
// const bodyParser = require('body-parser');
// require('dotenv').config();
// const app = express();
// app.use(bodyParser.json({ limit: '500mb' }));
// app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
// app.use(cors())
// // Connect to the DB
// dbConnection();
// app.use(express.json()); 


// app.use('/api', signupRoute);
// app.use('/api', exerciseRoute);
// app.use('/api', planRoute);
// app.use('/api', mealRoute);
// app.use('/api', paymentRoute);

// // Define your routes here

// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });



const fs = require('fs');

// Load the original and updated JSON data
const originalJsonData = JSON.parse(fs.readFileSync('./exerciseDetails.json'));
const updatedJsonData = JSON.parse(fs.readFileSync('./modifiedExerciseDetails.json'));

// Function to find matching gifLinks and add bodyPart to the updated JSON
function mergeExerciseData(originalData, updatedData) {
  // Create a map for quick lookup of original exercise names based on gifLink
  const gifLinkToExerciseNameMap = originalData.reduce((acc, current) => {
    acc[current.gifLink] = current.exerciseName;
    return acc;
  }, {});

  // Iterate over the updated data to add bodyPart where gifLink matches
  updatedData.forEach(exercise => {
    if (gifLinkToExerciseNameMap[exercise.gifLink]) {
      exercise.bodyPart = gifLinkToExerciseNameMap[exercise.gifLink];
    }
  });

  // Save the merged data back to a new file or overwrite the updated file
  fs.writeFileSync('mergedUpdated.json', JSON.stringify(updatedData, null, 2));
}

// Call the function with the loaded data
mergeExerciseData(originalJsonData, updatedJsonData);
