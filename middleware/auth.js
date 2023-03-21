const catchAsyceError = require('./catchAsyncError')
const jwt = require('jsonwebtoken')
const user = require('../models/userModel');
const Errorhandler = require('../utills/errorHandler');

exports.isAuthenticateUser = catchAsyceError(async(req,res,next) => {
    const { token}  = req.cookies;
    
    if(!token){
        return next(new Errorhandler("Please Login to access this Resource",401))
    }
    const decodeData = jwt.verify(token,process.env.SECRETKEY)

    req.user = await user.findById(decodeData.id)

    next();
})
