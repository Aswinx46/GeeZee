const Coupon=require('../models/CouponSchema')


const createCoupon=async (req,res) => {
    try {
        const formData=req.body.formData
        console.log('this is the formdata',formData)
        const existingCoupon=await Coupon.findOne({name:formData.couponCode})
        console.log(existingCoupon)
        if(existingCoupon) return res.status(400).json({message:'This coupon is already exist'})
            const newCoupon=new Coupon({
                name:formData.couponCode,
                CouponType:formData.couponType,
                description:formData.description,
                offerPrice:formData.discountValue,
                minimumPrice:formData.minimumPrice,
                expireOn:formData.expireDate
            })
            await newCoupon.save()
            if(!newCoupon) return res.status(500).json({message:"error while creating coupon",error})
                return res.status(201).json({message:"Coupon created successfully",newCoupon})
            
    } catch (error) {
        console.log('error while creating coupon',error)
        return res.status(500).json({message:"error while creating coupon",error})
    }

}

const showCoupon=async (req,res) => {
    try {
        const allCoupon=await Coupon.find()
        if(!allCoupon) return res.status(200).json({message:'no coupon available'})
            return res.status(200).json({message:"coupons fetched",allCoupon})
    } catch (error) {
        console.log('error while fetching coupon details',error)
        return res.status(500).json({message:"error while fetching coupon details",error})
    }
}

const changeStatusOfCoupon=async (req,res) => {
    try {
        const{couponId}=req.params
        console.log('this is the coupon id',couponId)
        const coupon=await Coupon.findByIdAndUpdate(couponId, [{ $set: { isList: { $not: "$isList" } } }],{new:true})
        return res.status(200).json({message:"Coupon status changed successFully"})
    } catch (error) {
        console.log('error while changing the status of coupon',error)
        return res.status(500).json({message:'error while changing the status of coupon',error})
    }

}

const showCouponInUserSide=async (req,res) => {
    try {
        const currentDate=new Date()
        const allCoupons=await Coupon.find({isList:true,expireOn:{$gt:currentDate}})
        console.log(allCoupons)
        if(!allCoupons)return res.status(400).json({message:"no Coupon available"})
            return res.status(200).json({message:"coupon fetched",allCoupons})
    } catch (error) {
        console.log('error while fetching coupon in user side',error)
        return res.status(500).json({message:"error while fetching coupon in user side",error})
    }
}
module.exports={
    createCoupon,
    showCoupon,
    changeStatusOfCoupon,
    showCouponInUserSide
}