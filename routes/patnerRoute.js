const express = require('express');
const parnerRoute = express.Router();
const partnerClr = require('../controllers/patnerController')
const jwtToken = require('../middleware/partnerAuth')


parnerRoute.post('/partnerLogin', partnerClr.partnerLogin)
parnerRoute.post('/addCarImg', jwtToken.checkJwt, partnerClr.addCarImg)
parnerRoute.post('/editCar', jwtToken.checkJwt, partnerClr.editCar)
parnerRoute.get('/partnerCars', jwtToken.checkJwt, partnerClr.partnerCars)
parnerRoute.get('/partnerCarDetail', jwtToken.checkJwt, partnerClr.partnerCarDetail)
parnerRoute.get('/profileDetails', jwtToken.checkJwt, partnerClr.profileDetails)
parnerRoute.post('/editPartnerProfile', jwtToken.checkJwt, partnerClr.editPartnerProfile)
parnerRoute.get('/bookingList', jwtToken.checkJwt, partnerClr.BookingList)
parnerRoute.post('/statusHandle', jwtToken.checkJwt, partnerClr.statusHandle)
parnerRoute.get('/PartnerCancelBooking', jwtToken.checkJwt, partnerClr.PartnerBookingCancelled)
parnerRoute.post('/saveChat', jwtToken.checkJwt, partnerClr.saveChat)
parnerRoute.get('/getChat', jwtToken.checkJwt, partnerClr.getChat)
parnerRoute.get('/chartbooking', jwtToken.checkJwt, partnerClr.ChartView)

module.exports = parnerRoute;
