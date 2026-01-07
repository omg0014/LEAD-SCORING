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
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/rules', ruleRoutes);

app.get('/', (req, res) => {
    res.send('Event-Driven Lead Scoring API Running');
});

const PORT = process.env.PORT || 5001;
const io = require('./socket').init(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app };
