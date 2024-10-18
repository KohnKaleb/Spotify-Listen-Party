const WebSocket = require('ws');

const rooms = {};

const createChatServer = () => {
    server.on('connection', (socket) => {
        const wws = new WebSocket.Server({ server });
    
        socket.on('message', (msg) => {
        });
    
        socket.on('close', () => {
        });
    });
};

module.exports = createChatServer;