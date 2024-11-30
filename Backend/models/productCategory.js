const mongoose=require('mongoose')
const {Schema}=mongoose

const ProductSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    sku:{
        type:String,
        required:true
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
        type:Array,
        required:true
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:'category'
    },
    cart:{
        type:Schema.Types.ObjectId,
        ref:"cart"
    }
})

const product=mongoose.model('product',ProductSchema)
module.exports=product