const jwt=require('jsonwebtoken')
const authToken=async(req,res,next)=>{
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    console.log(token)
    if(!token) return res.status(401).json({message:"no token available"})
        try {
            const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY)
            req.userId=decoded.userId;
            next();
        } catch (error) {
            console.log('token validation failed',error.message)
        }
}

module.exports={
    authToken
}