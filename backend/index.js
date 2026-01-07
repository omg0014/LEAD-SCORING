require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const bootstrap = async () => {
    try {
        // 1. Start MongoDB (System or Embedded)
        // We'll just define the connection URI globally for the app to use
        let mongoUri = process.env.MONGO_URI;
        try {
            await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
            console.log('MongoDB Connected (System)');
        } catch (err) {
            console.log('System MongoDB failed, starting embedded...');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            // Disconnect the failed attempt before connecting again
            await mongoose.connect(mongoUri);
            console.log('MongoDB Connected (Embedded):', mongoUri);
            process.env.MONGO_URI = mongoUri;
        }

        // 2. Start Application
        // We require server.js HERE so that it picks up the new process.env values
        require('./server');

    } catch (error) {
        console.error('Bootstrap Error:', error);
        process.exit(1);
    }
};

bootstrap();
