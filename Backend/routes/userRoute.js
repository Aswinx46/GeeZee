const express=require('express')
const user_route=express()
const userController=require('../controllers/userController')

user_route.post('/signup',userController.signup)
user_route.post('/otpVerification',userController.otpVerification)
user_route.post('/resendOtp',userController.resendOtp)
user_route.post('/googleAuthenticate',userController.googleSave)
user_route.post('/login',userController.login)
module.exports=user_route