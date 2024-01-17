const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "client",
        },
        partnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Partner",
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "booking",
        },
        chat: [
            {
                user: {
                    type: String,

                },
                partner: {
                    type: String,
                }
            }
        ],
        userMessage: {
            type: Boolean,
            default: false
        },
        PartnerMessage: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Chat", chatSchema);
