require('dotenv').config()
const express = require('express')
const clientRoute = require('./routes/clientRoute')
const adminRoute = require('./routes/adminRoute')
const patner = require('./routes/patnerRoute')
const app = express()
const cors = require('cors')
const http = require('http')
const mongoose = require('mongoose')
const { Server } = require("socket.io");
const server = http.createServer(app)

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000'
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}))

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST', 'PATCH', 'PUT'],
        credentials: true,
    },
});

// Make the io instance accessible anywhere using req.app.get('io')
app.set('io', io);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    })

app.use('/', clientRoute)
app.use("/admin", adminRoute)
app.use('/partner', patner)

io.on("connection", (socket) => {
    if (socket.connected) {
        console.log("Socket is connected");
    } else {
        console.log("Socket is not connected");
    }
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
    socket.on("sentMessage", async () => {
        io.emit("receiveMessage");
    });
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})



const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
