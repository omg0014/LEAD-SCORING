const mongoose = require('mongoose');

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

const connectDB = async () => {
    try {
        const connStr = process.env.MONGO_URI;
        if (!connStr && isProduction) {
            throw new Error('MONGO_URI is missing in production!');
        }

        if (connStr) {
            try {
                console.log('Connecting to MongoDB (System)...');
                await mongoose.connect(connStr, { serverSelectionTimeoutMS: 2000 });
                console.log('MongoDB Connected (System).');
                return;
            } catch (err) {
                if (isProduction) throw err;
                console.error('System MongoDB Connection Error:', err);
                console.warn('System MongoDB failed, trying embedded fallback...', err.message);
            }
        }

        if (!isProduction) {
            console.log('Starting embedded database (dev only)...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            console.log('Embedded MongoDB URI:', uri);
            await mongoose.connect(uri);
        } else {
            console.error('Fatal: No MONGO_URI provided in production.');
            throw new Error('No MONGO_URI provided in production');
        }

    } catch (error) {
        console.error('MongoDB Connection Check Failed:', error);
        throw error;
    }
};

module.exports = connectDB;
