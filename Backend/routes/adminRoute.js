const express = require('express')
const admin_route = express()
const adminController = require('../controllers/adminController')
const auth = require('../auth/adminAuth')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')
const OrderController = require('../controllers/OrderController')
const brandController = require('../controllers/BrandController')
const couponConrtoller=require('../controllers/CouponController')
const salesReportController=require('../controllers/SalesReportController')
const offerController=require('../controllers/OfferController')
admin_route.post('/login', adminController.login)
admin_route.get('/usersList/:pageNumber', auth.adminAuth, adminController.fetchUser)
admin_route.patch('/userEdit/:id', auth.adminAuth, adminController.editUser)
admin_route.post('/refreshToken', adminController.refreshToken)


admin_route.post('/addCategory', auth.adminAuth, categoryController.addCategory)
admin_route.get('/category', auth.adminAuth, categoryController.showCategory)
admin_route.patch('/editCategory/:id', auth.adminAuth, categoryController.editCategory)
admin_route.patch('/editCategoryName/:id', auth.adminAuth, categoryController.editCategoryName)


admin_route.post('/addProduct', auth.adminAuth, productController.addProduct)
admin_route.get('/products/:pageNumber', auth.adminAuth, productController.showProduct)
admin_route.put('/editProduct/:id', auth.adminAuth, productController.editProduct)

admin_route.get('/brands', auth.adminAuth, brandController.showBrand)
admin_route.post('/addBrand', auth.adminAuth, brandController.addBrand)
admin_route.patch('/editBrand/:id', auth.adminAuth, brandController.changeStatus)
admin_route.patch('/editBrandName/:brandId', auth.adminAuth, brandController.changeBrandName)

admin_route.get('/showOrders/:pageNumber', auth.adminAuth, OrderController.showAllOrders)
admin_route.patch('/changeOrderStatus/:orderId', auth.adminAuth, OrderController.changeOrderStatus)
admin_route.get('/getReturnProducts', auth.adminAuth, OrderController.getReturnProducts)
admin_route.patch('/confirmReturn/:orderId', auth.adminAuth, OrderController.confirmReturnProduct)
admin_route.get('/trending',auth.adminAuth,OrderController.trendingItems)

admin_route.post('/createCoupon',auth.adminAuth,couponConrtoller.createCoupon)
admin_route.get('/getCoupon',auth.adminAuth,couponConrtoller.showCoupon)
admin_route.patch('/changeStatusOfCoupon/:couponId',auth.adminAuth,couponConrtoller.changeStatusOfCoupon)

admin_route.get('/salesReport',auth.adminAuth,salesReportController.salesReport)
admin_route.post('/addOffer/:productId',auth.adminAuth,offerController.addOffer)
admin_route.patch('/changeStatusOrder/:offerId',auth.adminAuth,offerController.changeStatusOfOffer)
admin_route.post('/addOfferCategory/:categoryId',auth.adminAuth,offerController.addCategoryOffer)
admin_route.patch('/changeListOfferCategory/:offerId',auth.adminAuth,offerController.changeStatusOfCategoryOffer)

module.exports = admin_route