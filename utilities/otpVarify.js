const nodemailer = require('nodemailer');
//const mailgen = require('mailgen');
const otp = require('otp-generator')

const nodeMailer = (UserEmail) => {
    const email = UserEmail
    console.log(email, "55555555555555555555", process.env.Email)
    const UserOtp = otp.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.Email,
            pass: process.env.Password,
        },
    });
    const mailOptions = {
        from: process.env.Email,
        to: email,
        subject: "Your OTP",
        text: `This is your OTP : ${UserOtp}`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message);
        }
    })
    console.log("helloooooooo");
    return UserOtp

}
module.exports = {
    nodeMailer
};





















//const accountSid = 'ACf0e7aa5e5c824f4d5032f1edb2f1f8bd'
//const authToken = '59de308e05a8829b04925d05882b1cfd'
//const verifySid = 'VA87cfbae9e342ddbbb0e05ba345d0eff2'


//const client = require('twilio')(accountSid, authToken);

//function sendotp(sendotpphone) {
//    client.verify.v2
//        .services(verifySid)
//        .verifications.create({ to: `+91${sendotpphone}`, channel: "sms" })
//        .then((verification) => console.log(verification.status));

//}

//function verifyotp(phone, otp) {
//    return new Promise((resolve, reject) => {
//        client.verify.v2
//            .services(verifySid)
//            .verificationChecks.create({ to: `+91${phone}`, code: otp })
//            .then((verification_check) => {
//                console.log(verification_check.status)
//                resolve(verification_check)
//            })
//    })


//}
//module.exports = {
//    sendotp,
//    verifyotp

//}

