const express = require('express')
const clientRoute = require('./routes/clientRoute')
const adminRoute = require('./routes/adminRoute')
const patner = require('./routes/patnerRoute')
const app = express()
const cors = require('cors')
const http = require('http')
const mongoose = require('mongoose')
const { Server } = require("socket.io");
app.use(cors())
const server = http.createServer(app)

require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
mongoose.connect(process.env.Database)
app.use('/', clientRoute)
app.use("/admin", adminRoute)
app.use('/partner', patner)

//'https://farefly.de-vip.online'

//app.use(cors())
const io = new Server(server, {
    cors: {
        origin: process.env.baseUrl,
        methods: ['GET', 'POST', 'PATCH', 'PUT'],
        credentials: true,
    },
});



io.on("connection", (socket) => {
    // Check if the socket is connected
    if (socket.connected) {
        console.log("Socket is connected");
    } else {
        console.log("Socket is not connected");
    }
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    socket.on("sentMessage", async () => {
        console.log(
            "Connection is on-------------------------------------------------------------"
        );
        io.emit("receiveMessage");
    });
})







server.listen(4000, () => {
    console.log('server is running ')
})
