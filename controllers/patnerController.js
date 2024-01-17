
const partnerModel = require('../models/partner/partnerModel')
const carModels = require('../models/car/carModel')
const car = require('../models/car/carModel')
const booking = require('../models/booking/booking')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const clientModel = require('../models/client/clientModel')
const ChatModel = require('../models/chat/chat')

const partnerLogin = async (req, res) => {
    try {
        const partnerDeatils = req.body.data
        const checkPartner = await partnerModel.findOne({ email: partnerDeatils.email })
        if (checkPartner) {
            if (checkPartner.partnerVarify) {
                if (checkPartner.blockStatus) {
                    const checkPassword = await bcrypt.compare(partnerDeatils.password, checkPartner.password)
                    if (checkPassword) {
                        if (checkPartner.partnerVarify === 'pending') {
                            res.status(200).json({ success: false, message: 'You were not varified...' })

                        } else if (checkPartner.partnerVarify === 'rejected') {
                            res.status(200).json({ success: false, message: 'User was rejected...' })

                        } else {
                            const partnerId = checkPartner._id
                            const jwtCreate = jwt.sign({
                                id: partnerId,
                                role: 'partner'
                            }, 'partner')
                            res.status(200).json({ success: true, message: 'successfully logined..', Token: jwtCreate })
                        }

                    } else {
                        res.status(200).json({ success: false, message: 'invalid password or email' })
                    }
                } else {
                    res.status(201).json({ success: false, message: 'You were suspended' })

                }
            } else {
                res.status(200).json({ success: false, message: 'Admin not varified.' })
            }


        } else {
            res.status(200).json({ success: false, message: 'invalid password or email' })
        }


    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong' })
    }

}


const addCarImg = async (req, res) => {
    try {
        const { carCategory, carLicensePlate, carMake, carModel, carYear, discription, featureOne, featureTwo, fuelType, image1, image2, image3, image4, ownerEmail, ownerName, price, transmission, phone, Rc } = req.body.data
        carDetails = new car({
            owner: req.id,
            ownerName: ownerName,
            ownerEmail: ownerEmail,
            carMake: carMake,
            model: carModel,
            carYear: carYear,
            carLicenseNumber: carLicensePlate,
            features: [featureOne, featureTwo],
            discription: discription,
            phone: phone,
            transmission: transmission,
            carCategory: carCategory,
            fuelType: fuelType,
            Rc: Rc,
            carImage1: image1,
            carImage2: image2,
            carImage3: image3,
            carImage4: image4,
            price: price

        });
        carDetails.save().then(() => {
            res.status(200).json({ success: true, message: 'Car successfully added..' })
        }).catch(() => {
            res.status(200).json({ success: false, message: 'something went wrong' })

        })

    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong' })
    }
}


const editCar = async (req, res) => {
    try {
        const { carCategory, carLicensePlate, carMake, carModel, carYear, discription, featureOne, featureTwo, fuelType, image1, image2, image3, image4, ownerEmail, ownerName, price, transmission, phone, Rc, carId } = req.body.data


        const carData = await carModels.findByIdAndUpdate(
            { _id: carId },
            {
                $set: {
                    owner: req.id,
                    ownerName: ownerName,
                    ownerEmail: ownerEmail,
                    carMake: carMake,
                    model: carModel,
                    carYear: carYear,
                    carLicenseNumber: carLicensePlate,
                    features: [featureOne, featureTwo],
                    discription: discription,
                    phone: phone,
                    transmission: transmission,
                    carCategory: carCategory,
                    fuelType: fuelType,
                    Rc: Rc,
                    carImage1: image1,
                    carImage2: image2,
                    carImage3: image3,
                    carImage4: image4,
                    price: price
                },
            }
        ).then(() => {
            res.status(200).json({ success: true, message: 'Car successfully Edited..' })
        }).catch(() => {
            res.status(200).json({ success: false, message: 'something went wrong' })

        })

    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong' })
    }
}

const partnerCars = async (req, res) => {
    try {
        const listCar = await car.find({ owner: req.id })
        if (listCar) {
            res.status(200).json({ success: true, message: "working", data: listCar })
        } else {
            res.status(200).json({ success: false, message: ("something went wrong") })
        }

    } catch (error) {
        res.status(200).json({ success: false, message: ("something went wrong") })

    }
}


const partnerCarDetail = async (req, res) => {
    try {
        const viewCar = await car.findById({ _id: req.query.id })
        if (viewCar) {
            res.status(200).json({ success: true, message: "working", data: viewCar })
        } else {
            res.status(200).json({ success: false, message: ("something went wrong") })
        }

    } catch (error) {
        res.status(200).json({ success: false, message: ("something went wrong") })

    }

}

const profileDetails = async (req, res) => {
    try {
        const partner = await partnerModel.find({ _id: req.id })
        if (partner) {
            res.status(200).json({ success: true, message: "", data: partner[0] })
        } else {
            res.status(200).json({ success: false, message: ("something went wrong") })
        }

    } catch (error) {
        res.status(200).json({ success: false, message: ("something went wrong") })
    }
}

const editPartnerProfile = async (req, res) => {
    try {
        const { name, email, phone, district, localArea, partnerImage } = req.body.data
        const partnerProfile = await partnerModel.updateMany(
            { _id: req.id },
            {
                $set: {
                    name: name,
                    email: email,
                    phone: phone,
                    district: district,
                    localArea: localArea,
                    partnerImage: partnerImage
                }
            }
        )
        res.status(200).json({ success: true, message: 'successfully Profile Added' })

    } catch (error) {
        res.status(400).json({ success: false, message: 'something went wrong..' })
    }
}

const BookingList = async (req, res) => {
    try {
        const bookings = await booking.find({ partner: req.id }).populate('car').populate('user').populate('partner').sort({ createdAt: -1 });
        const chat = await ChatModel.find()
        if (bookings) {
            res.status(200).json({ success: true, bookingDetails: bookings, chatData: chat })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
const statusHandle = async (req, res) => {
    try {
        await booking.findOneAndUpdate({ _id: req.body.data.id }, {
            $set: {
                status: req.body.data.status
            }
        }).then(async () => {
            const bookings = await booking.find({ partner: req.id }).populate('car').populate('user')
            if (bookings) {
                res.status(200).json({ success: true, bookingDetails: bookings })

            } else {
                res.status(200).json({ success: false, message: 'Booking Not Available' })
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const PartnerBookingCancelled = async (req, res) => {
    try {
        const data = await booking.findOne({ _id: req.query.id })
        const carId = data.car

        if (data.status == 'booked') {

            const result = await car.updateOne(
                { _id: carId },
                { $pull: { 'bookingdates': { bookingId: req.query.id } } }
            )

            await booking.findOneAndUpdate({ _id: req.query.id }, {
                $set: {
                    status: 'Cancel',
                }
            })

            await clientModel.findOneAndUpdate({ _id: data.user }, {
                $set: {
                    wallet: data.TotalAmount,
                }
            })
            const bookings = await booking.find({ partner: req.id }).populate("car").populate('user')
            res.status(200).json({ success: true, bookingData: bookings, message: 'Amount will Return in Your Wallet' })

        }
        else {
            res.status(200).json({
                success: false,
                message: `You Can't Cancel this Booking.`,
            });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const saveChat = async (req, res) => {
    try {
        const { userId, chat, bookingId } = req.body.data;
        const chatFind = await ChatModel.findOne({ bookingId: bookingId });
        if (chatFind) {
            await ChatModel.findOneAndUpdate({ bookingId: bookingId }, { $push: { chat: chat } })

            await ChatModel.findOneAndUpdate(
                { bookingId: bookingId },
                { $set: { PartnerMessage: true } },
            )
            res.json({ success: true })
        } else {
            res.json({ success: false })
        }
    } catch (error) {
        //res.status(500).json({ success: false, error: "Internal Server Error" });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getChat = async (req, res) => {
    try {
        const id = req.query.id;

        const BookingId = new mongoose.Types.ObjectId(req.query.id)
        const findChat = await ChatModel.find({ bookingId: BookingId }).populate('userId').populate('partnerId')
        await ChatModel.findOneAndUpdate(
            { bookingId: BookingId },
            { $set: { userMessage: false } },
        )
        if (findChat) {
            res.status(200).send({
                success: true,
                findChat,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "Chat not found",
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const ChartView = async (req, res) => {
    try {
        const id = req.id;
        const limit = 5;

        // Count total documents without skipping and limiting
        const totalItems = await booking.countDocuments({ partner: id });

        const totalPages = Math.ceil(totalItems / limit);
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const findbooking = await booking.find({ partner: id }).populate('user').populate('partner').populate('car')

        let total = 0;
        let complete = [];
        let unique = 0;

        if (findbooking) {
            complete = findbooking.filter((booking) => booking.status === "Completed");

            const userss = findbooking.map((value) => value.user.email);
            unique = Array.from(new Set(userss));

            if (complete.length > 0) {
                total = complete.reduce((accumulator, currentValue) => accumulator + currentValue.TotalAmount, 0);
            }

            const bookingID = findbooking.map((booking) => booking._id);
            const threeDigitIDs = bookingID.map((hexString) => {
                const decimalNumber = parseInt(hexString, 16);
                return ('11' + (decimalNumber % 1000)).slice(-3); // Ensure it's a three-digit number
            });



            const sortedNumericIDs = threeDigitIDs.map(Number).sort((a, b) => a - b);
            res.status(200).json({
                success: true,
                message: "Data found",
                findbooking,
                total,
                complete,
                unique,
                Ids: sortedNumericIDs,
                totalPages,
                page
            });
        } else {
            res.status(404).json({ success: false, message: "No bookings found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


module.exports = {
    partnerLogin,
    addCarImg,
    partnerCars,
    partnerCarDetail,
    profileDetails,
    editPartnerProfile,
    editCar,
    BookingList,
    statusHandle,
    PartnerBookingCancelled,
    saveChat,
    getChat,
    ChartView
}