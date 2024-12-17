const Order = require('../models/OrderSchema')
const Product = require('../models/productSchema')
const Brand = require('../models/brandSchema')
const Category = require('../models/categorySchema')
const product = require('../models/productSchema')
const Cart = require('../models/CartSchema')
const mongoose = require('mongoose')
const productBlockCheckingFunction = async (productId, brandId, categoryId) => {
    // console.log('this is the brandid',brandId)
    // console.log('this is category id',categoryId)
    // console.log('this isthe product id',productId)

    const statusOfProduct = await Product.findById(productId, { status: 1, _id: 0 })
    const statusOfBrand = await Brand.findById(brandId, { status: 1, _id: 0 })
    const statusOfCategory = await Category.findById(categoryId, { status: 1, _id: 0 })
    return [statusOfProduct, statusOfBrand, statusOfCategory]
}

const createOrder = async (req, res) => {
    const { userId, variantId } = req.params

    const { mainAddress, cartItems, paymentMethod, total, shippingCharge } = req.body
    console.log(paymentMethod)
    console.log('this isthe cartItems', cartItems)
    console.log('this isthe variants', cartItems.variants)
    try {
        const brandId = cartItems[0].brandId
        const categoryId = cartItems[0].categoryId
        const productId = cartItems[0].id

        // console.log('this is the cart item',cartItems.quantity)
        const status = await productBlockCheckingFunction(productId, brandId, categoryId)
        console.log('this is the status', status)
        const isBlock = status.some((item) => item.status == 'inactive')
        if (isBlock) return res.status(400).json({ message: "Product blocked by admin remove the product to continue" })



        for (item of cartItems) {
            console.log("--------------------------------------------------------------")
            console.log('this is the items', item)

            const allVariants = await Product.findById(item.id, 'variants')
            const changeVariant = allVariants.variants.find(
                (variant) => variant._id.toString() === item.variants[0]._id
            );
            if (changeVariant) {
                changeVariant.stock -= item.quantity
                console.log('this is the final stock ', changeVariant.stock)
                if (changeVariant.stock < 0) {
                    return res.status(400).json({ message: "Out of Stock" })
                }
                await allVariants.save()
            }
            console.log('this is the all variants', allVariants)
        }


        const orderItems = cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.variants[0].price,
            variant: item.variants[0]
            // variantId:changeVariant
        }))

        const order = new Order({
            userId,
            orderItems,
            totalPrice: total,
            discount: 0,
            finalAmount: total + shippingCharge,
            address: mainAddress._id,
            paymentMethod,
            shippingCost: shippingCharge,
        })
        await order.save()
        console.log('haskjdhf')
        // const allVariants=await Product.findById(productId,'variants')

        // const changeVariant= allVariants.variants.find((item)=>item._id == cartItems[0].variants[0]._id)




        await Cart.updateOne({ userId }, { $set: { items: [] } })

        return res.status(200).json({ message: "order created" })

    } catch (error) {
        console.log('error while creating order', error)
        return res.status(500).json({ message: "error while creating order", error })
    }
}

const showOrders = async (req, res) => {
    const { userId } = req.params
    console.log('this is the user id', userId)


    try {
        const orderDetails = await Order.find({ userId }).populate('orderItems.productId', 'productImg title').populate('address',)
     
        if (!orderDetails) return res.status(400).json({ message: 'no orders ' })

        return res.status(200).json({ message: "order details fetched", orderDetails })

    } catch (error) {
        console.log('error while fetching the order details', error)
        return res.status(500).json({ message: "error while fetching the data" })
    }
}

const cancelOrder = async (req, res) => {
    const { orderId } = req.params
    console.log('this is canceling order id', orderId)
    try {

        const selectedOrder=await Order.findById(orderId,'orderItems')
        console.log(selectedOrder)
        const details=selectedOrder.orderItems.map((items)=>({
            variantId:items.variant._id,
            quantity:items.quantity,
            productId:items.productId
        }))

        for (const item of details) {
            await Product.findOneAndUpdate(
                { _id: item.productId, "variants._id": item.variantId },  
                { $inc: { "variants.$.stock": item.quantity } } 
            );
        }
        

        // const order=await Cart.findByIdAndDelete(mongoose.Types.ObjectId(orderId))
        const order = await Order.findByIdAndUpdate(orderId, { status: 'Cancelled' }, { new: true })
        if (!order) return res.status(400).json({ message: 'no order to update' })
        return res.status(200).json({ message: "Order Cancelled" })
    } catch (error) {
        console.log('error while cancelling the order', error)
        return res.status(500).json({ message: "error while cancelling the order", error })
    }
}

const showAllOrders = async (req, res) => {

    try {
        const orders = await Order.find().populate('address').populate('userId', 'lastName firstName email phoneNo').populate('orderItems.productId', 'productImg title')
        if (!orders) return res.status(400).json({ message: 'no order found' })
        return res.status(200).json({ message: "order details fetched", orders })
    } catch (error) {
        console.log('error while fetching the order details', error)
        return res.status(500).json({ message: 'error while fetching the order details' })
    }
}

const changeOrderStatus=async (req,res) => {
    const{orderId}=req.params
    const {newStatus}=req.body
    console.log('this is the order id',orderId)
    console.log('this is the status',newStatus)
    try {
        
       
        const order=await Order.findByIdAndUpdate(orderId,{status:newStatus},{new:true})
        if(!order) return res.status(400).json({message:"no order found"})
            return res.status(200).json({message:'Order status Updated'})
    } catch (error) {
        console.log('error while changing the status of the order',error)
        return res.status(500).json({message:"error while changing the status"})
    }
}

module.exports = {
    createOrder,
    showOrders,
    cancelOrder,
    showAllOrders,
    changeOrderStatus
}