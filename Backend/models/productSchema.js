const mongoose=require('mongoose')
const {Schema}=mongoose

const ProductSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    sku:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    availableQuantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    productImg:{
        type:[String],
        required:true
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    cart:{
        type:Schema.Types.ObjectId,
        ref:"cart"
    },stock:{
        type:String,
        enum:['In Stock','Out of Stock']
    },
    spec:{
        type:[String],
        required:true
    },
    subHead:{
        type:[String],
        required:true
    },
    subHeadDescription:{
        type:[String],
        required:true
    }
})

const product=mongoose.model('product',ProductSchema)
module.exports=product