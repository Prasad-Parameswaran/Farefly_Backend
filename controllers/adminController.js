const client = require('../models/client/clientModel')
const partner = require('../models/partner/partnerModel')
const carModel = require('../models/car/carModel')
const bookingModel = require('../models/booking/booking')
const jwt = require('jsonwebtoken')
const coupon = require('../models/coupon/coupon')


const login = async (req, res) => {
    try {
        const { email, password } = req.body.data
        if (email === process.env.adminEmail && process.env.adminPassword === password) {
            const adminId = process.env.adminEmail
            const jwtcreating = jwt.sign({
                id: adminId,
                role: 'admin',
            }, 'admin');

            res.status(200).json({ success: true, message: 'signIn successfully.', adminToken: jwtcreating })
        } else {
            res.status(201).json({ success: false, message: 'invalid password or email..' })
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}



const userList = async (req, res) => {
    try {
        const user = await client.find()

        if (user) {
            res.status(200).json({ success: true, message: ("working"), data: user })
        }
    } catch (error) {

        res.status(500).json({ success: false, message: "Internal server error" });
    }
}



const partnerList = async (req, res) => {
    try {

        const partners = await partner.find()

        if (partners) {
            res.status(200).json({ success: true, message: ("working"), data: partners })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const partnerView = async (req, res) => {
    try {
        const viewPartner = await partner.find({ _id: req.query.id })

        if (viewPartner) {
            res.status(200).json({ success: true, data: viewPartner })
        } else {
            res.status(200).json({ success: true, message: 'something went wrong' })

        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const userStatus = async (req, res) => {
    try {
        const users = await client.findById({ _id: req.query.id })
        if (users.status) {
            var user = false
        } else {
            var user = true
        }
        const userData = await client.findByIdAndUpdate(
            { _id: req.query.id },
            { $set: { status: user } }
        );
        const UpdatedUser = await client.find()
        if (UpdatedUser) {
            res.status(200).json({ success: true, message: ("working"), data: UpdatedUser })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }


}

const partnerStatus = async (req, res) => {
    try {
        const users = await partner.findById({ _id: req.query.id })
        if (users.blockStatus) {
            var user = false
        } else {
            var user = true
        }
        const userData = await partner.findByIdAndUpdate(
            { _id: req.query.id },
            { $set: { blockStatus: user } }
        );
        const UpdatedUser = await partner.find()
        if (UpdatedUser) {
            res.status(200).json({ success: true, message: ("working"), data: UpdatedUser })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }



}


const PartnerVarifyAccept = async (req, res) => {
    try {
        const findpartner = await partner.findById({ _id: req.query.id })
        const partnerUpdate = await partner.findByIdAndUpdate(
            { _id: req.query.id },
            { $set: { partnerVarify: true } }
        );
        const partnerlist = await partner.find()
        if (partnerlist) {
            res.status(200).json({
                success: true, message: (`${findpartner.name} Request Accepted`), data: partnerlist
            })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }


}



const PartnerVarifyCancel = async (req, res) => {
    try {
        const removePartner = await partner.findByIdAndDelete({ _id: req.query.id })
        const partersList = await partner.find()
        if (partersList) {
            res.status(200).json({ success: true, message: (`${removePartner?.name} Request Cancelled`), data: partersList })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })


    }

}


const carDatas = async (req, res) => {
    try {
        const listCar = await carModel.find()
        if (listCar) {
            res.status(200).json({ success: true, message: "working", data: listCar })
        } else {
            res.status(200).json({ success: false, message: ("something went wrong") })

        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })


    }
}

const carDetails = async (req, res) => {
    try {
        const viewCar = await carModel.findById({ _id: req.query.id })
        if (viewCar) {
            res.status(200).json({ success: true, message: "working", data: viewCar })
        } else {
            res.status(200).json({ success: false, message: ("something went wrong") })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }

}
const ListOrUnlist = async (req, res) => {
    try {
        const carStatus = await carModel.findById({ _id: req.query.id })
        if (carStatus.status) {
            var car = false
        } else {
            var car = true
        }
        const carStatusUpdte = await carModel.findByIdAndUpdate(
            { _id: req.query.id },
            { $set: { status: car } }
        );
        const carList = await carModel.find()
        if (carStatusUpdte) {
            res.status(200).json({ success: true, message: ("working"), data: carList })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }


}

const addCoupon = async (req, res) => {
    try {
        const { couponName, expiryDate, discount, max, Code, Event } = req.body.data.user
        const dateOnly = new Date(expiryDate).toISOString().split('T')[0]
        const couponAvailable = await coupon.find()
        if (couponAvailable) {
            const couponFinding = couponAvailable.find(val => val.couponCode == Code)

            if (couponFinding) {
                res.status(200).json({ success: false, message: ("Copon Code Existing..") })
            } else {
                const Coupon = new coupon({
                    couponName: couponName,
                    experirydate: dateOnly,
                    discountamount: discount,
                    maxBookingAmount: max,
                    couponCode: Code,
                    event: Event,
                })
                await Coupon.save().then(() => {
                    res.status(200).json({ success: true, message: "successfully added" })
                })
            }

        } else {

            const Coupon = new coupon({
                couponName: couponName,
                experirydate: dateOnly,
                discountamount: discount,
                maxBookingAmount: max,
                couponCode: Code,
                event: Event,
            })
            await Coupon.save().then(() => {
                res.status(200).json({ success: true, message: "successfully added" })
            })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }
}

const allCouponDetails = async (req, res) => {
    try {

        const response = await coupon.find()
        if (response) {
            res.status(200).json({ success: true, bookingData: response })

        } else {

        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }
}

const BlockOrUnblock = async (req, res) => {
    try {
        const couponDetails = await coupon.findOne({ _id: req.query.id })
        if (couponDetails.status) {
            var couponStatus = false
        } else {
            var couponStatus = true
        }
        const couponDatas = await coupon.findByIdAndUpdate(
            { _id: req.query.id },
            { $set: { status: couponStatus } }
        )
        const couponD = await coupon.find()
        if (couponD) {
            res.status(200).json({ success: true, message: "succcessfully change status", data: couponD })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })


    }
}

const bookingList = async (req, res) => {
    try {
        const bookings = await bookingModel.find().populate("car").populate('user')
        if (bookings) {
            res.status(200).json({ success: true, bookingDetails: bookings })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }
}



const adminChartbooking = async (req, res) => {
    try {
        const Totalusers = await client.find()
        const ToatalPartners = await partner.find()
        const Bookingdata = await bookingModel.find().populate('user').populate('partner').populate('car')

        let total = 0;
        if (Bookingdata.length > 0) {
            const complete = Bookingdata.filter(
                (booking) => booking.status === "Completed"
            );

            if (complete.length > 0) {
                const data = complete.map((value) => value.TotalAmount);
                total = data.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                );
            } else {
                console.log("No completed bookings");
            }
        } else {
            console.log("null");
        }

        if (Bookingdata) {
            console.log(Bookingdata, 'this is booking data')

            res.status(201).json({
                success: true,
                message: "data find",
                findbooking: Bookingdata,
                total,
                ToatalPartners,
                Totalusers
            });
        } else {
            res.status(200).json({ success: false, message: "data is not find" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


const adminsales = async (req, res) => {
    try {
        const limit = 7;

        const totalItems = await bookingModel.countDocuments();

        const totalPages = Math.ceil(totalItems / limit);
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const datas = await bookingModel.find()
            .populate("partner")
            .populate("user")
            .skip(skip)
            .limit(limit);
        let total = 0;

        if (datas.length > 0) {
            const bookingdata = datas.filter(
                (booking) => booking.status === "Completed"
            );
            const data = bookingdata.map((value) => value.TotalAmount);
            total = data.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            );
            const bookingID = bookingdata.map((booking) => booking._id);
            const threeDigitIDs = bookingID.map((hexString) => {
                const decimalNumber = parseInt(hexString, 16);
                return ("11" + (decimalNumber % 1000)).slice(-3); // Ensure it's a three-digit number
            });

            const sortedNumericIDs = threeDigitIDs.map(Number).sort((a, b) => a - b);

            if (bookingdata) {
                res.status(200).json({
                    success: true,
                    message: "data find",
                    bookingdata,
                    total,
                    IDs: sortedNumericIDs,
                    totalPages,
                    page,
                });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

module.exports = {
    login,
    userList,
    partnerList,
    userStatus,
    partnerStatus,
    PartnerVarifyAccept,
    PartnerVarifyCancel,
    partnerView,
    carDatas,
    carDetails,
    ListOrUnlist,
    addCoupon,
    allCouponDetails,
    BlockOrUnblock,
    bookingList,
    adminChartbooking,
    adminsales
}

































