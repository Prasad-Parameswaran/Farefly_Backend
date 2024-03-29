const mongoose = require('mongoose')
const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "client",
        required: true
    },
    car: {
        type: mongoose.Schema.ObjectId,
        ref: "carModel",
        required: true
    },
    partner: {
        type: mongoose.Schema.ObjectId,
        ref: "Partner"

    },
    pickUpDate: {
        type: Date,
        required: true
    },
    PickupTime: {
        type: String,
        //required: true
    },
    dropTime: {
        type: String,
        //required: true
    },
    dropDate: {
        type: Date,
        required: true
    },

    paymentMethod: {
        type: String,

    },
    paymentStatus: {
        type: String,

    },
    grandTotal: {
        type: Number,
    },
    TotalAmount: {
        type: Number,
        required: true
    },
    pickUpPlace: {
        type: String,
    },
    dropPlace: {
        type: String,
    },
    subLocation: {
        type: String,
    },
    Sgst: {
        type: Number,
        required: true
    },
    Cgst: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: Number,
    },
    additionalAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "booked"
    },
    date: {
        type: Date,
    }

})
module.exports = mongoose.model("booking", BookingSchema)