const client = require('../models/client/clientModel')
const bcrypt = require('bcrypt');
const { nodeMailer } = require('../utilities/otpVarify')
const jwt = require('jsonwebtoken')
const partnerModel = require('../models/partner/partnerModel');
const carModel = require('../models/car/carModel');
const booking = require('../models/booking/booking');
const coupon = require('../models/coupon/coupon');
const ChatModel = require('../models/chat/chat')
const mongoose = require('mongoose')

const { log } = require('util');
let forgotOtp
let email


const signUp = async (req, res) => {
    try {
        const { email } = req.body
        const userExist = await client.findOne({ email: email })
        if (!userExist) {
            const otp = nodeMailer(email)
            res.status(200).json({ otp: otp, success: true })
        }
        else {
            res.status(201).json({ success: false })
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const otp = async (req, res) => {

    try {

        const otpObj = req.body.otp
        const userotp = req.body.Userotp
        const { firstName,
            lastName,
            phone,
            email,
            password,
            repassword } = req.body.user
        array = []
        for (key in otpObj) {
            array.push(otpObj[key])
        }
        const joinedValue = array.join("");
        if (joinedValue === userotp) {
            const pass = await bcrypt.hash(password, 10);
            const rePass = await bcrypt.hash(repassword, 10);
            userdetails = client({
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                password: pass,
                repassword: rePass,
            });
            userdetails.save()
            res.status(200).json({ success: true, forgot: false })

        } else {
            res.status(200).json({ success: false })
        }


    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}

const login = async (req, res) => {
    try {
        const user = await client.findOne({ email: req.body.data.email })
        if (user) {
            if (user.status) {
                const checkPassword = await bcrypt.compare(req.body.data.password, user.password)
                if (checkPassword) {
                    const userId = user._id
                    const jwtcreating = jwt.sign({
                        id: userId,
                        role: 'client',
                    }, 'secret');
                    res.status(200).json({ success: true, message: 'succesfully login...', partnerToken: jwtcreating })
                } else {
                    res.status(201).json({ success: false, message: 'invalid email or password..' })
                }
            } else {
                res.status(201).json({ success: false, message: 'Your Acount suspended..' })

            }

        } else {
            res.status(201).json({ success: false, message: 'invalid email or password..' })

        }
    } catch {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const googleAuthentication = async (req, res) => {

    try {

        const user = await client.findOne({ email: req.body.data.email })
        if (!user) {
            const {
                name,
                email,
                familyName,
                imageUrl
            } = req.body.data
            userdetails = client({
                firstName: name,
                lastName: familyName,
                email: email,
                userImage: imageUrl
            });
            let jwtcreating
            userdetails.save().then((res) => {
                const userId = res._id
                jwtcreating = jwt.sign({
                    id: userId,
                    role: 'client',
                }, 'secret');
            }).then(() => {
                res.status(200).json({ success: true, message: 'succesfully login...', partnerToken: jwtcreating })

            })
        } else {
            let jwtcreating
            const userId = user._id
            jwtcreating = jwt.sign({
                id: userId,
                role: 'client',
            }, 'secret')
            res.status(200).json({ success: true, message: 'succesfully login...', partnerToken: jwtcreating })

        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}



const getProfile = async (req, res) => {
    try {
        const user = await client.findById(req.id)
        res.json({ success: true, user: user })
    } catch {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const addpartner = async (req, res) => {
    try {
        const { name,
            email,
            phone,
            district,
            password,
            age,
            localArea,
            aadhaar,
            panCard } = req.body.data

        const emailCheking = await partnerModel.findOne({ email: email })
        if (!emailCheking) {
            const pass = await bcrypt.hash(password, 10)

            const partnerAdd = new partnerModel({
                name: name,
                email: email,
                phone: phone,
                district: district,
                password: pass,
                age: age,
                localArea: localArea,
                aadhaar: aadhaar,
                panCard: panCard


            })
            partnerAdd.save().then(() => {
                res.json({ succes: true, message: 'succeffully Registered..' })
            }).catch((err) => {
                res.json({ succes: false, message: 'something went wrong...' })
            })
        }
        else {

            res.json({ succes: false, message: 'email is exist' })
        }
    } catch {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const addProfile = async (req, res) => {
    try {
        const { firstName, email, phone, district, age, licenceFront, licenceBack, profileImage } = req.body.data
        const userProfile = await client.updateMany(
            { _id: req.id },
            {
                $set: {
                    userImage: profileImage,
                    firstName: firstName,
                    email: email,
                    phone: phone,
                    age: age,
                    district: district,
                    licenseFront: licenceFront,
                    licenseBack: licenceBack,

                }
            }
        );


        res.status(200).json({ success: true, message: 'successfully Profile Added' })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
const editProfile = async (req, res) => {
    try {
        const { firstName, email, phone, district, age, licenseFront, licenseBack, userImage } = req.body.data
        const userProfile = await client.updateOne(
            { _id: req.id },
            {
                $set: {
                    userImage: userImage,
                    firstName: firstName,
                    email: email,
                    phone: phone,
                    age: age,
                    district: district,
                    licenseFront: licenseFront,
                    licenseBack: licenseBack,

                }
            }
        );


        res.status(200).json({ success: true, message: 'successfully Profile Edited' })

    } catch (error) {

        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const forgotPass = async (req, res) => {
    try {
        email = req.body.data.email
        const emailVarify = await client.findOne({ email: email })
        if (emailVarify) {
            forgotOtp = nodeMailer(email)
            res.json({ succes: true, message: 'OTP send into Your Email.' })
        } else {
            res.json({ succes: false, message: 'Enter valid email.' })
        }
    } catch (error) {
        //res.status(200).json({ success: false, message: 'something went wrong.' })
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}




const otpForgot = async (req, res) => {
    try {
        const otp = req.body.data
        if (otp === forgotOtp) {
            forgotOtp = undefinedzzzzzzzzzzz
            res.json({ succes: true, message: 'succeffully Registered...' })

        } else {
            res.json({ succes: false, message: 'Invalid Otp.' })
        }

    } catch (error) {
        //res.status(200).json({ success: false, message: 'something went wrong..' })
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}





const carlist = async (req, res) => {
    try {
        const carList = await carModel.find()
        const partners = await partnerModel.find()
        const partnerdistrict = [...new Set(partners.map(value => value.district))];
        const partnerLocalArea = [...new Set(partners.map(value => value.localArea))];
        const cars = await carModel.find().limit(8);


        res.status(200).json({ carList: carList, district: partnerdistrict, localArea: partnerLocalArea, cars: cars })

    } catch (error) {
        //res.status(200).json({ success: false, message: 'something went wrong..' })
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
const carListPost = async (req, res) => {
    try {
        const { pickUpDate, dropDate, district, districtChanges } = req.body.data
        const districtSelect = districtChanges ? districtChanges : district

        const allcars = await carModel.find()
        const findDistrictPartner = await partnerModel.find({ district: districtSelect })
        const districtList = await partnerModel.find()
        const filterDistrict = allcars.filter((car) => {
            return findDistrictPartner.some((val) => String(car.owner) === String(val._id))
        })
        const partnerLocalArea = [...new Set(findDistrictPartner.map(value => value.localArea))]
        const findedCars = filterDistrict.filter((value) => {
            if (value.bookingdates.length === 0) {
                return true
            } else {
                const isOverlap = value.bookingdates.some((dates) => {
                    return (
                        (pickUpDate >= dates.startingdate &&
                            pickUpDate <= dates.endingdate) ||
                        (dropDate >= dates.startingdate && dropDate <= dates.endingdate) ||
                        (pickUpDate <= dates.startingdate && dropDate >= dates.endingdate)
                    );
                });
                return !isOverlap;
            }
        });


        const partners = await partnerModel.find()
        const partnerdistrict = [...new Set(partners.map(value => value.district))];
        //const partnerLocalArea = [...new Set(partners.map(value => value.localArea))];
        const cars = await carModel.find().limit(8);

        res.status(200).json({ carList: findedCars, district: partnerdistrict, localArea: partnerLocalArea, cars: cars })

    } catch (error) {
        //res.status(200).json({ success: false, message: 'something went wrong..' })
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const findDistrictCar = async (req, res) => {
    try {

        const { pickUpDate, dropDate, district } = req.body.id


        const allcars = await carModel.find()
        const findDistrictPartner = await partnerModel.find({ district: district })
        const districtList = await partnerModel.find()
        const filterDistrict = allcars.filter((car) => {
            return findDistrictPartner.some((val) => String(car.owner) === String(val._id))
        })
        const partnerLocalArea = [...new Set(findDistrictPartner.map(value => value.localArea))]
        const findedCars = filterDistrict.filter((value) => {
            if (value.bookingdates.length === 0) {
                return true
            } else {
                const isOverlap = value.bookingdates.some((dates) => {
                    return (
                        (pickUpDate >= dates.startingdate &&
                            pickUpDate <= dates.endingdate) ||
                        (dropDate >= dates.startingdate && dropDate <= dates.endingdate) ||
                        (pickUpDate <= dates.startingdate && dropDate >= dates.endingdate)
                    );
                });
                return !isOverlap;
            }
        });
        if (findedCars.length == 0) {
            res.status(200).json({ car: filterDistrict, localArea: partnerLocalArea })

        } else {

            res.status(200).json({ success: true, car: findedCars, localArea: partnerLocalArea })

        }

    } catch (error) {
        //res.status(200).json({ success: false, message: 'something went wrong..' })
        res.status(500).json({ success: false, message: "Internal server error" });

    }
}


const findHomeSearch = async (req, res) => {

    try {

        const { pickUpDate, dropDate, district } = req.body.data;

        const allcars = await carModel.find()
        const findDistrictPartner = await partnerModel.find({ district: district })
        const districtList = await partnerModel.find()
        const filterDistrict = allcars.filter((car) => {
            return findDistrictPartner.some((val) => String(car.owner) === String(val._id))
        })
        const partnerLocalArea = [...new Set(findDistrictPartner.map(value => value.localArea))]
        const partnerDis = [...new Set(districtList.map(value => value.district))]
        const findedCars = filterDistrict.filter((value) => {
            if (value.bookingdates.length == 0) {
                return true
            } else {
                const isOverlap = value.bookingdates.some((dates) => {
                    return (
                        (pickUpDate >= dates.startingdate &&
                            pickUpDate <= dates.endingdate) ||
                        (dropDate >= dates.startingdate && dropDate <= dates.endingdate) ||
                        (pickUpDate <= dates.startingdate && dropDate >= dates.endingdate)
                    );
                });
                return !isOverlap;
            }
        })
        if (findedCars.length == 0) {
            res.status(200).json({ message: "car filtered", success: true, data: filterDistrict, localArea: partnerLocalArea, district: partnerDis })
        } else {
            res.status(200).json({ message: "car filtered", success: true, data: findedCars, localArea: partnerLocalArea, district: partnerDis })

        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }


}


const findLocalAreaCar = async (req, res) => {
    try {
        const { localArea, pickUpDate, dropDate } = req.body.data
        console.log(localArea, pickUpDate, dropDate)
        const carList = await carModel.find().populate('owner')
        console.log(carList)
        const findDistrictPartner = await partnerModel.find({ localArea: localArea })
        console.log(findDistrictPartner)
        const LocalAreasList = await partnerModel.find({ district: findDistrictPartner[0].district })
        const car = carList.filter((car) => {
            return findDistrictPartner.some((val) => String(car.owner._id) === String(val._id))
        })
        console.log(car)
        const findedCars = car.filter((value) => {
            if (value.bookingdates.length == 0) {
                return true
            } else {
                const isOverlap = value.bookingdates.some((dates) => {
                    return (
                        (pickUpDate >= dates.startingdate &&
                            pickUpDate <= dates.endingdate) ||
                        (dropDate >= dates.startingdate && dropDate <= dates.endingdate) ||
                        (pickUpDate <= dates.startingdate && dropDate >= dates.endingdate)
                    );
                });
                return !isOverlap;
            }
        })
        console.log(findedCars, 'hkkkkkkkkkkkkkkkkkkk')

        const partnerLocalArea = [...new Set(LocalAreasList.map(value => value.localArea))]
        console.log(partnerLocalArea, 'this is partner local area ');

        res.status(200).json({ car: findedCars, localArea: partnerLocalArea })


    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });

    }
}

const DatesAvailable = async (req, res) => {

    try {
        const { pickUpDate, dropDate, district, carId } = req.body.data.bookingData

        const allcars = await carModel.find()
        const findDistrictPartner = await partnerModel.find({ district: district })
        const districtList = await partnerModel.find()
        const filterDistrict = allcars.filter((car) => {
            return findDistrictPartner.some((val) => String(car.owner) === String(val._id))
        })
        const partnerLocalArea = [...new Set(findDistrictPartner.map(value => value.localArea))]
        const partnerDis = [...new Set(districtList.map(value => value.district))]
        const findedCars = filterDistrict.filter((value) => {
            if (value.bookingdates.length == 0) {
                return true
            } else {
                const isOverlap = value.bookingdates.some((dates) => {
                    return (
                        (pickUpDate >= dates.startingdate &&
                            pickUpDate <= dates.endingdate) ||
                        (dropDate >= dates.startingdate && dropDate <= dates.endingdate) ||
                        (pickUpDate <= dates.startingdate && dropDate >= dates.endingdate)
                    );
                });
                return !isOverlap;
            }
        })
        let availableORnot = findedCars.find((car) => String(car._id) == String(carId));

        if (!availableORnot) {
            res.status(200).json({ message: "This Dates Car Already Booked", success: false })
        } else {
            res.status(200).json({ message: "NOw you can Book ", success: true })

        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }


}





const newpassword = async (req, res) => {
    try {
        const newpas = req.body.data.Newpassword
        const userEmail = { email: email }
        const user = await client.findOne({ email: email })
        if (user) {
            const pass = await bcrypt.hash(newpas, 10);

            const updatePass = await client.updateOne(
                { email: user.email },
                { $set: { password: pass, repassword: pass } },
                { new: true }
            ).then(() => {
                res.status(200).json({ succes: true, message: 'succeffully updated.' })
            }).catch(() => {
                res.status(200).json({ success: false, message: 'something went wrong.' })

            })

        }
        else {
            res.status(200).json({ success: false, message: 'user is not exist.' })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });

    }
}


const searchCar = async () => {
    try {
        const cars = await carModel.find({ carMake: { $regex: '.*' + serch + '.*', $options: 'i' } })

        res.status(200).json({ succes: true, message: 'cars here....', cars: cars })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });

    }
}


const bookingCarDeatils = async (req, res) => {
    try {
        const bookingCar = await carModel.findById({ _id: req.query.id }).populate('owner')

        if (bookingCar) {
            res.status(200).json({ success: true, message: "working", data: bookingCar })
        } else {
            res.status(200).json({ success: false, message: ("something went wrong") })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });

    }

}

const payments = async (req, res) => {
    try {
        const users = req.id;
        const userdata = await client.findOne({ _id: users });
        if (userdata.licenseBack && userdata.licenseFront) {
            const carid = req.body.data.bookingData.carId
            const cars = await carModel.findById(carid)
            const { district, carId, dropDate, pickUpDate } = req.body.data.bookingData;
            const { totalAmount, sgst, cgst, dayCount, PaymentMethod, discountAmount, localArea } = req.body.data
            console.log(localArea, 'kkkkkkkkkk')
            if (PaymentMethod == "wallet") {
                const userwallet = await client.findById(users);
                //console.log(userwallet.wallet, 'THIS IS USER WALLET')
                if (userwallet.wallet >= totalAmount) {
                    const walletamount = userwallet.wallet - totalAmount;

                    await client.findByIdAndUpdate(
                        users,
                        {
                            $set: {
                                wallet: walletamount,
                            },
                        },
                        { new: true }
                    );
                } else {
                    res.status(201).json({ success: false, notamount: "Wallet has no money to make this booking" })
                    return
                }

            }

            const bookingdata = new booking({
                pickUpDate: pickUpDate,
                dropDate: dropDate,
                car: carId,
                TotalAmount: totalAmount,
                Sgst: sgst,
                Cgst: cgst,
                user: users,
                paymentMethod: PaymentMethod,
                partner: cars.owner,
                dropPlace: district,
                pickUpPlace: district,
                discountAmount: discountAmount,
                subLocation: localArea

            });
            let date;
            await bookingdata.save().then(async (res) => {
                date = {
                    startingdate: pickUpDate,
                    endingdate: dropDate,
                    bookingId: res._id
                };
                const openChat = new ChatModel({
                    userId: users,
                    partnerId: cars.owner,
                    bookingId: res._id,
                })
                await openChat.save();

            })


            await carModel.findOneAndUpdate(
                { _id: carid },
                {
                    $push: {
                        bookingdates: date,
                    },
                }
            )


            if (PaymentMethod == "online") {
                res.status(200).json({ success: true, message: "Data stored" });
            } else {
                res.status(200).json({ success: true, wallet: "Data stored" });
            }
        } else {
            res.status(201).json({
                success: false,
                messages: "Provide The Licence Image In Profile",
            });
        }

    } catch (error) {

        //Handle errors 

        console.error("Error in Payments:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}

const Bookinghistory = async (req, res) => {
    try {
        const bookings = await booking.find({ user: req.id }).populate("car").populate('partner')
        const chat = await ChatModel.find()
        console.log(bookings, 'this is my booking history ....')
        if (bookings) {
            res.status(200).json({ success: true, bookingDetails: bookings, chatData: chat })

        } else {
            res.status(200).json({ success: false })

        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });

    }
}

const bookingCancel = async (req, res) => {
    try {

        const data = await booking.findOne({ _id: req.query.id })
        const carId = data.car

        if (data.status == 'booked') {
            const result = await carModel.updateOne(
                { _id: carId },
                { $pull: { 'bookingdates': { bookingId: req.query.id } } }
            )

            await booking.findOneAndUpdate({ _id: req.query.id }, {
                $set: {
                    status: 'Cancel',
                }
            })
            await client.findOneAndUpdate({ _id: req.id }, {
                $set: {
                    wallet: data.TotalAmount,
                }
            })
            const bookings = await booking.find({ user: req.id }).populate("car").populate('partner')
            res.status(200).json({ success: true, bookingData: bookings, message: 'Amount will Return in Your Wallet' })

        } else {
            res.status(200).json({
                success: false,
                message: `You Can't Cancel this Booking.`,
            });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const CouponList = async (req, res) => {
    try {
        const coupons = await coupon.find()
        if (coupons) {
            res.status(200).json({ success: true, data: coupons, message: 'Amount will Return in Your Wallet' })
        } else {
            res.status(200).json({ success: false, message: 'No coupon Available' })

        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const Applycoupon = async (req, res) => {
    try {
        const couponcode = req.body.data.code
        const user = req.id
        const toatalAmout = req.body.data.amonut
        if (couponcode) {
            const findcoupon = await coupon.findOne({ couponCode: couponcode })
            if (findcoupon) {
                const is_User_used = findcoupon.user.find((value) => {
                    return value.id == user
                })
                if (is_User_used) {
                    res.status(201).json({ success: false, message: "coupon is already used" })
                } else {

                    if (findcoupon.maxBookingAmount <= toatalAmout) {

                        const currentDate = new Date();
                        const formattedCurrentDate = currentDate.toLocaleDateString('en-GB');

                        const formattedCouponExpiryDate = new Date(findcoupon.experirydate).toLocaleDateString('en-GB');

                        if (formattedCurrentDate < formattedCouponExpiryDate) {
                            const data_1 = {
                                id: user
                            }
                            await coupon.findOneAndUpdate({ _id: findcoupon._id }, {
                                $push: { user: data_1 }
                            })


                            res.status(201).json({ success: true, message: "coupon is applaid successfully", amount: findcoupon.discountamount })

                        } else {
                            res.status(201).json({ success: false, message: "coupon is expired" })
                        }
                    } else {
                        res.status(201).json({ success: false, message: "coupon cannot applay on this purchase" })

                    }
                }
            } else {
                res.status(201).json({ success: false, message: "coupon code is invalid" })

            }
        } else {
            res.status(201).json({ success: false, message: "please enter anything" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" });

    }
}


const saveChat = async (req, res) => {
    try {
        const { partnerId, chat, bookingId } = req.body.data;
        const BookingId = new mongoose.Types.ObjectId(bookingId)

        const chatFind = await ChatModel.findOne({ bookingId: bookingId })
        if (chatFind) {
            await ChatModel.findOneAndUpdate({ bookingId: bookingId }, { $push: { chat: chat } });
            await ChatModel.findOneAndUpdate(
                { bookingId: BookingId },
                { $set: { userMessage: true } },
            ).then((res) => { console.log(res, 'this is my response') })

            res.json({ success: true })
        } else {
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const getChat = async (req, res) => {
    try {
        const id = req.query.id;
        const BookingId = new mongoose.Types.ObjectId(req.query.id)
        console.log(BookingId);
        const findChat = await ChatModel.find({ bookingId: BookingId }).populate('userId').populate('partnerId')
        await ChatModel.findOneAndUpdate(
            { bookingId: BookingId },
            { $set: { PartnerMessage: false } },
        )
        console.log(findChat[0].chat, 'this is my finded chat ')
        if (findChat) {
            res.status(200).send({
                success: true,
                findChat,
            })
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



module.exports = {
    signUp,
    otp,
    login,
    getProfile,
    addpartner,
    carlist,
    forgotPass,
    otpForgot,
    newpassword,
    findDistrictCar,
    findLocalAreaCar,
    addProfile,
    editProfile,
    searchCar,
    findHomeSearch,
    bookingCarDeatils,
    payments,
    Bookinghistory,
    bookingCancel,
    CouponList,
    Applycoupon,
    googleAuthentication,
    saveChat,
    getChat,
    DatesAvailable,
    carListPost
}