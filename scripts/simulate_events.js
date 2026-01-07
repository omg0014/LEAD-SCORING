const axios = require('axios');
const API_URL = 'http://localhost:5001/api';

const EVENT_TYPES = ['Page View', 'Email Open', 'Form Submission', 'Demo Request', 'Purchase'];
const LEADS = ['lead_1', 'lead_2', 'lead_3', 'lead_4', 'lead_5'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sendEvent = async () => {
  const leadId = getRandomElement(LEADS);
  const eventType = getRandomElement(EVENT_TYPES);
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  try {
    await axios.post(`${API_URL}/events`, {
      eventId,
      leadId,
      eventType,
      timestamp: new Date().toISOString(),
      metadata: { source: 'simulation_script' }
    });
    console.log(`Sent ${eventType} for ${leadId}`);
  } catch (error) {
    console.error('Error sending event:', error.cause ? error.cause : error.message);
    if (error.response) console.error('Response:', error.response.status, error.response.data);
  }
};

const runSimulation = async () => {
  console.log('Starting Event Simulation...');
  for (let i = 0; i < 20; i++) {
    await sendEvent();
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('Simulation Complete.');
};

runSimulation();
