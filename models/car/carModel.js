const mongoose = require('mongoose')
const carModel = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    },
    carMake: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    carYear: {
        type: Number,
        required: true,
    },
    carLicenseNumber: {
        type: String,
        required: true
    },
    features: {
        type: Array,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    transmission: {
        type: String,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    carCategory: {
        type: String,
        required: true
    },
    dropPoint: {
        type: Array,
        required: true
    },
    carImage1: {
        type: String,
        required: true,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lifewire.com%2Fuploading-and-downloading-online-3985950&psig=AOvVaw2Bm1k20S6079Zypd9Kmq82&ust=1702911117808000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNDz7rncloMDFQAAAAAdAAAAABAD"

    },
    carImage2: {
        type: String,
        required: true,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lifewire.com%2Fuploading-and-downloading-online-3985950&psig=AOvVaw2Bm1k20S6079Zypd9Kmq82&ust=1702911117808000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNDz7rncloMDFQAAAAAdAAAAABAD"

    },
    carImage3: {
        type: String,
        required: true,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lifewire.com%2Fuploading-and-downloading-online-3985950&psig=AOvVaw2Bm1k20S6079Zypd9Kmq82&ust=1702911117808000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNDz7rncloMDFQAAAAAdAAAAABAD"

    },
    carImage4: {
        type: String,
        required: true,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lifewire.com%2Fuploading-and-downloading-online-3985950&psig=AOvVaw2Bm1k20S6079Zypd9Kmq82&ust=1702911117808000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNDz7rncloMDFQAAAAAdAAAAABAD"

    },
    Rc: {
        type: String,
        required: true,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lifewire.com%2Fuploading-and-downloading-online-3985950&psig=AOvVaw2Bm1k20S6079Zypd9Kmq82&ust=1702911117808000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNDz7rncloMDFQAAAAAdAAAAABAD"

    },
    bookingdates: [
        {
            startingdate: { type: String },
            endingdate: { type: String },
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
            }
        },
    ],
    status: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model("carModel", carModel)