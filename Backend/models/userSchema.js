const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false,
        unique:true
    },
    joinDate:{
        type:Date,
        default: Date.now
    },
    phoneNo:{
        type:String,
        required:false
    },
    status:{
        type:String,
        enum:['active','inactive','blocked'],
        default:'active'
    },
    googleId:{
        type:String,
        default:null
    },
    isAdmin: { 
        type: Number, 
        default: 0, 
        enum: [0, 1] 
    },
    GoogleVerified:{
        type:Boolean,
        default:false,
        required:false
    }
})

module.exports=mongoose.model('user',userSchema)