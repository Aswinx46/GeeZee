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
    productOffer:{
        type:Schema.Types.ObjectId,
        ref:'offer',
        default:null
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
    stock:{
        type:String,
        enum:['In Stock','Out of Stock']
    },
    variants: [
        {
          price: { type: Number, required: true },
          stock: { type: Number, required: true },
          selectedAttributes: { type: Object, required: true },
        },
      ],
    subHead:{
        type:[String],
        required:true
    },
    subHeadDescription:{
        type:[String],
        required:true
    },spec:{
        type:[String],
        required:true
    },
    brand:{
        type:Schema.Types.ObjectId,
        ref:'Brand'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    salesCount:{
        type:Number,
        default:0
    }
})

const product=mongoose.model('product',ProductSchema)
module.exports=product