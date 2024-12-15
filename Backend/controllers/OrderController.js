const Order=require('../models/OrderSchema')
const Product=require('../models/productSchema')
const Brand=require('../models/brandSchema')
const Category=require('../models/categorySchema')
const product = require('../models/productSchema')
const Cart=require('../models/CartSchema')
const productBlockCheckingFunction=async(productId,brandId,categoryId)=>{
    // console.log('this is the brandid',brandId)
    // console.log('this is category id',categoryId)
    // console.log('this isthe product id',productId)

    const statusOfProduct=await Product.findById(productId,{ status: 1, _id: 0 })
    const statusOfBrand=await Brand.findById(brandId,{ status: 1, _id: 0 })
    const statusOfCategory=await Category.findById(categoryId,{ status: 1, _id: 0 })
    return [statusOfProduct,statusOfBrand,statusOfCategory]
}

const createOrder=async (req,res) => {
    const{userId}=req.params
    const{mainAddress,cartItems,paymentMethod,total,shippingCharge}=req.body
    console.log(paymentMethod)
    console.log('this isthe userid',userId)
    try {
        const brandId=cartItems[0].brandId
        const categoryId=cartItems[0].categoryId
        const productId=cartItems[0].id
        
        // console.log('this is the cart item',cartItems.quantity)
      const status =await productBlockCheckingFunction(productId,brandId,categoryId)
      console.log('this is the status',status)
      const isBlock=status.some((item)=>item.status == 'inactive')
      if(isBlock) return res.status(400).json({message:"Product blocked by admin remove the product to continue"})
        console.log('this is the cart items',cartItems[0].variants)
        const order=new Order({
            userId,
            orderItems:[{
                productId:cartItems[0].id,
                quantity:cartItems[0].quantity,
                price:cartItems[0].variants[0].price
            }],
            totalPrice:total,
            discount:0,
            finalAmount:total + shippingCharge,
            address:mainAddress._id,
            paymentMethod,
            shippingCost:shippingCharge,
           
        })
        await order.save()
        const allVariants=await Product.findById(productId,'variants')
       
        const changeVariant= allVariants.variants.find((item)=>item._id == cartItems[0].variants[0]._id)
   
        changeVariant.stock-=cartItems[0].quantity
        await allVariants.save()

        await Cart.updateOne({userId},{$set:{items:[]}})

        return res.status(200).json({message:"order created"})

    } catch (error) {
        console.log('error while creating order',error)
        return res.status(500).json({message:"error while creating order"})
    }
}

module.exports={
    createOrder
}