const User=require('../models/userSchema')
const Wallet=require('../models/WalletSchema')

const getWalletDetails=async(req,res)=>{
    try {
        const{userId}=req.params
        const wallet=await Wallet.findOne({userId})
        if(!wallet)return res.status(400).json({message:"no Wallet found"})
            
            return res.status(200).json({message:'Wallet Created',wallet})
    } catch (error) {
        console.log('error while fetching wallet details',error)
        return res.status(500).json({message:'error while fetching wallet details',error})
    }

}

module.exports={
    getWalletDetails
}