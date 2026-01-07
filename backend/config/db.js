const mongoose = require('mongoose');

// FAIL-SAFE: NEVER load mongodb-memory-server in production/Vercel
// It causes huge bundle sizes and timeouts.
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

const connectDB = async () => {
    try {
        const connStr = process.env.MONGO_URI;
        if (!connStr && isProduction) {
            throw new Error('MONGO_URI is missing in production!');
        }

        // Try connecting to provided URI first
        if (connStr) {
            console.log('Connecting to MongoDB...');
            await mongoose.connect(connStr, { serverSelectionTimeoutMS: 5000 });
            console.log('MongoDB Connected.');
            return;
        }

        // --- LOCAL FALLBACK ONLY ---
        if (!isProduction) {
            console.log('No MONGO_URI, starting embedded database (dev only)...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            console.log('Embedded MongoDB URI:', uri);
            await mongoose.connect(uri);
        } else {
            console.error('Fatal: No MONGO_URI provided in production.');
            process.exit(1);
        }


    } catch (error) {
        console.error('MongoDB Connection Check Failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
