const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Using leadId as _id
    score: { type: Number, default: 0 },
    lastEventId: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
    eventId: { type: String, required: true, unique: true },
    leadId: { type: String, required: true, index: true },
    eventType: { type: String, required: true },
    timestamp: { type: Date, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    processed: { type: Boolean, default: false }
});

// Index for ordering by timestamp per lead
EventSchema.index({ leadId: 1, timestamp: 1 });

const ScoreHistorySchema = new mongoose.Schema({
    leadId: { type: String, required: true, index: true },
    eventId: { type: String, required: true },
    oldScore: { type: Number, required: true },
    newScore: { type: Number, required: true },
    delta: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ScoringRuleSchema = new mongoose.Schema({
    eventType: { type: String, required: true, unique: true },
    points: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
});

const Lead = mongoose.model('Lead', LeadSchema);
const Event = mongoose.model('Event', EventSchema);
const ScoreHistory = mongoose.model('ScoreHistory', ScoreHistorySchema);
const ScoringRule = mongoose.model('ScoringRule', ScoringRuleSchema);

module.exports = { Lead, Event, ScoreHistory, ScoringRule };
