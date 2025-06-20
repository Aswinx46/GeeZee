const Offer = require('../models/OfferSchema')
const Product = require('../models/productSchema')
const Category = require('../models/categorySchema')
const category = require('../models/categorySchema')
const StatusCodes = require('../enums/httpStatusCode')



const addOffer = async (req, res) => {
    try {
        const { offerType, offerValue, startDate, endDate } = req.body
        const { productId } = req.params


        const existingProductOffer = await Product.findById(productId, 'productOffer')
        if (!existingProductOffer.productOffer) {
            const newOffer = new Offer({
                offerType: offerType,
                offerValue,
                validFrom: startDate,
                validUntil: endDate
            })
            await newOffer.save()
            existingProductOffer.productOffer = newOffer._id
            existingProductOffer.save()

            return res.status(StatusCodes.OK).json({ message: "offer added" })
        } else {
            const existingOffer = await Offer.findById(existingProductOffer.productOffer._id)
            if (!existingOffer) return res.status(400).json({ message: 'no offer found' })
            existingOffer.offerType = offerType
            existingOffer.offerValue = offerValue
            existingOffer.validFrom = startDate
            existingOffer.validUntil = endDate
            await existingOffer.save()
            return res.status(StatusCodes.OK).json({ message: "offer updated" })
        }

    } catch (error) {
        console.log('error while adding offer', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while adding offer", error })
    }
}

const changeStatusOfOffer = async (req, res) => {
    try {
        const { offerId } = req.params
        const changeStatusOffer = await Offer.findByIdAndUpdate(offerId, [{ $set: { isListed: { $not: "$isListed" } } }], { new: true })
        return res.status(StatusCodes.OK).json({ message: "Offer status changed successFully" })
    } catch (error) {
        console.log('error while changing the status of the error', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while changing the status of the error", error })
    }
}

const addCategoryOffer = async (req, res) => {
    try {
        const { categoryId } = req.params
        const { offerType, offerValue, startDate, endDate } = req.body

        const category = await Category.findById(categoryId)
        if (!category.categoryOffer) {
            const newOffer = new Offer({
                offerType: offerType,
                offerValue,
                validFrom: startDate,
                validUntil: endDate
            })
            await newOffer.save()
            category.categoryOffer = newOffer._id
            await category.save()
            return res.status(StatusCodes.OK).json({ message: "offer added" })
        } else {
            const existingOffer = await Offer.findById(category.categoryOffer._id)
            if (!existingOffer) return res.status(400).json({ message: 'no offer found' })
            existingOffer.offerType = offerType
            existingOffer.offerValue = offerValue
            existingOffer.validFrom = startDate
            existingOffer.validUntil = endDate
            await existingOffer.save()
            return res.status(StatusCodes.OK).json({ message: "offer updated" })
        }


    } catch (error) {
        console.log('error while creating the category offer', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'error while creating category error', error })
    }
}

const changeStatusOfCategoryOffer = async (req, res) => {
    try {
        const { offerId } = req.params
        const cateory = await Offer.findByIdAndUpdate(offerId, [{ $set: { isListed: { $not: "$isListed" } } }], { new: true })
        return res.status(StatusCodes.OK).json({ message: "Offer status changed" })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while changing the status of the category" })
    }
}

module.exports = {
    addOffer,
    changeStatusOfOffer,
    addCategoryOffer,
    changeStatusOfCategoryOffer
}