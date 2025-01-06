const jwt=require('jsonwebtoken')
const User=require('../models/userSchema')
const authToken=async(req,res,next)=>{
    const authHeader=req.headers['authorization']
    const userId=req.headers['user_id']
    const token=authHeader && authHeader.split(' ')[1]
    if(!token) return res.status(401).json({message:"no token available"})
        try {
            const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY)
            req.userId=decoded.userId;
            if(userId)
            {
                const user=await User.findById(userId)
                if(!user) return res.status(400).json({message:"no user found"})
                    if(user.status == 'inactive') return res.status(423).json({message:'User is Blocked By Admin'})
            }
            next();
        } catch (error) {
            console.log('token validation failed',error.message)
        }
}

module.exports={
    authToken
}