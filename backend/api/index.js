const path = require('path');
// Vercel sometimes flattens structures or behaves differently. 
// Using try-catch to attempt both relative and absolute resolution.
let app;
try {
    const serverModule = require(path.join(__dirname, '..', 'server'));
    app = serverModule.app;
} catch (e) {
    console.warn('Failed to load server from parent dir, trying sibling...', e);
    // Fallback if Vercel moves file to same dir
    app = require('../server').app;
}

module.exports = app;
