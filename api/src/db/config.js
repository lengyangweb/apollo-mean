const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // connect to db
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // log connection status
        console.log(`MongoDB Connected: ${conn.connection.host}`.yellow.bold.underline);
    } catch (error) {
        // log any errors while trying to connect to db
        console.error(error);

        // exit process
        process.exit(1);
    }
}

module.exports = connectDB;