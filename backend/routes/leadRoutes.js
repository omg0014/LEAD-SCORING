const express = require('express');
const router = express.Router();
const { Lead, ScoreHistory, Event } = require('../models');

// GET  Leaderboard List
router.get('/', async (req, res) => {
    try {
        const { limit = 10, search } = req.query;
        const query = {};
        if (search) {
            query._id = { $regex: search, $options: 'i' };
        }

        const leads = await Lead.find(query)
            .sort({ score: -1 })
            .limit(parseInt(limit));

        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/leads/:id
router.get('/:id', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });

        const history = await ScoreHistory.find({ leadId: req.params.id }).sort({ timestamp: -1 }).limit(50);
        const events = await Event.find({ leadId: req.params.id }).sort({ timestamp: -1 }).limit(50);

        res.json({ lead, history, events });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
