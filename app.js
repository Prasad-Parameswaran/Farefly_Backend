//const express = require('express')
//const clientRoute = require('./routes/clientRoute')
//const adminRoute = require('./routes/adminRoute')
//const patner = require('./routes/patnerRoute')
//const app = express()
//const cors = require('cors')
//const http = require('http')
//const mongoose = require('mongoose')
//const { Server } = require("socket.io");

//const server = http.createServer(app)


//const io = new Server(server, {
//    cors: {
//        origin: (origin, callback) => {
//            callback(null, origin === process.env.baseUrl);
//        },
//        credentials: true,
//    },
//});

//io.on("connection", (socket) => {
//    // Check if the socket is connected
//    if (socket.connected) {
//        console.log("Socket is connected");
//    } else {
//        console.log("Socket is not connected");
//    }
//    socket.on("disconnect", () => {
//        console.log("User disconnected");
//    });

//    socket.on("sentMessage", async () => {
//        console.log(
//            "Connection is on-------------------------------------------------------------"
//        );
//        io.emit("receiveMessage");
//    });
//});





//app.use(cors())

//require('dotenv').config()
//app.use(express.json())
//app.use(express.urlencoded({ extended: true }))
//mongoose.connect(process.env.Database)

//app.use(cors({
//    origin: 'https://main.d15nn14n4kkzm8.amplifyapp.com',
//    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//    credentials: true,
//}))


//app.use('/', clientRoute)
//app.use("/admin", adminRoute)
//app.use('/partner', patner)

//server.listen(4000)











const express = require('express');
const clientRoute = require('./routes/clientRoute');
const adminRoute = require('./routes/adminRoute');
const patner = require('./routes/patnerRoute');
const app = express();
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            callback(null, origin === process.env.baseUrl);
        },
        credentials: true,
    },
});

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
        console.log("Connection is on-------------------------------------------------------------");
        io.emit("receiveMessage");
    });
});

// Remove this line, as it's redundant with the later cors() middleware
// app.use(cors());

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.Database);

app.use(cors({
    origin: 'https://main.d15nn14n4kkzm8.amplifyapp.com',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));

app.use('/', clientRoute);
app.use("/admin", adminRoute);
app.use('/partner', patner);

server.listen(4000);
