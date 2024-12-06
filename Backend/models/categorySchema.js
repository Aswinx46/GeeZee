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
    }]
})


const category=mongoose.model('category',categorySchema)
module.exports=category;