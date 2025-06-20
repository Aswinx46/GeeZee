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
const StatusCodes = require('../enums/httpStatusCode')
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


    const totalOfferPrice = cartItems.reduce((acc, item) => acc += item?.offerPrice, 0)


    try {
        const brandId = cartItems[0].brandId
        const categoryId = cartItems[0].categoryId
        const productId = cartItems[0].id

        if (selectedCoupon) {
            const coupon = await Coupon.findById(selectedCoupon._id)
            const exitingUser = coupon.userId.find((id) => id == userId)
            if (exitingUser) return res.status(StatusCodes.BAD_REQUEST).json({ message: "this user already used this coupon" })
            coupon.userId.push(userId)
            await coupon.save()
        }
        const status = await productBlockCheckingFunction(productId, brandId, categoryId)
        const isBlock = status.some((item) => item.status == 'inactive')
        if (isBlock) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Product blocked by admin remove the product to continue" })



        const insufficientStock = [];
        let originalAmount = 0

        for (const item of cartItems) {

            const product = await Product.findById(item.id, "variants");
            const variant = product.variants.find((v) => v._id.toString() === item.variants[0]._id);
            if (!variant || variant.stock < item.quantity) {
                insufficientStock.push(item.id);
            }

            originalAmount += item.offerPrice || item.variants[0].price * item.quantity

        }
        if (insufficientStock.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "out of stock", insufficientStock });
        }




        let razorPayIdOrder = null
        if (paymentMethod === 'Razorpay') {
            const razorpayOptions = {
                amount: (total + shippingCharge - (selectedCoupon?.offerPrice || 0)) * 100,
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            }

            const razorpayOrder = await razorpay.orders.create(razorpayOptions)
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
            price: item.offerPrice || item.variants[0].price,
            variant: item.variants[0]
            // variantId:changeVariant
        }))



        const order = new Order({
            userId,
            orderItems,
            totalPrice: originalAmount,
            finalAmount: total + shippingCharge - (selectedCoupon?.offerPrice || 0),
            address: mainAddress._id,
            paymentMethod,
            discount: total - (originalAmount - selectedCoupon?.offerPrice || originalAmount),
            shippingCost: shippingCharge,
            razorpayOrderId: razorPayIdOrder,
            paymentStatus: paymentMethod == 'Cash on Delivery' ? 'Pending' : 'Awaiting Payment'
        })
        // await coupon.save()
        await order.save()


        for (item of cartItems) {


            const product = await Product.findById(item.id, 'variants categoryId brand salesCount')
            const changeVariant = product.variants.find(
                (variant) => variant._id.toString() === item.variants[0]._id
            );
            if (changeVariant) {
                changeVariant.stock -= item.quantity
                if (changeVariant.stock < 0) {
                    return res.status(400).json({ message: "Out of Stock" })
                }
                product.salesCount = (product.salesCount || 0) + item.quantity
                await product.save()
            }
            await Category.updateOne({ _id: product.categoryId }, { $inc: { salesCount: item.quantity } })

            await Brand.updateOne({ _id: product.brand }, { $inc: { salesCount: item.quantity } })


        }






        if (paymentMethod != 'Razorpay') {
            await Cart.updateOne({ userId }, { $set: { items: [] } })
            return res.status(StatusCodes.OK).json({ message: "order created" })

        }

    } catch (error) {
        console.log('error while creating order', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while creating order", error })
    }
}



const verifyPayment = async (req, res) => {
    const { paymentId, orderId, signature } = req.body;
    const { userId } = req.params
    try {
        // Step 1: Fetch payment details from Razorpay
        const paymentDetails = await razorpay.payments.fetch(paymentId);
        if (paymentDetails.status !== 'captured') {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Payment not successful. Please try again.' });
        }

        // Step 2: Verify payment integrity (optional but recommended)
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        if (generatedSignature !== signature) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Payment verification failed. Possible fraud detected.' });
        }

        // Step 3: Update the order status in the database
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: orderId },
            { paymentStatus: 'Paid', paymentId },
            { new: true }
        );
        await Cart.updateOne({ userId }, { $set: { items: [] } })

        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not found. Payment could not be linked.' });
        }

        // Step 4: Send success response
        return res.status(StatusCodes.OK).json({
            message: 'Payment confirmed and order updated successfully.',
            order,
        });
    } catch (error) {
        console.error('Error while confirming payment:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'An error occurred while confirming the payment.',
            error: error.message,
        });
    }
};




const showOrders = async (req, res) => {
    const { userId } = req.params


    try {
        const { pageNumber } = req.params

        const page = parseInt(pageNumber, 10);
        const limit = 5
        const skip = (page - 1) * limit
        const orderDetails = await Order.find({ userId }).populate('orderItems.productId', 'productImg title').populate('address',).sort({ createdOn: -1 }).limit(limit).skip(skip)

        const totalDocuments = await Order.find({ userId }).populate('orderItems.productId', 'productImg title').populate('address',).countDocuments()

        const totalPages = Math.ceil(totalDocuments / limit)

        if (!orderDetails) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no orders ' })

        return res.status(StatusCodes.OK).json({ message: "order details fetched", orderDetails, totalPages })

    } catch (error) {
        console.log('error while fetching the order details', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while fetching the data" })
    }
}


const showDetailOfOneOrder = async (req, res) => {
    const { userId } = req.params


    try {

        const orderDetails = await Order.find({ userId }).populate('orderItems.productId', 'productImg title').populate('address',)

        if (!orderDetails) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no orders ' })

        return res.status(StatusCodes.OK).json({ message: "order details fetched", orderDetails })

    } catch (error) {
        console.log('error while fetching the order details', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while fetching the data" })
    }
}

const cancelOrder = async (req, res) => {
    const { orderId, userId } = req.params
    const { reason, paymentMethod } = req.body

    try {

        const selectedOrder = await Order.findById(orderId, 'orderItems finalAmount shippingCost discount')




        const details = selectedOrder.orderItems.map((items) => {

            return {
                variantId: items.variant._id,
                quantity: items.quantity,
                productId: items.productId,
                totalPrice: items.quantity * items.price, // Use item total for this particular item
            };
        });


        for (const item of details) {
            await Product.findOneAndUpdate(
                { _id: item.productId, "variants._id": item.variantId },
                { $inc: { "variants.$.stock": item.quantity } }
            );
            await Product.findByIdAndUpdate(item.productId, { $inc: { salesCount: -item.quantity } });

            const product = await Product.findById(item.productId, 'categoryId brand');

            await Category.findByIdAndUpdate(product.categoryId, { $inc: { salesCount: -item.quantity } });

            await Brand.findByIdAndUpdate(product.brand, { $inc: { salesCount: -item.quantity } });
        }


        if (paymentMethod == 'Razorpay') {
            const wallet = await Wallet.findOne({ userId })

            if (!wallet) return res.status(400).json({ message: 'no wallet found' })

            const totalRefundAmount = details.reduce((sum, item) => sum + item.totalPrice, 0);


            const transaction = {
                type: 'Refund',
                transaction_id: uuidv4(),
                amount: selectedOrder.finalAmount ,
                description: 'Product Returned amount',
                date: new Date(),
            };
            wallet.transactions.push(transaction)
            wallet.balance += selectedOrder.finalAmount 
            await wallet.save()

        }


        // const Cartorder=await Cart.findByIdAndDelete(mongoose.Types.ObjectId(orderId))
        const order = await Order.findByIdAndUpdate(orderId, { status: 'Cancelled', CancellationReason: reason }, { new: true })
        if (!order) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no order to update' })
        return res.status(StatusCodes.OK).json({ message: "Order Cancelled" })
    } catch (error) {
        console.log('error while cancelling the order', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while cancelling the order", error })
    }
}

const showAllOrders = async (req, res) => {

    try {
        const { pageNumber } = req.params
        const page = parseInt(pageNumber, 10);
        const limit = 5
        const skip = (page - 1) * limit
        const orders = await Order.find().populate('orderItems.productId', 'productImg title').populate('address').populate('userId', 'lastName firstName email phoneNo').limit(limit).skip(skip)
        if (!orders) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no order found' })
        const totalDocuments = await Order.find().countDocuments()
        const totalPages = Math.ceil(totalDocuments / limit)
        return res.status(StatusCodes.OK).json({ message: "order details fetched", orders, totalPages })
    } catch (error) {
        console.log('error while fetching the order details', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'error while fetching the order details' })
    }
}

const changeOrderStatus = async (req, res) => {
    const { orderId } = req.params
    const { newStatus } = req.body

    try {

        if (newStatus == 'Cancelled') {
            const order = await Order.findById(orderId)


            for (const item of order.orderItems) {
                await Product.findOneAndUpdate(
                    { _id: item.productId, "variants._id": item.variant._id },
                    { $inc: { "variants.$.stock": item.quantity } }
                );
                await Product.findByIdAndUpdate(item.productId, { $inc: { salesCount: -item.quantity } });

                const product = await Product.findById(item.productId, 'categoryId brand');

                await Category.findByIdAndUpdate(product.categoryId, { $inc: { salesCount: -item.quantity } });

                await Brand.findByIdAndUpdate(product.brand, { $inc: { salesCount: -item.quantity } });
            }
            order.status = newStatus
            await order.save()
            return res.status(StatusCodes.OK).json({ message: 'order status changed and stock incremented' })
        }

        const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true })
        if (!order) return res.status(StatusCodes.BAD_REQUEST).json({ message: "no order found" })

        return res.status(StatusCodes.OK).json({ message: 'Order status Updated' })
    } catch (error) {
        console.log('error while changing the status of the order', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while changing the status" })
    }
}

const returnOrderProduct = async (req, res) => {
    try {
        const { orderId } = req.params
        const { orderItemId } = req.params
        const { returnReason } = req.body



        const selectedOrder = await Order.findById(orderId)
        const selectedVariant = selectedOrder.orderItems.find((item) => item._id.toString() == orderItemId.toString())

        selectedVariant.variant.returnOrder = 'Pending'
        selectedVariant.variant.returnReason = returnReason


        await selectedOrder.save()

        return res.status(StatusCodes.OK).json({ message: "Return request Sended" })
    } catch (error) {
        console.log('error while returning the product', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while returning the product", error })
    }
}

const getReturnProducts = async (req, res) => {
    try {
        const orders = await Order.find({ 'orderItems.variant.returnOrder': 'Pending' }, {
            userId: 1, _id: 1, orderItems: 1,
            orderId: 1, paymentMethod: 1, invoiceDate: 1, finalAmount: 1, totalPrice: 1, shippingCost: 1, discount: 1
        }).populate('orderItems.productId', 'title productImg price').populate('address').populate('userId', 'firstName lastName email phoneNo');

        const filteredOrders = orders.map((order) => ({
            ...order.toObject(), // Convert Mongoose document to plain JavaScript object
            orderItems: order.orderItems.filter(
                (item) => item.variant.returnOrder === 'Pending'
            ),
        }));
        return res.status(StatusCodes.OK).json({ message: 'data fetched', orders: filteredOrders })
    } catch (error) {
        console.log('error while fetching return order produtcs', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while fetching return order products" })
    }
}

const confirmReturnProduct = async (req, res) => {
    try {
        const { orderId, variantId } = req.params
        // console.log('this is index', index)
        // const update = await Order.findOneAndUpdate(
        //     { _id: orderId, 'orderItems.variant.returnOrder': 'Pending' },
        //     { $set: { 'orderItems.$.variant.returnOrder': 'Accepted' } },
        //     { new: true }
        // );
        const update = await Order.findById(orderId)
        console.log('this is update', update)

        if (!update) return res.status(StatusCodes.BAD_REQUEST).json({ message: "no order found" })
        const totalQuantity = update.orderItems.reduce((acc, item) => acc += item.quantity, 0)
        const deductAmountCouponEvenly = update.discount / totalQuantity
        const shippingCharge = update.shippingCost / update.orderItems.length
        const returnedVariant = update.orderItems.find((item) => item.variant._id == variantId)
        returnedVariant.variant.returnOrder = 'Accepted'
        update.save()
        const { productId, variant, quantity } = returnedVariant
        if (!returnedVariant) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "No matching item found for return" });
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
        console.log('this is returnedVariant', returnedVariant)
        // console.log('this is the selected product',selectedProduct)
        if (!selectedProduct) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Failed to update variant stock" });
        }

        await Product.findByIdAndUpdate(productId, { $inc: { salesCount: -quantity } })

        const product = await Product.findById(productId, 'categoryId brand');

        await Category.findByIdAndUpdate(product.categoryId, { $inc: { salesCount: -quantity } });

        await Brand.findByIdAndUpdate(product.brand, { $inc: { salesCount: -quantity } });

        const userId = update.userId

        const wallet = await Wallet.findOne({ userId })

        if (!wallet) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no wallet found' })



        const transaction = {
            type: 'Refund',
            transaction_id: uuidv4(), // Generate a unique transaction ID 
            amount: returnedVariant.price * returnedVariant.quantity - (shippingCharge + deductAmountCouponEvenly),
            description: 'Product Returned amount',
            date: new Date(), // Add a timestamp for the transaction
        };
        wallet.transactions.push(transaction)
        wallet.balance += update.finalAmount - (update.shippingCost)
        await wallet.save()

        return res.status(StatusCodes.OK).json({ message: "order Updated", update, selectedProduct })
    } catch (error) {
        console.log('error while confirming the return order', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while accepting return order", error })
    }
}

const trendingItems = async (req, res) => {
    try {
        const topTenProduct = await Product.find({}).sort({ salesCount: -1 }).limit(10)
        const topTenCategory = await Category.find({}).sort({ salesCount: -1 }).limit(10)
        const topTenBrand = await Brand.find({}).sort({ salesCount: -1 }).limit(10)

        if (topTenProduct && topTenCategory && topTenBrand) {
            return res.status(StatusCodes.OK).json({ message: 'trending data fetched', topTenProduct, topTenCategory, topTenBrand })
        }
    } catch (error) {
        console.log('error while fetching the trending data', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while fetching the trending data" })
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
    confirmReturnProduct,
    trendingItems,
    showDetailOfOneOrder
}