const User = require('../models/userSchema')
const Product = require('../models/productSchema')
const Cart = require('../models/CartSchema')
const addToCart = async (req, res) => {
    const { userId, productId, selectedVariantId, quantity } = req.body
    console.log('this is the userId', userId)
    console.log('this is the product id', productId)
    console.log('this is the selectedVariantId', selectedVariantId)
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ message: "no user found" })
        const product = await Product.findById(productId)
        if (!product) return res.status(400).json({ message: 'no product found' })
        const Varient = product.variants.find((item) => item._id.toString() === selectedVariantId)
        console.log('this is varient', Varient)
        const price = Varient.price
        console.log(price)
        const cart = await Cart.findOne({ userId })
        const totalPrice = quantity * price
        console.log('this is the total price', totalPrice)
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
            console.log(cart.items)
            const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId.toString() && item.varientId == selectedVariantId)
            const existingVariantItem = cart.items.find((item) => item.varientId == selectedVariantId)
            console.log(existingItemIndex)
            const price = Varient.price
            const totalPrice = quantity * price
            console.log('this is the quantity', quantity)

            if (existingItemIndex !== -1) {
                console.log('this is inside the if condition')
                console.log('exisiting quantity', cart.items[existingItemIndex].quantity)
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
    console.log('this is the user id from the cart', id)
    try {

 
        console.log('ajsdhfakjs')
 
        const cartItems = await Cart.findOne({ userId: id })
            .populate('items.productId', ' _id title description variants productImg') // Populate specific fields

        if (!cartItems) {
            return res.status(404).json({ message: 'No items found in the cart' });
        }
        console.log('this is the cart items',cartItems)
        // Transforming the data
        const result = cartItems.items.map((item) => {
            const product = item.productId;

            // Find the specific variant matching the varientId
            const selectedVariant = product.variants.find(
                (variant) => variant._id.toString() === item.varientId
            );
            console.log('this is the item',item)
            return {
                title: product.title,
                description: product.description,
                variants: selectedVariant ? [selectedVariant] : [],
                productImg:product.productImg,
                quantity:item.quantity,
                id:product._id,
                cartId: cartItems._id
           
                // quantity:selectedVariant.quantity // Include the matching variant or an empty array
            };
        });
       
      
        return res.status(200).json({ message: "cart items fetched", result })
    } catch (error) {
        console.log('error while fetching the cart items', error)
        return res.status(500).json({ message: "error in fetching the cart details" })
    }
}

const changeQuantity=async (req,res) => {
    const {itemId,cartId,productId}=req.params
    console.log( 'this is the id of the variant', itemId)
    console.log('this is the cart id',cartId)
    console.log('this is the product id',productId)
    const {count}=req.body
    console.log('this is the count',count)
    try {
        const cart=await Cart.findById(cartId)
        if(!cart) return res.status(400).json({message:"cart is not created yet"})
            // console.log('this is the list of cart',cart)
        const product=await Product.findById(productId)
        console.log('this is the product',product)
        const varienInCart=cart.items.find((item)=>item.varientId == itemId)
        const varientToBeEdited=product.variants.find((item)=>item._id == itemId)
        console.log('this is the varient which is to be edited',varientToBeEdited)
        console.log('varient in the cart',varienInCart)
        // if(varienInCart.quantity>varientToBeEdited.stock)
        // {
        //     return res.status(400).json({message:'no stock available'})
        // }
        varienInCart.quantity+=count
        await cart.save();
        return res.status(200).json({message:"count updated",cart})
        
    } catch (error) {
        console.log('error while updating the quantity',error)
        return res.status(500).json({message:"error while updating the quantity"})
    }
}

module.exports = {
    addToCart,
    showCartItems,
    changeQuantity
}