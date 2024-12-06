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

user_route.get('/products',productController.showProductListed)
user_route.get('/relatedProducts/:id',productController.showRelatedProducts)

user_route.get('/category',categoryController.showCategory)
module.exports=user_route