const client = require('../models/client/clientModel')
const bcrypt = require('bcrypt');
const { nodeMailer } = require('../utilities/otpVarify')
const jwt = require('jsonwebtoken')
const partnerModel = require('../models/partner/partnerModel')




const signUp = async (req, res) => {
    try {
        const { email } = req.body
        const userExist = await client.findOne({ email: email })
        if (!userExist) {
            //sendotp(phone)
            const otp = nodeMailer(email)
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
            res.status(200).json({ success: true })

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
        const user = await client.findOne({ email: req.body.user.email })
        if (user) {
            const checkPassword = await bcrypt.compare(req.body.user.password, user.password)
            if (checkPassword) {
                const userId = user._id
                const jwtcreating = jwt.sign({
                    id: userId,
                    role: 'client',
                }, 'secret');
                console.log(jwtcreating, "hjggjjj");
                res.status(200).json({ success: true, message: 'succesfully login...', Token: jwtcreating })
            } else {
                res.status(201).json({ success: false, message: 'invalid email or password..' })
            }
        } else {
            res.status(201).json({ success: false, message: 'invalid email or password..' })

        }
    } catch {
        res.status(400).json({ success: false, message: 'something went wrong..' })
    }
}

const getProfile = async (req, res) => {
    try {

        console.log("heree...................", req.id);
        const user = await client.findById(req.id)
        res.json({ success: true, user: user })

    } catch {
        console.log(error.message)
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
            localArea } = req.body.data

        console.log(name);
        const pass = await bcrypt.hash(password, 10)

        const partnerAdd = new partnerModel({
            name: name,
            email: email,
            phone: phone,
            district: district,
            password: pass,
            age: age,
            localArea: localArea
        })
        partnerAdd.save().then(() => {
            res.json({ succes: true })
        }).catch((err) => {
            console.log(err.message);
            res.json({ succes: false })
        })



    } catch {
        console.log(error.message)
    }




}








module.exports = {
    signUp,
    otp,
    login,
    getProfile,
    addpartner
}