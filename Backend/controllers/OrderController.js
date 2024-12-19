const Order = require('../models/OrderSchema')
const Product = require('../models/productSchema')
const Brand = require('../models/brandSchema')
const Category = require('../models/categorySchema')
const product = require('../models/productSchema')
const Cart = require('../models/CartSchema')
const mongoose = require('mongoose')
const Razorpay = require('razorpay')
require('dotenv').config()
const crypto = require('crypto');
const productBlockCheckingFunction = async (productId, brandId, categoryId) => {
    const statusOfProduct = await Product.findById(productId, { status: 1, _id: 0 })
    const statusOfBrand = await Brand.findById(brandId, { status: 1, _id: 0 })
    const statusOfCategory = await Category.findById(categoryId, { status: 1, _id: 0 })
    return [statusOfProduct, statusOfBrand, statusOfCategory]
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
})

const createOrder = async (req, res) => {
    const { userId, variantId } = req.params

    const { mainAddress, cartItems, paymentMethod, total, shippingCharge } = req.body
    console.log(paymentMethod)
    // console.log('this isthe cartItems', cartItems)
    // console.log('this isthe variants', cartItems.variants)
    console.log('this is the total', total, 'this is the shippingCharge', shippingCharge)
    console.log('this is the final amount', total + shippingCharge)

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
        let razorPayIdOrder=''
        if (paymentMethod === 'Razorpay') {
            const razorpayOptions = {
                amount: (total + shippingCharge) * 100,
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            }

            const razorpayOrder = await razorpay.orders.create(razorpayOptions)
            console.log('this is  razorpay order', razorpayOrder)
            if (!razorpayOrder) return res.status(500).json({ message: "Razorpay payment Failed" })
                razorPayIdOrder=razorpayOrder.id
        
            res.status(200).json({
                message: "Razorpay order created successfully",
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            })
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
            razorpayOrderId: razorPayIdOrder,
            paymentStatus: paymentMethod == 'Cash on Delivery' ? 'Pending' : 'Awaiting Payment'
        })
        await order.save()
        console.log('haskjdhf')





        await Cart.updateOne({ userId }, { $set: { items: [] } })

   
        if (paymentMethod != 'Razorpay') {
            console.log('this is inside the cod')
            return res.status(200).json({ message: "order created" })

        }

    } catch (error) {
        console.log('error while creating order', error)
        return res.status(500).json({ message: "error while creating order", error })
    }
}



const verifyPayment = async (req, res) => {
    const { paymentId, orderId,signature } = req.body;
    console.log('this is the payment id',paymentId,'this is the orderid',orderId)
    try {
        // Step 1: Fetch payment details from Razorpay
        const paymentDetails = await razorpay.payments.fetch(paymentId);
        console.log('this is the ',paymentDetails)
        if (paymentDetails.status !== 'captured') {
            return res.status(400).json({ message: 'Payment not successful. Please try again.' });
        }

        // Step 2: Verify payment integrity (optional but recommended)
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');
        console.log('this isthe genarated signature',generatedSignature)
        console.log('this is the genarated signature =',generatedSignature)
        console.log('this is the sended signature',signature)
        if (generatedSignature !== signature) {
            return res.status(400).json({ message: 'Payment verification failed. Possible fraud detected.' });
        }

        // Step 3: Update the order status in the database
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: orderId },
            { paymentStatus: 'Paid', paymentId },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found. Payment could not be linked.' });
        }

        // Step 4: Send success response
        return res.status(200).json({
            message: 'Payment confirmed and order updated successfully.',
            order,
        });
    } catch (error) {
        console.error('Error while confirming payment:', error);
        return res.status(500).json({
            message: 'An error occurred while confirming the payment.',
            error: error.message,
        });
    }
};




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

        const selectedOrder = await Order.findById(orderId, 'orderItems')
        console.log(selectedOrder)
        const details = selectedOrder.orderItems.map((items) => ({
            variantId: items.variant._id,
            quantity: items.quantity,
            productId: items.productId
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

const changeOrderStatus = async (req, res) => {
    const { orderId } = req.params
    const { newStatus } = req.body
    console.log('this is the order id', orderId)
    console.log('this is the status', newStatus)
    try {


        const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true })
        if (!order) return res.status(400).json({ message: "no order found" })
        return res.status(200).json({ message: 'Order status Updated' })
    } catch (error) {
        console.log('error while changing the status of the order', error)
        return res.status(500).json({ message: "error while changing the status" })
    }
}

module.exports = {
    createOrder,
    showOrders,
    cancelOrder,
    showAllOrders,
    changeOrderStatus,
    verifyPayment
}