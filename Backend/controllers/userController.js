const User=require('../models/userSchema')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const mongoose = require('mongoose')
require('dotenv').config()

function genarateOtp()      
{       
    return Math.floor(100000+Math.random()*900000).toString()
}       

async function sendVerificationMail(email,otp) {        
    try {       
        const transporter=nodemailer.createTransport({      
            service:'gmail',        
            port:587,       
            secure:false,       
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD,
            }
        })

        const info=await transporter.sendMail({
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:'verify your email',
            text:`your OTP is ${otp}`,
            html:`<b> your OTP ${otp} </b>`
        })
        return info.accepted.length>0
    } catch (error) {
        console.log('error sending email',error)
        return false
    }
}

const signup=async(req,res)=>{
   const{firstname,lastname,email,phoneNumber,password}=req.body
   req.session.user={firstname,lastname,email,phoneNumber,password}
   req.session.email=email
    console.log(req.session.user)
         try {
         const exisitingUSer= await User.findOne({email})
         if(exisitingUSer)
         {
            return res.status(400).json({message:"the user is already exist"})
         }
     
        const ogOtp=genarateOtp()
         const emailSent=await sendVerificationMail(email,ogOtp)
         req.session.otp=ogOtp
         
        console.log(emailSent)         
      
         if(!emailSent)
         {
            return res.json({"message":"invalid-email"})
         }else{
           return res.status(200).json({message:"otp sent"})
         }

         } catch (error) {
            console.log('error in sending the email ',error)
            res.status(500).json({message:"internal server error",error})
         }

}

    const securePassword=async(password)=>{
        try {
            const sPassword=await bcrypt.hash(password,10)
            return sPassword
        } catch (error) {
            console.log(error)
        }
    }

const otpVerification=async(req,res)=>{
    const {otp}=req.body
    
    // console.log(req.session)
    const{firstname,lastname,email,phoneNumber,password}=req.session.user
    const sPassword=await securePassword(password)
    
    try {
        if (!req.session.otp || req.session.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });}
        if(otp==req.session.otp)
        {
            const user=new User({
               firstName:firstname,
               lastName:lastname,
               email,
               password:sPassword,
               phoneNo:phoneNumber,
               status:'active',
               isAdmin:0
            })
            await user.save()
            console.log(user)
            return res.json({message:"user created"})
        }else{
           return res.json({message:"invalid otp "})
        }
   
    } catch (error) {
        console.log(error)
    }
}

const resendOtp=async(req,res)=>{
    const email=req.session.email
  
    try {
        const ogOtp=await genarateOtp()
        const emailVerification= await sendVerificationMail(email,ogOtp)
        if(emailVerification)
        {
            req.session.otp=ogOtp
                
        console.log(req.session.otp)
        res.status(200).json({message:"the resend otp done"})
        }else{
            res.status(400).json({message:"invalid mail in resend otp"})
        }
 
    } catch (error) {
        console.log('error in the resendOtp',error)
        res.status(500).json({message:"error in resending the otp"})
    }
  
}

const googleSave = async(req,res)=>{
    const {email,email_verified,firstName,lastName,id}=req.body
    try {
        const exisitingUSer=await User.findOne({email})
        if(exisitingUSer)
        {
            return res.status(400).json({message:"the email is already exist"})
        }
        const newUser=new User({
            firstName,
            lastName,
            email,
            status:'active',
            googleId:id,
            isAdmin:0,
            GoogleVerified:email_verified

        })
        await newUser.save()
        return res.status(201).json({message:"the user created"})
    } catch (error) {
        console.log('google user is not saved',error)
    }
}

const login =async(req,res)=>{
    const{email,password}=req.body
    console.log(email,password)

    try {
        console.log(mongoose.connection.readyState)
        const user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"the user not found"})
        }else{
            if(user.googleId)
            {
                const token= await jwt.sign({email:email},process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn:'1h'})
                const refreshToken=await jwt.sign({email:email},process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn:'7d'})
                return res.status(200).json({message:"the user logged",user,token,refreshToken})
                
            }else{
                const isPasswordValid=await bcrypt.compare(password,user.password)
                if(!isPasswordValid)return res.status(400).json({message:"invalid password"})
                    const token= await jwt.sign({email:email},process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn:'1h'})
                    const refreshToken=await jwt.sign({email:email},process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn:'7d'})
                    return res.status(200).json({message:"the user logged",user,token,refreshToken})
            }
        }

    } catch (error) {
        console.log('login failed',error.message)
        return res.status(500).json({message:"login failed"})
    }
}

module.exports={
    signup,
    otpVerification,
    resendOtp,
    googleSave,
    login

}