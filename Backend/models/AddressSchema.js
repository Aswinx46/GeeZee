const mongoose =require('mongoose')
const{Schema}=mongoose

const addresSchema=new mongoose.Schema({
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        street:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pinCode:{
            type:Number,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        defaultAddress:{
            type:Boolean,
            default:false
        }
})

const address=mongoose.model('address',addresSchema)
module.exports=address