const mongoose = require('mongoose')
const couponSchema = new mongoose.Schema({
    couponName: {
        type: String,
    },
    experirydate: {
        type: String,
    },
    discountamount: {
        type: Number
    },
    maxBookingAmount: {
        type: Number
    },
    status: {
        type: Boolean,
        default: true
    },
    couponCode: {
        type: String
    },
    event: {
        type: String
    },
    user: [
        {
            id: {
                type: String
            }
        }
    ]


})
module.exports = mongoose.model("coupon", couponSchema)



// this iis coupone