const express = require('express');
const dbConnection = require('./src/config/db'); //  DB connection
const signupRoute = require('./src/routes/userRoute');


const app = express();

// Connect to the DB
dbConnection();
app.use(express.json()); // for parsing application/json
app.use('/api', signupRoute);
app.use(express.json()); // Middleware for parsing JSON data

// Define your routes here

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});