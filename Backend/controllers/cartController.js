const User = require('../models/userSchema')
const Product = require('../models/productSchema')
const Cart = require('../models/CartSchema')
const addToCart = async (req, res) => {
    const { userId, productId, selectedVariantId, quantity } = req.body

    try {
        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ message: "no user found" })
        const product = await Product.findById(productId)
        if (!product) return res.status(400).json({ message: 'no product found' })
        const Varient = product.variants.find((item) => item._id.toString() === selectedVariantId)
        const price = Varient.price
        const cart = await Cart.findOne({ userId })
        const totalPrice = quantity * price
        if (quantity > Varient.stock) return res.status(400).json({ message: "your quantity is greater than the stock" })
        if (!cart) {
            const newCart = new Cart({
                userId,
                items: [{
                    productId,
                    quantity,

                    varientId: selectedVariantId
                }]
            })
            await newCart.save()
            return res.status(201).json({ message: "item added to cart", newCart })
        } else {
            const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId.toString() && item.varientId == selectedVariantId)
            const existingVariantItem = cart.items.find((item) => item.varientId == selectedVariantId)
            const price = Varient.price
            const totalPrice = quantity * price

            if (existingItemIndex !== -1) {
                cart.items[existingItemIndex].quantity = quantity
                cart.items[existingItemIndex].totalPrice = totalPrice
                await cart.save()
                return res.status(200).json({ message: "Cart updated successfully", cart });
            } else {
                cart.items.push({
                    productId,
                    quantity,

                    varientId: selectedVariantId
                })
                await cart.save();
                return res.status(200).json({ message: "item added to cart", cart });
            }

        }
    } catch (error) {
        console.log('error while creating the cart', error)
        return res.status(500).json({ message: "error while creating cart" })
    }
}

const showCartItems = async (req, res) => {
    const { id } = req.params
    try {

        const cartItems = await Cart.findOne({ userId: id })
            .populate({
                path: 'items.productId',
                select: '_id title description variants productImg status categoryId productOffer',
                populate: [
                    {
                        path: 'categoryId',
                        select: '_id categoryName status categoryOffer',
                        populate: {
                            path: 'categoryOffer',
                            match: {
                                validUntil: { $gte: new Date() },
                                isListed: true
                            }
                        }
                    },
                    {
                        path: 'productOffer',
                        match: {
                            validUntil: { $gte: new Date() },
                            isListed: true
                        }
                    },
                    {
                        path: 'brand',
                        match: {
                            status: 'active'
                        }
                    }
                ]
            });

        if (!cartItems) {
            return res.status(404).json({ message: 'No items found in the cart' });
        }
        // Transforming the data
        const result = cartItems.items.map((item) => {
            const product = item.productId;

            // Find the specific variant matching the varientId
            const selectedVariant = product.variants.find(
                (variant) => variant._id.toString() === item.varientId
            );
            return {
                title: product.title,
                description: product.description,
                variants: selectedVariant ? [selectedVariant] : [],
                productImg: product.productImg,
                quantity: item.quantity,
                id: product._id,
                cartId: cartItems._id,
                productStatus: product.status,
                brandStatus: product.brand.status,
                categoryStatus: product.categoryId.status,
                categoryId: product.categoryId._id,
                brandId: product.brand._id,
                productOffer: product.productOffer,
                categoryOffer: product.categoryId.categoryOffer
                // quantity:selectedVariant.quantity // Include the matching variant or an empty array
            };
        });


        return res.status(200).json({ message: "cart items fetched", result })
    } catch (error) {
        console.log('error while fetching the cart items', error)
        return res.status(500).json({ message: "error in fetching the cart details" })
    }
}

const changeQuantity = async (req, res) => {
    const { itemId, cartId, productId } = req.params

    const { count } = req.body
    try {
        const cart = await Cart.findById(cartId)
        if (!cart) return res.status(400).json({ message: "cart is not created yet" })
        const product = await Product.findById(productId)
        const varienInCart = cart.items.find((item) => item.varientId == itemId)
        const varientToBeEdited = product.variants.find((item) => item._id == itemId)


        const newQuantity = varienInCart.quantity + count
        if (newQuantity >= 1 && newQuantity <= 5 && newQuantity <= varientToBeEdited.stock) {
            varienInCart.quantity += count
            await cart.save();
            return res.status(200).json({ message: "count updated", cart })
        }
        return res.status(400).json({ message: 'no stock available' })
    } catch (error) {
        console.log('error while updating the quantity', error)
        return res.status(500).json({ message: "error while updating the quantity" })
    }
}

const deleteItem = async (req, res) => {
    const { varientId, cartId } = req.params
    try {
        const cart = await Cart.findOneAndUpdate(
            { '_id': cartId },
            { $pull: { items: { varientId } } },
            { new: true })

    } catch (error) {
        console.log('error while deleting item from the cart', error)
        return res.status(500).json({ message: "error while deleting item from cart" })
    }
}

module.exports = {
    addToCart,
    showCartItems,
    changeQuantity,
    deleteItem
}