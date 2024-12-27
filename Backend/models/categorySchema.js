const mongoose=require('mongoose')
const {Schema}=mongoose
const categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'active',
        enum:['active','inactive']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    products:[{
        type:Schema.Types.ObjectId,
        ref:"product"
    }],
    categoryOffer:{
        type:Schema.Types.ObjectId,
        ref:"offer",
        default:null
    }
})


const category=mongoose.model('category',categorySchema)
module.exports=category;