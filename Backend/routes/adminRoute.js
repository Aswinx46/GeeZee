const express = require('express')
const admin_route = express()
const adminController = require('../controllers/adminController')
const auth = require('../auth/adminAuth')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')
const OrderController = require('../controllers/OrderController')
const brandController = require('../controllers/BrandController')

admin_route.post('/login', adminController.login)
admin_route.get('/usersList', auth.adminAuth, adminController.fetchUser)
admin_route.patch('/userEdit/:id', auth.adminAuth, adminController.editUser)
admin_route.post('/refreshToken', adminController.refreshToken)


admin_route.post('/addCategory', auth.adminAuth, categoryController.addCategory)
admin_route.get('/category', auth.adminAuth, categoryController.showCategory)
admin_route.patch('/editCategory/:id', auth.adminAuth, categoryController.editCategory)
admin_route.patch('/editCategoryName/:id', auth.adminAuth, categoryController.editCategoryName)


admin_route.post('/addProduct', auth.adminAuth, productController.addProduct)
admin_route.get('/products', auth.adminAuth, productController.showProduct)
admin_route.put('/editProduct/:id', auth.adminAuth, productController.editProduct)

admin_route.get('/brands', auth.adminAuth, brandController.showBrand)
admin_route.post('/addBrand', auth.adminAuth, brandController.addBrand)
admin_route.patch('/editBrand/:id', auth.adminAuth, brandController.changeStatus)
admin_route.patch('/editBrandName/:brandId', auth.adminAuth, brandController.changeBrandName)

admin_route.get('/showOrders', auth.adminAuth, OrderController.showAllOrders)
admin_route.patch('/changeOrderStatus/:orderId', auth.adminAuth, OrderController.changeOrderStatus)
admin_route.get('/getReturnProducts', auth.adminAuth, OrderController.getReturnProducts)
admin_route.patch('/confirmReturn/:orderId', auth.adminAuth, OrderController.confirmReturnProduct)

module.exports = admin_route