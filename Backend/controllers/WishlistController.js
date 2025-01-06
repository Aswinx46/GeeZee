const Wishlist=require('../models/wishlistSchema')
const Product=require('../models/productSchema')


const addProductWishlist=async (req,res) => {
    try {
        const{userId}=req.params
        const{product}=req.body
        
        const existingWishlist=await Wishlist.findOne({userId})
        if(!existingWishlist)
        {
            const newWishlilst=new Wishlist({
                userId,
                product:[{
                    productId:product._id,
                    variantId:product.variants[0]
                }]  
            })
            await newWishlilst.save()
        }else{
            const existingProduct=existingWishlist.product.find((prod)=>prod.productId == product._id)
            if(existingProduct) return res.status(400).json({message:"already this product is in the wishlist"})
            const newProduct={
                productId:product._id,
                variantId:product.variants[0]
            }
            existingWishlist.product.push(newProduct)
            await existingWishlist.save()
        }
        return res.status(200).json({message:'Product added to wishlist'})
    } catch (error) {
        console.log('error while adding product in wishlist',error)
        return res.status(500).json({message:'error while adding product in wishlist',error})
    }
}

    const showWishlist=async (req,res) => {
        try {
            const {userId}=req.params
            const wishilst=await Wishlist.findOne({userId}).populate('product.productId')

            if(!wishilst) return res.status(400).json({message:"no wishlist found"})
        
    
            return res.status(200).json({message:'wishlist fetched',wishilst})
        } catch (error) {
            console.log('error while fetching the wishlist details',error)
            return res.status(500).json({message:"error while fetching wishlist data"})
        }
    }

    const removeItemFromWishlist=async (req,res) => {
        
        try {
            const{userId}=req.params
            const{item}=req.body
      
            const wishilst=await Wishlist.findOne({userId})
            if(!wishilst) return res.status(400).json({message:"no wishlist found"})
                const updatedWishlist=wishilst.product.filter((prod)=>prod.productId.toString() !== item.productId._id.toString())
    

                wishilst.product=updatedWishlist
                await wishilst.save()
                return res.status(200).json({message:'item removed from wishlist'})
        } catch (error) {
            console.log('error while removing item from wishlist',error);
            return res.status(500).json({message:"error while removing item from wishlist",error})
            
        }

    }


module.exports={
    addProductWishlist,
    showWishlist,
    removeItemFromWishlist
}