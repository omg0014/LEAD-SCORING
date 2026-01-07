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

// Connect to Database
if (mongoose.connection.readyState === 0) {
    connectDB().then(async () => {
        await seedRules();
    }).catch(err => {
        console.error('Failed to connect to DB during startup:', err.message);
    });
} else {
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

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/rules', ruleRoutes);


app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(200).json({
        message: 'Event-Driven Lead Scoring API Running',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});
app.get('/api', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(200).json({
        message: 'API Root Healthy',
        database: dbStatus
    });
});
app.head('/', (req, res) => {
    res.status(200).end();
});

const PORT = process.env.PORT || 5001;

// Socket.IO
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


if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = { app, server, PORT };
