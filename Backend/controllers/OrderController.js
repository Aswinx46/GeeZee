const Order = require('../models/OrderSchema')
const Product = require('../models/productSchema')
const Brand = require('../models/brandSchema')
const Category = require('../models/categorySchema')
const product = require('../models/productSchema')
const Cart = require('../models/CartSchema')
const mongoose = require('mongoose')
const Razorpay = require('razorpay')
const { v4: uuidv4 } = require('uuid')
const Wallet = require('../models/WalletSchema')
const Coupon = require('../models/CouponSchema')
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

    const { mainAddress, cartItems, paymentMethod, total, shippingCharge, selectedCoupon } = req.body
    // console.log(paymentMethod)
    // console.log('this isthe cartItems', cartItems)
    // console.log('this isthe variants', cartItems.variants)
    // console.log('this is the total', total, 'this is the shippingCharge', shippingCharge)
    // console.log('this is the final amount', total + shippingCharge)

    try {
        const brandId = cartItems[0].brandId
        const categoryId = cartItems[0].categoryId
        const productId = cartItems[0].id

        if (selectedCoupon) {
            const coupon = await Coupon.findById(selectedCoupon._id)
            const exitingUser = coupon.userId.find((id) => id == userId)
            if (exitingUser) return res.status(400).json({ message: "this user already used this coupon" })
            coupon.userId.push(userId)
            await coupon.save()
        }
        // console.log('this is the cart item',cartItems.quantity)
        const status = await productBlockCheckingFunction(productId, brandId, categoryId)
        // console.log('this is the status', status)
        const isBlock = status.some((item) => item.status == 'inactive')
        if (isBlock) return res.status(400).json({ message: "Product blocked by admin remove the product to continue" })



        for (item of cartItems) {
            // console.log("--------------------------------------------------------------")
            // console.log('this is the items', item)

            const allVariants = await Product.findById(item.id, 'variants')
            const changeVariant = allVariants.variants.find(
                (variant) => variant._id.toString() === item.variants[0]._id
            );
            if (changeVariant) {
                changeVariant.stock -= item.quantity
                // console.log('this is the final stock ', changeVariant.stock)
                if (changeVariant.stock < 0) {
                    return res.status(400).json({ message: "Out of Stock" })
                }
                await allVariants.save()
            }
            // console.log('this is the all variants', allVariants)
        }
        let razorPayIdOrder = null
        if (paymentMethod === 'Razorpay') {
            const razorpayOptions = {
                amount: (total + shippingCharge - (selectedCoupon?.offerPrice || 0)) * 100,
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            }

            const razorpayOrder = await razorpay.orders.create(razorpayOptions)
            // console.log('this is  razorpay order', razorpayOrder)
            if (!razorpayOrder) return res.status(500).json({ message: "Razorpay payment Failed" })
            razorPayIdOrder = razorpayOrder.id

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
            finalAmount: total + shippingCharge - (selectedCoupon?.offerPrice || 0),
            address: mainAddress._id,
            paymentMethod,
            discount: selectedCoupon?.offerPrice || 0,
            shippingCost: shippingCharge,
            razorpayOrderId: razorPayIdOrder,
            paymentStatus: paymentMethod == 'Cash on Delivery' ? 'Pending' : 'Awaiting Payment'
        })
        // await coupon.save()
        await order.save()









        if (paymentMethod != 'Razorpay') {
            await Cart.updateOne({ userId }, { $set: { items: [] } })
            console.log('this is inside the cod')
            return res.status(200).json({ message: "order created" })

        }

    } catch (error) {
        console.log('error while creating order', error)
        return res.status(500).json({ message: "error while creating order", error })
    }
}



const verifyPayment = async (req, res) => {
    const { paymentId, orderId, signature } = req.body;
    const { userId } = req.params
    console.log('this is the payment id', paymentId, 'this is the orderid', orderId)
    try {
        // Step 1: Fetch payment details from Razorpay
        const paymentDetails = await razorpay.payments.fetch(paymentId);
        console.log('this is the ', paymentDetails)
        if (paymentDetails.status !== 'captured') {
            return res.status(400).json({ message: 'Payment not successful. Please try again.' });
        }

        // Step 2: Verify payment integrity (optional but recommended)
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');
        console.log('this isthe genarated signature', generatedSignature)
        console.log('this is the genarated signature =', generatedSignature)
        console.log('this is the sended signature', signature)
        if (generatedSignature !== signature) {
            return res.status(400).json({ message: 'Payment verification failed. Possible fraud detected.' });
        }

        // Step 3: Update the order status in the database
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: orderId },
            { paymentStatus: 'Paid', paymentId },
            { new: true }
        );
        await Cart.updateOne({ userId }, { $set: { items: [] } })

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
    const { reason } = req.body
    console.log(reason)
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
        const order = await Order.findByIdAndUpdate(orderId, { status: 'Cancelled', CancellationReason: reason }, { new: true })
        if (!order) return res.status(400).json({ message: 'no order to update' })
        return res.status(200).json({ message: "Order Cancelled" })
    } catch (error) {
        console.log('error while cancelling the order', error)
        return res.status(500).json({ message: "error while cancelling the order", error })
    }
}

const showAllOrders = async (req, res) => {

    try {
        const orders = await Order.find().populate('orderItems.productId', 'productImg title').populate('address').populate('userId', 'lastName firstName email phoneNo')
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

const returnOrderProduct = async (req, res) => {
    try {
        const { orderId } = req.params
        const { orderItemId } = req.params
        const { returnReason } = req.body

        const selectedOrder = await Order.findById(orderId)
        // console.log('this is the selcted order',selectedOrder)
        const selectedVariant = selectedOrder.orderItems.find((item) => item._id.toString() == orderItemId.toString())
        console.log('this is the selected varient', selectedVariant)
        selectedVariant.variant.returnOrder = 'Pending'
        selectedVariant.variant.returnReason = returnReason

        console.log('this is selctedORder', selectedVariant)
        await selectedOrder.save()

        return res.status(200).json({ message: "Return request Sended" })
    } catch (error) {
        console.log('error while returning the product', error)
        return res.status(500).json({ message: "error while returning the product", error })
    }
}

const getReturnProducts = async (req, res) => {
    try {
        const orders = await Order.find({ 'orderItems.variant.returnOrder': 'Pending' }, {
            userId: 1, _id: 1, orderItems: 1,
            orderId: 1, paymentMethod: 1, invoiceDate: 1
        }).populate('orderItems.productId', 'title productImg price').populate('address').populate('userId', 'firstName lastName email phoneNo');
        console.log('this is the orders', orders)
        const filteredOrders = orders.map((order) => ({
            ...order.toObject(), // Convert Mongoose document to plain JavaScript object
            orderItems: order.orderItems.filter(
                (item) => item.variant.returnOrder === 'Pending'
            ),
        }));
        return res.status(200).json({ message: 'data fetched', orders: filteredOrders })
    } catch (error) {
        console.log('error while fetching return order produtcs', error)
        res.status(500).json({ message: "error while fetching return order products" })
    }
}

const confirmReturnProduct = async (req, res) => {
    try {
        const { orderId } = req.params
        console.log(orderId)
        // const update=await Order.findByIdAndUpdate(orderId,{'orderItems.variant.returnOrder' : 'Accepted'},{new:true})
        const update = await Order.findOneAndUpdate(
            { _id: orderId, 'orderItems.variant.returnOrder': 'Pending' },
            { $set: { 'orderItems.$.variant.returnOrder': 'Accepted' } },
            { new: true }
        );
        console.log('this is update', update)
        if (!update) return res.status(400).json({ message: "no order found" })
        const returnedVariant = update.orderItems.find((item) => item.variant.returnOrder == 'Accepted')
        console.log('this is the returned varient', returnedVariant)
        const { productId, variant, quantity } = returnedVariant
        if (!returnedVariant) {
            return res.status(400).json({ message: "No matching item found for return" });
        }
        const selectedProduct = await Product.findByIdAndUpdate(productId, {
            $inc: { "variants.$[variantFilter].stock": quantity }, // Increment stock for the matched variant
        }, {
            new: true,
            arrayFilters: [
                { "variantFilter._id": variant._id }, // Filter for the correct variant
            ],
        }
        )
        if (!selectedProduct) {
            return res.status(400).json({ message: "Failed to update variant stock" });
        }

        console.log('this is the update', update)
        const userId = update.userId
        console.log('this is the user id', userId)
        const wallet = await Wallet.findOne({ userId })

        if (!wallet) return res.status(400).json({ message: 'no wallet found' })



        const transaction = {
            type: 'Refund',
            transaction_id: uuidv4(), // Generate a unique transaction ID
            amount: returnedVariant.quantity * returnedVariant.price,
            description: 'Product Returned amount',
            date: new Date(), // Add a timestamp for the transaction
        };
        wallet.transactions.push(transaction)
        wallet.balance += returnedVariant.quantity * returnedVariant.price
        await wallet.save()
        console.log('this is the wallet', wallet)
        return res.status(200).json({ message: "order Updated", update, selectedProduct })
    } catch (error) {
        console.log('error while confirming the return order', error)
        return res.status(500).json({ message: "error while accepting return order", error })
    }
}

module.exports = {
    createOrder,
    showOrders,
    cancelOrder,
    showAllOrders,
    changeOrderStatus,
    verifyPayment,
    returnOrderProduct,
    getReturnProducts,
    confirmReturnProduct
}