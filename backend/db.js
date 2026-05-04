const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;

        // Use in-memory MongoDB if no connection string is provided
        if (!uri) {
            console.log("No MONGO_URI found in .env. Starting in-memory MongoDB for local dev...");
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
            console.log("In-memory MongoDB started. Note: Data will not be preserved after restart.");
        }

        const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/pentrola');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
