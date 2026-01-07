const { Lead, Event, ScoreHistory, ScoringRule } = require('../models');
const { io } = require('../server');
const { getIO } = require('../socket');


const calculateScore = async (eventType) => {
    const rule = await ScoringRule.findOne({ eventType, isActive: true });
    return rule ? rule.points : 0;
};

const processEvent = async (eventData) => {
    const { eventId, leadId, eventType, timestamp, metadata } = eventData;

    // Idempotency Check
    const existingEvent = await Event.findOne({ eventId });
    if (existingEvent && existingEvent.processed) {
        console.log(`Duplicate event ${eventId} skipped.`);
        return;
    }

    // Create or Update Lead
    let lead = await Lead.findById(leadId);
    if (!lead) {
        lead = new Lead({ _id: leadId, score: 0 });
    }

    // Get Score Points
    const points = await calculateScore(eventType);
    if (points === 0 && eventType !== 'Identity') {
        // Maybe log unknown event type?
    }

    // Update Score
    const oldScore = lead.score;
    const newScore = oldScore + points;

    lead.score = newScore;
    lead.lastEventId = eventId;
    lead.updatedAt = new Date();

    await lead.save();

    // Save Event record
    if (!existingEvent) {
        await Event.create({
            eventId,
            leadId,
            eventType,
            timestamp,
            metadata,
            processed: true
        });
    } else {
        existingEvent.processed = true;
        await existingEvent.save();
    }

    // Create History Record
    await ScoreHistory.create({
        leadId,
        eventId,
        oldScore,
        newScore,
        delta: points,
        timestamp: new Date() // Processing time for history
    });

    // Real-time Update
    try {
        getIO().emit('leadUpdated', { leadId, score: newScore });
    } catch (err) {
        console.error('Socket emit failed:', err.message);
    }
};

module.exports = { processEvent };
