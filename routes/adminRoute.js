const express = require('express');
const adminRouter = express.Router();
const adminClr = require('../controllers/adminController')



adminRouter.post('/adminLog', adminClr.login)