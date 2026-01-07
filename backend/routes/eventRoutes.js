const express = require('express');
const router = express.Router();
const eventQueue = require('../queue/eventQueue');
const { Event } = require('../models');

// POST /api/events
router.post('/', async (req, res) => {
    try {
        const { eventId, leadId, eventType, timestamp, metadata } = req.body;

        if (!eventId || !leadId || !eventType || !timestamp) {
            return res.status(400).json({ error: 'Missing required fields' });
        }


        const existing = await Event.findOne({ eventId });
        if (existing) {
            return res.status(409).json({ message: 'Event already exists', event: existing });
        }

        // Process Event (In-Memory)
        await eventQueue.add({
            eventId,
            leadId,
            eventType,
            timestamp,
            metadata
        });

        res.status(202).json({ message: 'Event accepted asynchronously', eventId });
    } catch (error) {
        console.error('Event Ingestion Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// POST /api/events/batch
router.post('/batch', async (req, res) => {
    try {
        const events = req.body;
        if (!Array.isArray(events)) {
            return res.status(400).json({ error: 'Expected an array of events' });
        }

        console.log(`Received batch of ${events.length} events`);

        let processed = 0;
        for (const evt of events) {
            if (!evt.eventId || !evt.leadId || !evt.eventType) continue;

            await eventQueue.add(evt);
            processed++;
        }

        res.json({ message: `Processed ${processed} events from batch` });
    } catch (error) {
        console.error('Batch Error:', error);
        res.status(500).json({ error: 'Batch processing failed' });
    }
});

module.exports = router;
