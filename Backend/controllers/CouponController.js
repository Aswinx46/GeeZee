const Coupon=require('../models/CouponSchema')


const createCoupon=async (req,res) => {
    try {
        
    } catch (error) {
        console.log('error while creating coupon',error)
        return res.status(500).json({message:"error while creating coupon",error})
    }

}

module.exports={
    createCoupon
}