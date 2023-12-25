const { log } = require('console')
const client = require('../models/client/clientModel')
const partner = require('../models/partner/partnerModel')
const carModel = require('../models/car/carModel')
const jwt = require('jsonwebtoken')


const login = async (req, res) => {
    try {
        const { email, password } = req.body.data
        if (email === process.env.adminEmail && process.env.adminPassword === password) {
            const adminId = process.env.adminEmail
            const jwtcreating = jwt.sign({
                id: adminId,
                role: 'admin',
            }, 'admin');
            console.log(jwtcreating, "hjggjjj");

            res.status(200).json({ success: true, message: 'signIn successfully.', adminToken: jwtcreating })
        } else {
            res.status(201).json({ success: false, message: 'invalid password or email..' })
        }
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'something went wrong....' })
    }

}



const userList = async (req, res) => {
    try {
        console.log("user", req.id);
        const user = await client.find()

        if (user) {
            res.status(200).json({ success: true, message: ("working"), data: user })
        }
    } catch (error) {

        console.log(error.message);
    }
}



const partnerList = async (req, res) => {
    try {

        const partners = await partner.find()
        console.log(partners, "not here")

        if (partners) {
            res.status(200).json({ success: true, message: ("working"), data: partners })
        }

    } catch (error) {
        console.log(error.message, "heree......................")

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
        res.status(200).json({ success: false, message: 'something went wrong..' })

    }
}


const userStatus = async (req, res) => {

    const users = await client.findById({ _id: req.query.id })
    //console.log(users, "jjjjj");
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

}

const partnerStatus = async (req, res) => {

    const users = await partner.findById({ _id: req.query.id })
    //console.log(users, "jjjjj");
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

}


const PartnerVarifyAccept = async (req, res) => {
    console.log(req.id, "jjjjjjjjj 55555");
    const findpartner = await partner.findById({ _id: req.query.id })
    console.log(findpartner);

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

}



const PartnerVarifyCancel = async (req, res) => {
    try {
        console.log('55555555555555', req.query.id);
        const removePartner = await partner.findByIdAndDelete({ _id: req.query.id })
        console.log(removePartner, "kkkkkkkkkk");

        const partersList = await partner.find()
        console.log(partersList, "llllllllll");
        if (partersList) {
            res.status(200).json({ success: true, message: (`${removePartner?.name} Request Cancelled`), data: partersList })
        }
    } catch (error) {
        res.status(200).json({ success: false, message: ("something went wrong") })

    }

}


const carDatas = async (req, res) => {
    try {
        const listCar = await carModel.find()
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

const carDetails = async (req, res) => {
    try {
        console.log(req.query.id, "kkkkkkkkkkkkkkkkkkkkthis is query data ");
        const viewCar = await carModel.findById({ _id: req.query.id })
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
const ListOrUnlist = async (req, res) => {
    console.log("kkkkkkkkkkkkkkkk", req.query.id);
    const carStatus = await carModel.findById({ _id: req.query.id })
    console.log(carStatus, "jjjjj");
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

}








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
    ListOrUnlist
}

































