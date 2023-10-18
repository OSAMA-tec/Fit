const express = require('express');
const dbConnection = require('./src/config/db'); //  DB connection
const signupRoute = require('./src/routes/userRoute');
const exerciseRoute = require('./src/routes/exerciseRoute');
const planRoute = require('./src/routes/planRoute');
const cors=require('cors')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(cors())
// Connect to the DB
dbConnection();
app.use(express.json()); 


app.use('/api', signupRoute);
app.use('/api', exerciseRoute);
app.use('/api', planRoute);

// Define your routes here

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});