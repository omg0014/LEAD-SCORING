const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        // Try connecting to provided URI first
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });

    } catch (error) {

        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            console.log('Embedded MongoDB URI:', uri);
            await mongoose.connect(uri);

        } catch (err) {

            process.exit(1);
        }
    }
};

module.exports = connectDB;
