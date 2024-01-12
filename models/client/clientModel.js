const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
    },
    phone: {
        type: Number,
        //required: true,
    },
    password: {
        type: String,
        //required: true
    },
    repassword: {
        type: String,
        //required: true
    },
    userImage: {
        type: String,
        default: "https://res.cloudinary.com/djbokpgy8/image/upload/v1702562587/yhbrme3piovw20620awv.png"
    },
    licenseFront: {
        type: String,
        default: "https://res.cloudinary.com/djbokpgy8/image/upload/v1702562813/slpxdfefvfzq9hlcjh6i.webp"
    },
    licenseBack: {
        type: String,
        default: "https://res.cloudinary.com/djbokpgy8/image/upload/v1702562865/fj05eyxoehny2poqe9v7.jpg"
    },
    district: {
        type: String,
    },
    age: {
        type: Number,

    },
    wallet: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false
    }

})
module.exports = mongoose.model("client", userSchema)
