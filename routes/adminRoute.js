const express = require('express');
const adminRoute = express.Router();
const adminClr = require('../controllers/adminController')
const checkJwt = require('../middleware/adminAuth')


adminRoute.post('/adminLogin', adminClr.login)
adminRoute.get('/partnerView', adminClr.partnerView);
adminRoute.get('/userList', checkJwt.checkJwt, adminClr.userList)
adminRoute.get('/partnerList', checkJwt.checkJwt, adminClr.partnerList)
adminRoute.get('/userStatus', checkJwt.checkJwt, adminClr.userStatus)
adminRoute.get('/partnerStatus', checkJwt.checkJwt, adminClr.partnerStatus)
adminRoute.get('/PartnerVarifyAccept', checkJwt.checkJwt, adminClr.PartnerVarifyAccept)
adminRoute.get('/PartnerVarifyCancel', checkJwt.checkJwt, adminClr.PartnerVarifyCancel)
adminRoute.get('/carDatas', checkJwt.checkJwt, adminClr.carDatas)
adminRoute.get('/carDetails', checkJwt.checkJwt, adminClr.carDetails)
adminRoute.get('/ListOrUnlist', checkJwt.checkJwt, adminClr.ListOrUnlist)

module.exports = adminRoute;