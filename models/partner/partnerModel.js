const mongoose = require('mongoose')


const Schema = new mongoose.Schema({
    partnerImage: {
        type: String,
        default: "https://res.cloudinary.com/dboafhu31/image/upload/v1625318266/imagen_2021-07-03_091743_vtbkf8.png"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    localArea: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    aadhaar: {
        type: String,
    },
    panCard: {
        type: String,
    },
    partnerVarify: {
        type: Boolean,
        default: false
    },
    blockStatus: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Partner', Schema)