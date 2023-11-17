const mongoose = require('mongoose')


const Schema = new mongoose.Schema({
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
    partnerVarify: {
        type: String,
        default: 'pending'
    },
    blockStatus: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Partner', Schema)