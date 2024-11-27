const User=require('../models/userSchema')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const mongoose = require('mongoose')
const login=async(req,res)=>{
    const {email,password}=req.body
    console.log(email,password)
    try {
        console.log(mongoose.connection.readyState)
        const user=await User.findOne({email:email , isAdmin:1})
        console.log(user)
        if(!user) return res.status(400).json({message:"No admin found"})
         if(user.isAdmin==1)
            {
                const passwordVerify= await bcrypt.compare(password,user.password)
                console.log(passwordVerify)
                if(!passwordVerify) return res.status(400).json({message:"invalid password"})
                    return res.status(200).json({message:'admin logged'})
            }   
    } catch (error) {
        console.log('admin login failed',error)
    }
}

module.exports={
    login,
}