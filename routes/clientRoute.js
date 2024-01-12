const express = require('express');
const clientRoute = express.Router();
const clientContr = require('../controllers/clientController')
const checkJwt = require('../middleware/userAuth')


clientRoute.post('/signup', clientContr.signUp);
clientRoute.post('/otpVarify', clientContr.otp);
clientRoute.post('/login', clientContr.login);
clientRoute.post('/Partnersignup', clientContr.addpartner);
clientRoute.post('/forgotPass', clientContr.forgotPass);
clientRoute.post('/otp', clientContr.otpForgot);
clientRoute.post('/newpassword', clientContr.newpassword);
clientRoute.get('/profile', checkJwt.checkJwt, clientContr.getProfile);
clientRoute.post('/addProfile', checkJwt.checkJwt, clientContr.addProfile);
clientRoute.post('/editProfile', checkJwt.checkJwt, clientContr.editProfile);
clientRoute.get('/carlist', checkJwt.checkJwt, clientContr.carlist);
clientRoute.post('/findDistrictCar', checkJwt.checkJwt, clientContr.findDistrictCar);
clientRoute.post('/findHomeSearch', checkJwt.checkJwt, clientContr.findHomeSearch);
clientRoute.post('/findLocalAreaCar', checkJwt.checkJwt, clientContr.findLocalAreaCar);
clientRoute.post('/DatesAvailable', checkJwt.checkJwt, clientContr.DatesAvailable);
clientRoute.get('/searchCar', checkJwt.checkJwt, clientContr.searchCar);
clientRoute.post('/carlistpost', checkJwt.checkJwt, clientContr.carListPost);
clientRoute.post('/googleAuthentication', clientContr.googleAuthentication);
clientRoute.get('/bookingCarDeatils', checkJwt.checkJwt, clientContr.bookingCarDeatils);
clientRoute.post('/bookings', checkJwt.checkJwt, clientContr.payments)
clientRoute.get('/Bookinghistory', checkJwt.checkJwt, clientContr.Bookinghistory)
clientRoute.get('/bookingCancel', checkJwt.checkJwt, clientContr.bookingCancel)
clientRoute.get('/CouponList', checkJwt.checkJwt, clientContr.CouponList)
clientRoute.post('/applycoupon', checkJwt.checkJwt, clientContr.Applycoupon)
clientRoute.post('/saveChat', checkJwt.checkJwt, clientContr.saveChat)
clientRoute.get('/getChat', checkJwt.checkJwt, clientContr.getChat)



module.exports = clientRoute;
