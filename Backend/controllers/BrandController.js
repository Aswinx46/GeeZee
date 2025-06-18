const Product = require('../models/productSchema')
const Brand = require('../models/brandSchema')
const StatusCodes = require('../enums/httpStatusCode')

const addBrand = async (req, res) => {
    const { status, newBrand, imageUrl } = req.body
    try {
        const allBrand = await Brand.find()
        const isExist = allBrand.find((brand) => brand.name.toLowerCase() == newBrand.toLowerCase())
        // const isExist = await Brand.findOne({ name: newBrand })
        if (isExist) return res.status(400).json({ message: "the brand is already exist" })



        const brand = new Brand({
            name: newBrand,
            status,
            brandImage: imageUrl
        })
        await brand.save()
        return res.status(StatusCodes.OK).json({ message: 'brand created', brand })
    } catch (error) {
        console.log('error in creating new brand')
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR), json({ message: "error while creating new brand" })
    }
}

const showBrand = async (req, res) => {

    try {
        const brands = await Brand.find()
        if (!brands) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no brand available' })

        return res.status(StatusCodes.OK).json({ messaage: "brands fetched", brands })

    } catch (error) {
        console.log('error while fetching the brands list', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR), json({ message: "error while fetching the brand list" })
    }
}


const changeBrandName = async (req, res) => {
    const { brandId } = req.params
    const { brandName } = req.body
    try {
        const allBrand = await Brand.find()
        const isExist = allBrand.find((brand) => brand.name.toLowerCase() == brandName.toLowerCase())
        if (isExist) return res.status(StatusCodes.BAD_REQUEST).json({ message: "This brand is already exist" })
        const ChangedBrand = await Brand.findByIdAndUpdate(brandId, { name: brandName })
        if (!ChangedBrand) return res.status(StatusCodes.BAD_REQUEST).json({ message: " no brand found" })
        return res.status(StatusCodes.OK).json({ message: "brand name changed" })
    } catch (error) {
        console.log('error while updating brand', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error while updating brand" })
    }
}


const changeStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    try {
        const brand = await Brand.findById(id)
        if (!brand) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no brand found' })
        brand.status = status
        await brand.save()
        return res.status(StatusCodes.OK).json({ message: "status changed" })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error in while changing status" })
    }
}

module.exports = {
    addBrand,
    showBrand,
    changeStatus,
    changeBrandName
}