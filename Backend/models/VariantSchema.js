const mongoose=require('mongoose')
const {Schema}=mongoose

const variantSchema= new mongoose.Schema({
    productId:{
        type:Schema.Types.ObjectId,
        ref:'product',
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    attributes:{
        type: Map,
        of: String, // Dynamic key-value pairs like RAM: "8GB", Storage: "256GB"
        required: true
    },
    stock:{
        type:Number,
        required:true
    },
    spec:{
        type:[String],
        required:true
    }
})

const variant=new mongoose.model('Variant',variantSchema)
module.exports=variant