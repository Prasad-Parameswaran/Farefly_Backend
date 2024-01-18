const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for the Express server
app.use(cors());

// Create a new Socket.IO server and enable CORS for it
const io = new Server(server, {
    cors: {
        origin: process.env.baseUrl,
        methods: ['GET', 'POST', 'PATCH', 'PUT'],
        credentials: true,
    },
});

// Your Socket.IO logic goes here

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
