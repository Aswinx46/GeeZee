const mongoose=require('mongoose')
const {Schema} =mongoose
const cartSchema=new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    items:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:'product'
        },
        quantity:{
            type:Number,
            default:1,
            
        },
        price:{
            type:Number,
            required:true
        },
        totalPrice:{
            type:Number,
            required:false
        },
        orderStatus:{
            type:String,
            enum:'placed',
            default:'placed'
        },
        CancellationReason:{
            type:String,
            default:'none',
            required:false
        },
        varientId:{
            type:String,
            required:true
        }
    }]

})

const cart=mongoose.model('cart',cartSchema)
module.exports=cart