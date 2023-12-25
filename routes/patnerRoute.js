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

module.exports = parnerRoute;
