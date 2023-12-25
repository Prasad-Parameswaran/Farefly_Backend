const client = require('../models/client/clientModel')
const bcrypt = require('bcrypt');
const { nodeMailer } = require('../utilities/otpVarify')
const jwt = require('jsonwebtoken')
const partnerModel = require('../models/partner/partnerModel');
const carModel = require('../models/car/carModel');
const booking = require('../models/booking/booking');
const { log } = require('util');
let forgotOtp
let email
//const Stripe = require("stripe");
//const stripe = Stripe(
//    'sk_test_51OPOdLSIs9vR7ZzxGJMa9JObbKSfwcmeNPqvF0QpRStZ1qTu1EPVaqTd9fJ4OAL8iU7e03aoUE3G9B8cYxvv4kXP00ar8aeAIL'
//);


//const envirolment =
//    process.env.NODE_ENV === "production"
//        ? paypal.core.LiveEnvironment
//        : paypal.core.SandboxEnvironment;

//const paypalCliend = new paypal.core.PayPalHttpClient(
//    new envirolment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET_ID)
//);



const signUp = async (req, res) => {
    try {
        const { email } = req.body
        const userExist = await client.findOne({ email: email })
        if (!userExist) {
            //sendotp(phone)
            const otp = nodeMailer(email)
            console.log(otp);
            res.status(200).json({ otp: otp, success: true })
        }
        else {
            res.status(201).json({ success: false })
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const otp = async (req, res) => {

    try {
        console.log(req.query.id);

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
        console.log(joinedValue, "otp joining");
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
            console.log("here invalid otp.................");
            res.status(200).json({ success: false })
        }


    } catch (error) {
        console.log(error);
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
                    console.log(jwtcreating, "hjggjjj");
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
        res.status(200).json({ success: false, message: 'something went wrong..' })
    }
}

const getProfile = async (req, res) => {
    try {

        console.log("heree...................12", req.id);
        const user = await client.findById(req.id)
        console.log(user, "kkkkkkkkkkkkk");
        res.json({ success: true, user: user })

    } catch {
        console.log(error.message)
    }

}


const addpartner = async (req, res) => {
    try {
        console.log(req.body.data, "jjjjjj");
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
                console.log(err.message);
                res.json({ succes: false, message: 'something went wrong...' })
            })
        }
        else {

            res.json({ succes: false, message: 'email is exist' })
        }
    } catch {
        console.log(error.message)
        res.status(400).json({ success: false, message: 'something went wrong..' })
    }
}

const addProfile = async (req, res) => {
    try {
        console.log(req.id);
        console.log(req.body.data, 'this is my profile datas')
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
        console.log(error);
        res.status(400).json({ success: false, message: 'something went wrong..' })
    }
}
const editProfile = async (req, res) => {
    try {
        console.log(req.id);
        console.log(req.body.data, 'this is my profile datas')
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
        console.log(error);
        res.status(400).json({ success: false, message: 'something went wrong..' })
    }
}

const forgotPass = async (req, res) => {
    try {
        email = req.body.data.email
        const emailVarify = await client.findOne({ email: email })
        if (emailVarify) {
            forgotOtp = nodeMailer(email)
            console.log(forgotOtp);
            res.json({ succes: true, message: 'OTP send into Your Email.' })
        } else {
            res.json({ succes: false, message: 'Enter valid email.' })
        }
    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong.' })
    }

}




const otpForgot = async (req, res) => {
    try {
        console.log('hoiiiiiiiiiiii', forgotOtp)
        const otp = req.body.data
        console.log(otp, "dddddd", forgotOtp)
        if (otp === forgotOtp) {
            forgotOtp = undefinedzzzzzzzzzzz
            res.json({ succes: true, message: 'succeffully Registered...' })

        } else {
            res.json({ succes: false, message: 'Invalid Otp.' })
        }

    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong..' })
    }
}





const carlist = async (req, res) => {
    try {
        const carList = await carModel.find()
        const partners = await partnerModel.find()
        const partnerdistrict = [...new Set(partners.map(value => value.district))];
        const partnerLocalArea = [...new Set(partners.map(value => value.localArea))];
        res.status(200).json({ carList: carList, district: partnerdistrict, localArea: partnerLocalArea })

    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong..' })
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
        const partnerDis = [...new Set(districtList.map(value => value.district))]
        console.log(allcars, partnerLocalArea, filterDistrict, findDistrictPartner)

        const findedCars = filterDistrict.filter((value) => {
            if (value.bookingdates.length === 0) {
                return false
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
            console.log('here comes....')
            res.status(200).json({ car: filterDistrict, localArea: partnerLocalArea })

        } else {
            res.status(200).json({ success: true, data: findedCars, localArea: partnerLocalArea })

        }
        //const car = carList.filter((car) => {
        //    return findDistrictPartner.some((val) => String(car.owner) === String(val._id))
        //})

        //res.status(200).json({ car: car, localArea: partnerLocalArea })


    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong..' })

    }
}


const findHomeSearch = async (req, res) => {

    try {

        console.log(req.body.data, 'this is my body data')
        const { pickUpDate, dropDate, district } = req.body.data;

        const allcars = await carModel.find()
        const findDistrictPartner = await partnerModel.find({ district: district })
        const districtList = await partnerModel.find()
        const filterDistrict = allcars.filter((car) => {
            return findDistrictPartner.some((val) => String(car.owner) === String(val._id))
        })
        const partnerLocalArea = [...new Set(findDistrictPartner.map(value => value.localArea))]
        const partnerDis = [...new Set(districtList.map(value => value.district))]
        console.log(allcars, partnerLocalArea, filterDistrict, findDistrictPartner)

        const findedCars = filterDistrict.filter((value) => {
            if (value.bookingdates.length === 0) {
                return false
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
            console.log('here comes....')
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
        console.log(req.query.id, 'this is local area ....');
        const carList = await carModel.find()
        const findDistrictPartner = await partnerModel.find({ localArea: req.query.id })
        const car = carList.filter((car) => {
            return findDistrictPartner.some((val) => String(car.owner) === String(val._id))
        })
        findDistrictPartner.map((val) => {
            console.log(val.localArea)
        })

        const partnerLocalArea = [...new Set(findDistrictPartner.map(value => value.localArea))]
        console.log(partnerLocalArea, 'this is partner local area ');

        res.status(200).json({ car: car, localArea: partnerLocalArea })


    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong..' })

    }
}




const newpassword = async (req, res) => {
    try {
        console.log('kkkkkkkkkkkkkkkkkkkkkkkoooooooooooooooooo', email);
        const newpas = req.body.data.Newpassword
        const userEmail = { email: email }
        const user = await client.findOne({ email: email })
        console.log('kkkkkkkkkkkkkkkkkkkkkkkoooooooooooooooooo111111', user);

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
        res.status(200).json({ success: false, message: 'something went wrong..' })

    }
}


const searchCar = async () => {
    try {
        const cars = await carModel.find({ carMake: { $regex: '.*' + serch + '.*', $options: 'i' } })

        res.status(200).json({ succes: true, message: 'cars here....', cars: cars })

    } catch (error) {
        res.status(200).json({ success: false, message: 'something went wrong..' })

    }
}

const bookingCarDeatils = async (req, res) => {
    try {
        console.log(req.query.id, 'this is my query id /..................')
        const bookingCar = await carModel.findById({ _id: req.query.id })

        if (bookingCar) {
            res.status(200).json({ success: true, message: "working", data: bookingCar })
        } else {
            res.status(200).json({ success: false, message: ("something went wrong") })
        }

    } catch (error) {
        console.log('this code is not correct ')
        res.status(200).json({ success: false, message: ("something went wrong") })

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
            const { totalAmount, sgst, cgst, dayCount, PaymentMethod } = req.body.data
            console.log(totalAmount, pickUpDate, sgst, cgst, dayCount, district, carId, dropDate, pickUpDate, PaymentMethod)

            if (PaymentMethod == "wallet") {
                const userwallet = await client.findById(users);
                console.log(userwallet.wallet, 'THIS IS USER WALLET')
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
                pickUpPlace: district
            });
            const date = {
                startingdate: pickUpDate,
                endingdate: dropDate,
            };
            await bookingdata.save();
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
        console.log('herroooooooooooooooooooooooo kkkkkkkk', req.id)
        const bookings = await booking.find({ user: req.id })
        if (bookings) {
            console.log(bookings, 'this is my booking data')
        } else {
            console.log('herelllllllllllllllllllllllllllllllllllll')
        }

    } catch (error) {

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
    Bookinghistory
}