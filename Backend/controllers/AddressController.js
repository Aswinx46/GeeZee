const Address = require('../models/AddressSchema')
const User = require('../models/userSchema')
const statusCode = require('../enums/httpStatusCode')
const addAddress = async (req, res) => {
    const { street, city, country, pinCode, state, phone } = req.body.shippingAddress
    const userId = req.body.userId

    try {
        const address = new Address({
            userId,
            street,
            city,
            country,
            pinCode,
            state,
            phone
        })
        await address.save()
        return res.status(statusCode.OK).json({ message: "address created", address })
    } catch (error) {
        console.log('error while creating the address', error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "error while creating address" })
    }
}

const showAddress = async (req, res) => {
    const { userId } = req.params

    try {
        const address = await Address.find({ userId })
        if (!address) return res.status(400).json({ message: 'no address found' })
        return res.status(statusCode.OK).json({ message: "address fetched", address })

    } catch (error) {
        console.log('error while fetching the address', error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "error while fetching address" })
    }
}

const deleteAddress = async (req, res) => {
    const { addressId } = req.params
    try {
        const deletedAddress = await Address.findByIdAndDelete(addressId)
        return res.status(statusCode.OK).json({ message: "address deleted" })

    } catch (error) {
        console.log('error while deleting address', error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "error while deleting the address" })
    }
}

const setDefaultAddress = async (req, res) => {
    const { addressId, userId } = req.params

    try {
        const address = await Address.findOne({ userId, defaultAddress: true })
        if (!address) {
            const defaultAddressSetting = await Address.findByIdAndUpdate(addressId, { defaultAddress: true }, { new: true })

        }
        if (address) {
            address.defaultAddress = false
            await address.save()
            const defaultAddressSetting = await Address.findByIdAndUpdate(addressId, { defaultAddress: true }, { new: true })
        }
        return res.status(statusCode.OK).json({ message: "Default address changed" })
    } catch (error) {
        console.log('error while changing status address', error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "error while changing the Default Address" })
    }
}

const editAddress = async (req, res) => {
    const { editAddress } = req.body

    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            editAddress._id,
            { $set: editAddress },
            { new: true }
        )
        return res.status(statusCode.OK).json({ message: "Address Edited" })

    } catch (error) {
        console.log('error while updating the address', error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "error while updating address" })
    }
}

module.exports = {
    addAddress,
    showAddress,
    deleteAddress,
    setDefaultAddress,
    editAddress
}