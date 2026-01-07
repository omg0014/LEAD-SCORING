require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { ScoringRule } = require('./models');

// Routes
const eventRoutes = require('./routes/eventRoutes');
const leadRoutes = require('./routes/leadRoutes');
const ruleRoutes = require('./routes/ruleRoutes');

const app = express();
const server = http.createServer(app);

// Connect to Database (Only if not already connected - though index.js handles it)
// Connect to Database (Only if not already connected - though index.js handles it)
if (mongoose.connection.readyState === 0) {
    connectDB().then(async () => {
        await seedRules();
    }).catch(err => {
        console.error('Failed to connect to DB during startup:', err.message);
        // We do NOT exit here. We let the server start so it can respond with 500 errors
        // instead of crashing effectively allowing the "CORS" headers to still be sent by the error handler.
    });
} else {
    // Already connected by index.js
    seedRules();
}

async function seedRules() {
    try {
        const count = await ScoringRule.countDocuments();
        if (count === 0) {
            await ScoringRule.insertMany([
                { eventType: 'Page View', points: 5 },
                { eventType: 'Email Open', points: 10 },
                { eventType: 'Form Submission', points: 20 },
                { eventType: 'Demo Request', points: 50 },
                { eventType: 'Purchase', points: 100 },
            ]);
            console.log('Default scoring rules seeded');
        }
    } catch (err) {
        console.error('Seeding error:', err);
    }
}

// Middleware

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://lead-scoring-front.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

// Allow specific origins with credentials
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            // Optional: You can choose to allow all or log warning
            // For now, we are permissive but using specific list allows credentials to work better
            // than origin: true in some specific browser/proxy scenarios, 
            // but origin: true is generally fine too. 
            // Let's stick to true for maximum flexibility unless specific blocking
            // For Vercel, explicit is better.
            return callback(null, true);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors()); // Enable pre-flight for all routes
app.use(express.json());



// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/rules', ruleRoutes);

// Health Check - Important for Vercel
app.get('/', (req, res) => {
    res.status(200).send('Event-Driven Lead Scoring API Running');
});
app.get('/api', (req, res) => {
    res.status(200).send('API Root Healthy');
});
app.head('/', (req, res) => {
    res.status(200).end();
});

const PORT = process.env.PORT || 5001;
// Socket.IO - Only initialize if NOT in strict serverless mode or handle gracefully
// Socket.IO - Initialize unconditionally (supports polling on Vercel)
let io;
try {
    io = require('./socket').init(server);
    console.log('Socket.IO initialized');
} catch (e) {
    console.error('Socket.IO failed to initialize:', e);
}

// Global Error Handler - MUST be last
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
        trace: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Only start server if running directly (not required as a module)
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = { app, server, PORT };
