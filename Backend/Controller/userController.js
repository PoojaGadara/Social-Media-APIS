const Errorhandler = require('../utills/errorHandler')
const catchAsyceError = require('../middleware/catchAsyncError')
const userModel = require('../models/userModel');
const sendToken = require('../utills/jwtToken')
const sendEmail = require('../utills/sendEmail')
const crypto = require('crypto');

//Register User
exports.registerUser = catchAsyceError(async (req,res)=>{

    const {userName,email,password} = req.body;
    const user = await userModel.create({
        userName,email,password
    });
    //Data Encryption into Buffer
    const encrypted = key.encrypt(JSON.stringify(user))
    console.log(encrypted)
    //Data Decryption
    const decryptedUserData = key.decrypt(encrypted , 'utf8')
    console.log(decryptedUserData)
    //Send Data to SendToken Function
    sendToken(user,201,res)
});

//Login User
exports.LoginUser = catchAsyceError(async(req,res,next)=> {
    const { email, password } = req.body;

    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new Errorhandler("Please Enter Email & Password", 400));
    }
  
    const user = await userModel.findOne({ email }).select("+password");
  
    console.log(user)

    if (!user) {
      return next(new Errorhandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);

    console.log(isPasswordMatched)
  
    if (!isPasswordMatched) {
      return next(new Errorhandler("Invalid email or password", 401));
    }
  
    sendToken(user, 200, res);
})


//Forget Password
exports.forgotPassword = catchAsyceError(async(req,res,next) => {
    const user = await userModel.findOne({email : req.body.email})

    if(!user){
        return next(new Errorhandler('User Not Found',404))
    }

    //Get ResetPassword Token 
    const resettoken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave : false});

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resettoken}`

    const message =  `Your Password Reset Token Is :- \n\n ${resetPasswordUrl} \n\n if you don't requested email then , please ignore it`;

    try {

        await sendEmail({

            email:user.email,
            subject: `Password Recovery`,
            message,
        })

        res.status(200).json({
            success : true,
            message:    `Email send to ${user.email} successfully`
        }) 
        
    } catch (error) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined

          await user.save({ validateBeforeSave : false});

          return next(new Errorhandler(error.message,500))
    }
});

//Reset Passwprd 
exports.resetPassword = catchAsyceError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

  console.log(user)
  if (!user) {
    return next(
      new Errorhandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Errorhandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

exports.userLogout = catchAsyceError(async(req,res,next) => {
  res.cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true,
  })

  res.status(200).json({
      success :true,
      message:"Logged Out"
  });
})






