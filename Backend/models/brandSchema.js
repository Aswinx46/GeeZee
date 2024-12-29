const mongoose=require('mongoose')
const {Schema}=mongoose

const brandSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    brandImage:{
        type:[String],
        required:true
    },
    status:{
        type:String,
        default:'active',
        enum:['active','inactive']
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

const Brand=mongoose.model('Brand',brandSchema)
module.exports=Brand
