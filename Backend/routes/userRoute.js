const express=require('express')
const user_route=express()
const userController=require('../controllers/userController')
const auth=require('../auth/userAuth')
const productController=require('../controllers/productController')
const categoryController=require('../controllers/categoryController')
user_route.post('/signup',userController.signup)
user_route.post('/otpVerification',userController.otpVerification)
user_route.post('/resendOtp',userController.resendOtp)
user_route.post('/googleAuthenticate',userController.googleSave)
user_route.post('/login',userController.login)
user_route.post('/refreshToken',userController.refreshToken)

user_route.get('/products',auth.authToken,productController.showProductListed)


user_route.get('/category',auth.authToken,categoryController.showCategory)
module.exports=user_route