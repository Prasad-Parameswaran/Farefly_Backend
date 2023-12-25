
const partnerModel = require('../models/partner/partnerModel')
const carModels = require('../models/car/carModel')
const car = require('../models/car/carModel')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
                            console.log("llll", checkPartner._id, "((((hhhh");
                            const partnerId = checkPartner._id
                            const jwtCreate = jwt.sign({
                                id: partnerId,
                                role: 'partner'
                            }, 'partner')
                            console.log(jwtCreate, "created the jwt token .....")
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
        console.log(error.message)
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
        console.log(error.message)
        res.status(200).json({ success: false, message: 'something went wrong' })
    }
}


const editCar = async (req, res) => {
    try {
        console.log(req.id, 'this is my owner id')
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
        console.log(error.message)
        res.status(200).json({ success: false, message: 'something went wrong' })
    }
}

const partnerCars = async (req, res) => {
    try {
        console.log('kkkkkkkkkoooooooooooooooo', req.id);
        const listCar = await car.find({ owner: req.id })
        console.log(listCar, "jjjjjjj");
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
        console.log(req.query.id, "kkkkkkkkkkkkkkkkkkkkthis is query data ");
        const viewCar = await car.findById({ _id: req.query.id })
        console.log(viewCar, "jjjjjjjjjj");
        if (viewCar) {
            console.log('ibdeyum ethi................');
            res.status(200).json({ success: true, message: "working", data: viewCar })
        } else {
            res.status(200).json({ success: false, message: ("something went wrong") })
        }

    } catch (error) {
        console.log('this code is not correct ');
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
        console.log(req.id);
        console.log(req.body.data, 'this is my profile datas')
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
        console.log(error);
        res.status(400).json({ success: false, message: 'something went wrong..' })
    }
}

module.exports = {
    partnerLogin,
    addCarImg,
    partnerCars,
    partnerCarDetail,
    profileDetails,
    editPartnerProfile,
    editCar
}