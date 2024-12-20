const express = require('express')
const user_route = express()
const userController = require('../controllers/userController')
const auth = require('../auth/userAuth')
const productController = require('../controllers/productController')
const categoryController = require('../controllers/categoryController')
const cartController = require('../controllers/cartController')
const addressController = require('../controllers/AddressController')
const orderController = require('../controllers/OrderController')
const brandController = require('../controllers/BrandController')



user_route.post('/signup', userController.signup)
user_route.post('/otpVerification', userController.otpVerification)
user_route.post('/resendOtp', userController.resendOtp)
user_route.post('/googleAuthenticate', userController.googleSave)
user_route.post('/login', userController.login)
user_route.post('/refreshToken', userController.refreshToken)
user_route.patch('/changePassword/:userId', auth.authToken, userController.changePassword)
user_route.put('/changeUserInfo/:userId',auth.authToken,userController.changeInformation)


user_route.get('/products', productController.showProductListed)
user_route.get('/relatedProducts/:id', productController.showRelatedProducts)
user_route.get('/showProductVariantQuantity/:id', productController.showProductVariantQuantity)
user_route.get('/filterProducts', productController.filterProducts)

user_route.post('/cart', auth.authToken, cartController.addToCart)
user_route.get('/cartItems/:id', auth.authToken, cartController.showCartItems)
user_route.patch('/changeQuantity/:itemId/:cartId/:productId', auth.authToken, cartController.changeQuantity)
user_route.delete('/deleteItem/:varientId/:cartId', auth.authToken, cartController.deleteItem)


user_route.post('/address', auth.authToken, addressController.addAddress)
user_route.get('/showAddress/:userId', auth.authToken, addressController.showAddress)
user_route.delete('/deleteAddress/:addressId', auth.authToken, addressController.deleteAddress)
user_route.patch('/changeDefaultAddress/:addressId/:userId', auth.authToken, addressController.setDefaultAddress)
user_route.put('/editAddress', auth.authToken, addressController.editAddress)

user_route.post('/createOrder/:userId/:variantId', auth.authToken, orderController.createOrder)
user_route.get('/orderDetails/:userId', auth.authToken, orderController.showOrders)
user_route.patch('/cancelOrder/:orderId', auth.authToken, orderController.cancelOrder)
user_route.post('/confirmPayment/:userId',auth.authToken,orderController.verifyPayment)
user_route.patch('/returnProduct/:orderId/:orderItemId',auth.authToken,orderController.returnOrderProduct)

user_route.get('/brands', auth.authToken, brandController.showBrand)
user_route.get('/categories', auth.authToken, categoryController.showCategory)


user_route.get('/category', categoryController.showCategory)
module.exports = user_route