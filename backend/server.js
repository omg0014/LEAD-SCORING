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
if (mongoose.connection.readyState === 0) {
    connectDB().then(async () => {
        await seedRules();
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
// Middleware
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'https://lead-scoring-front.vercel.app', 'https://lead-scoring-back.vercel.app'];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/rules', ruleRoutes);

app.get('/', (req, res) => {
    res.send('Event-Driven Lead Scoring API Running');
});
app.head('/', (req, res) => {
    res.status(200).end();
});

const PORT = process.env.PORT || 5001;
const io = require('./socket').init(server);

// Only start server if running directly (not required as a module)
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = { app, server, PORT };
