const { processEvent } = require('../services/scoringService');

const eventQueue = {
    add: async (data) => {
        console.log('Processing event (In-Memory):', data.eventId);

        try {
            await processEvent(data);
        } catch (err) {
            console.error('Error processing event:', err);
        }

        return Promise.resolve();
    },

    process: () => { }
};

module.exports = eventQueue;
