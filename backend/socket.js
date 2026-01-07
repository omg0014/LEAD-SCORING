let io;

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: [
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "https://lead-scoring-front.vercel.app",
                    process.env.CLIENT_URL
                ].filter(Boolean),
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                credentials: true
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    }
};
