const Offer = require('../models/OfferSchema')
const Product = require('../models/productSchema')

const addOffer = async (req, res) => {
    try {
        const { offerType, offerValue, startDate, endDate } = req.body
        const { productId } = req.params
        console.log('this isthe product id ', productId)
        console.log(offerType)
        console.log(offerValue);
        console.log(startDate);
        console.log(endDate);

        const existingProductOffer = await Product.findById(productId, 'productOffer')
        console.log('sdnfkjdnlg', existingProductOffer)
        if (!existingProductOffer.productOffer) {
            const newOffer = new Offer({
                offerType: offerType,
                offerValue,
                validFrom: startDate,
                validUntil: endDate
            })
            await newOffer.save()
            console.log(newOffer)
            existingProductOffer.productOffer = newOffer._id
            existingProductOffer.save()
            return res.status(200).json({ message: "offer added" })
        } else {
            const existingOffer = await Offer.findById(existingProductOffer.productOffer._id)
            if (!existingOffer) return res.status(400).json({ message: 'no offer found' })
            existingOffer.offerType = offerType
            existingOffer.offerValue=offerValue
            existingOffer.validFrom=startDate
            existingOffer.validUntil=endDate
            await existingOffer.save()
            return res.status(200).json({ message: "offer updated" })
        }

    } catch (error) {
        console.log('error while adding offer', error)
        return res.status(500).json({ message: "error while adding offer", error })
    }
}

const changeStatusOfOffer=async (req,res) => {
    try {
        const {offerId}=req.params
        const changeStatusOffer=await Offer.findByIdAndUpdate(offerId,[{ $set: { isListed: { $not: "$isListed" } } }],{new:true})
        return res.status(200).json({message:"Offer status changed successFully"})
    } catch (error) {
        console.log('error while changing the status of the error',error)
        return res.status(500).json({message:"error while changing the status of the error",error})
    }
}

const addCategoryOffer=async (req,res) => {
    try {
        
    } catch (error) {
        console.log('error while creating the category offer',error)
        return res.status(500).json({message:'error while creating category error',error})
    }
}

module.exports = {
    addOffer,
    changeStatusOfOffer,
    addCategoryOffer
}