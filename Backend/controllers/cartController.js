const User=require('../models/userSchema')
const Product=require('../models/productSchema')
const Cart=require('../models/CartSchema')
const addToCart=async (req,res) => {
    const {userId,productId,selectedVariantId,quantity}=req.body
    console.log('this is the userId',userId)
    console.log('this is the product id',productId)
    console.log('this is the selectedVariantId',selectedVariantId)
    try {
        const user=await User.findById(userId)
        if(!user) return res.status(400).json({message:"no user found"})
            const product=await Product.findById(productId)
        if(!product)return res.status(400).json({message:'no product found'})
            const Varient=product.variants.find((item)=>item._id.toString()===selectedVariantId)
            const price=Varient.price
            console.log(price)
            const cart=await Cart.findOne({userId})
            const totalPrice=quantity * price
            if(!cart)
            {
                const newCart=new Cart({
                    userId,
                    items:[{
                        productId,
                        quantity,
                        price,
                        totalPrice,
                        varientId:selectedVariantId
                    }]
                })
                await newCart.save()
                return res.status(201).json({message:"cart created and added item",newCart})
            }else{
                console.log(cart.items)
                const existingItemIndex=cart.items.findIndex((item)=>item.productId.toString()=== productId && item.varientId == selectedVariantId )
                console.log(existingItemIndex)
                if(existingItemIndex !== -1)
                {
                    cart.items[existingItemIndex].quantity+=quantity
                    cart.items[existingItemIndex].totalPrice+= totalPrice
                }else{
                    cart.items.push({
                        productId,
                        quantity,
                        totalPrice,
                        varientId:selectedVariantId
                    })
                    await cart.save();
                 return res.status(200).json({ message: "Cart updated successfully", cart });
                }

            }
    } catch (error) {
        console.log('error while creating the cart',error)
        return res.status(500).json({message:"error while creating cart"})
    }
}


module.exports={
    addToCart
}