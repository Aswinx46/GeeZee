const Address=require('../models/AddressSchema')
const User=require('../models/userSchema')

const addAddress=async (req,res) => {
    const {street,city,country,pinCode,state,phone}=req.body.shippingAddress
    const userId=req.body.userId
    // console.log(street,city,country,pinCode,state,phone)
    console.log(userId)
    try {
        const address=new Address({
            userId,
            street,
            city,
            country,
            pinCode,
            state,
            phone
        })
        await address.save()
        return res.status(201).json({message:"address created",address})
    } catch (error) {
        console.log('error while creating the address',error)
        return res.status(500).json({message:"error while creating address"})
    }
}

const showAddress=async (req,res) => {
    const {userId}=req.params
    console.log('this is the userid',userId)
    
    try {
        const address=await Address.find({userId})
        if(!address) return res.status(400).json({message:'no address found'})
            console.log('this is the address',address)
            return res.status(200).json({message:"address fetched",address})

    } catch (error) {
        console.log('error while fetching the address',error)
        return res.status(500).json({message:"error while fetching address"})
    }
}

const deleteAddress=async (req,res) => {
    const {addressId}=req.params
    // console.log(addressId)
    try {
        const deletedAddress=await Address.findByIdAndDelete(addressId)
            return res.status(200).json({message:"address deleted"})
    
    } catch (error) {
        console.log('error while deleting address',error)
        return res.status(500).json({message:"error while deleting the address"})
    }
}

const setDefaultAddress=async (req,res) => {
    const{addressId,userId}=req.params
    console.log('this is the id of the default address',addressId)
    console.log('this is the id of the user ',userId)
    try {
        const address=await Address.findOne({userId,defaultAddress:true})
        console.log(address)
        if(!address)
        {
            const defaultAddressSetting=await Address.findByIdAndUpdate(addressId,{defaultAddress:true},{new:true})
            console.log(defaultAddressSetting)
            
        }
        if(address)
        {   console.log('this is')
            address.defaultAddress=false
            await address.save()
            const defaultAddressSetting=await Address.findByIdAndUpdate(addressId,{defaultAddress:true},{new:true})
            console.log(defaultAddressSetting)
        }
        return res.status(200).json({message:"Default address changed"})
    } catch (error) {
        console.log('error while changing status address',error)
        return res.status(500).json({message:"error while changing the Default Address"})
    }
}

const editAddress=async (req,res) => {
    const {editAddress}=req.body
    // const{addressId}=req.params
    console.log('this is the address is',editAddress)
    // console.log('this is teh address id',addressId)
    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            editAddress._id,     
            { $set: editAddress },
            { new: true }        
          )
        return res.status(200).json({message:"Address Edited"})

    } catch (error) {
        console.log('error while updating the address',error)
        return res.status(500).json({message:"error while updating address"})
    }
}

module.exports={
    addAddress,
    showAddress,
    deleteAddress,
    setDefaultAddress,
    editAddress
}