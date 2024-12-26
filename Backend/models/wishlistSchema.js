const mongoose=require('mongoose')
const {Schema}=mongoose

const wishlistSchema=new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    product:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:'product'
        },
        variantId:{
            type:Schema.Types.ObjectId,
            required:true
        }
    }],
    createdOn:{
        type:Date,
        default:Date.now
    }
})

const Wishlist=mongoose.model('wishlist',wishlistSchema)
module.exports=Wishlist