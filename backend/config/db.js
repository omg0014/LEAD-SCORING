const mongoose = require('mongoose');
// Only require mongodb-memory-server if NOT in production/Vercel to avoid large bundle/download attempts
const MongoMemoryServer = process.env.VERCEL ? null : require('mongodb-memory-server').MongoMemoryServer;

const connectDB = async () => {
    try {
        // Try connecting to provided URI first
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });

    } catch (error) {
        console.error('MongoDB Connection Error:', error);

        // In Vercel/Production, we cannot use the embedded database.
        // We must fail fast if the connection fails.
        if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
            console.error('Fatal: Could not connect to MongoDB in production environment.');
            process.exit(1);
        }

        try {
            if (MongoMemoryServer) {
                const mongod = await MongoMemoryServer.create();
                const uri = mongod.getUri();
                console.log('Embedded MongoDB URI:', uri);
                await mongoose.connect(uri);
            } else {
                process.exit(1);
            }
        } catch (err) {
            console.error('Embedded DB failed:', err);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
