const express = require('express');
const clientRoute = express.Router();
const clientContr = require('../controllers/clientController')
const checkJwt = require('../middleware/userAuth')


clientRoute.post('/signup', clientContr.signUp);
clientRoute.post('/otpVarify', clientContr.otp);
clientRoute.post('/login', clientContr.login);
clientRoute.post('/addpartner', clientContr.addpartner);
clientRoute.get('/profile', checkJwt.checkJwt, clientContr.getProfile);



module.exports = clientRoute;
