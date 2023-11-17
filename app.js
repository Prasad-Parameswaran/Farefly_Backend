const express = require('express')
const clientRoute = require('./routes/clientRoute')
//const adminRoute = require('./routes/adminRoute')
//const patner = require('./routes/patnerRoute')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')


app.use(cors())
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



mongoose.connect('mongodb://127.0.0.1:27017/firefly').then(() => {
    console.log("mongodb connected...........");
})

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}))


app.use('/', clientRoute)
//app.use("/admin", adminRoute)
//app.use('/patner', patner)

app.listen(4000, () => {
    console.log("start...............");
})
