const mongoose=require('mongoose')
const {Schema}=mongoose

const CouponSchema=new mongoose({
    name:{
        type:String,
        required:true,
        unique:true
    },
    createdOn:{
        type:Date,
        default:Date.now,
        required:true
    },
    expireOn:{
        type:Date,
        required:true
    },
    offerPrice:{
        type:Number,
        required:true
    },
    minimumPrice:{
        type:Number,
        required:true
    },
    isList:{
        type:Boolean,
        default:true
    },
    userId:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }]
})

const Coupon=mongoose.model('coupon',CouponSchema)
module.exports=Coupon