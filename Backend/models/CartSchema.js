const mongoose=require('mongoose')
const {Schema} =mongoose
const cartSchema=new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})