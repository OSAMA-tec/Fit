const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(1); 
    }
};

module.exports = dbConnection;