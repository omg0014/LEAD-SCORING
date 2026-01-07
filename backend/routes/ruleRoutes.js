const express = require('express');
const router = express.Router();
const { ScoringRule } = require('../models');

// GET /api/rules
router.get('/', async (req, res) => {
    try {
        const rules = await ScoringRule.find();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/rules
router.post('/', async (req, res) => {
    try {
        const { eventType, points, isActive } = req.body;
        const rule = await ScoringRule.findOneAndUpdate(
            { eventType },
            { points, isActive: isActive !== undefined ? isActive : true },
            { new: true, upsert: true }
        );
        res.json(rule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
