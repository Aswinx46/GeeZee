const Product = require('../models/productSchema')
const Brand = require('../models/brandSchema')

const addBrand = async (req, res) => {
    const { status, newBrand, imageUrl } = req.body
    try {
        const allBrand=await Brand.find()
        const isExist=allBrand.find((brand)=>brand.name.toLowerCase() == newBrand.toLowerCase())
        // const isExist = await Brand.findOne({ name: newBrand })
        if (isExist) return res.status(400).json({ message: "the brand is already exist" })



        const brand = new Brand({
            name: newBrand,
            status,
            brandImage: imageUrl
        })
        await brand.save()
        return res.status(200).json({ message: 'brand created', brand })
    } catch (error) {
        console.log('error in creating new brand')
        return res.status(400), json({ message: "error while creating new brand" })
    }
}

const showBrand = async (req, res) => {

    try {
        const brands = await Brand.find()
        if (!brands) return res.status(400).json({ message: 'no brand available' })
            
        return res.status(200).json({ messaage: "brands fetched", brands })

    } catch (error) {
        console.log('error while fetching the brands list', error)
        return res.status(400), json({ message: "error while fetching the brand list" })
    }
}


const changeBrandName = async (req, res) => {
    const { brandId } = req.params
    const { brandName } = req.body
    try {
        const allBrand=await Brand.find()
        const isExist=allBrand.find((brand)=>brand.name.toLowerCase() == brandName.toLowerCase())
        if(isExist) return res.status(400).json({message:"This brand is already exist"})
        const ChangedBrand = await Brand.findByIdAndUpdate(brandId, { name: brandName })
        if (!ChangedBrand) return res.status(400).json({ message: " no brand found" })
        return res.status(200).json({ message: "brand name changed" })
    } catch (error) {
        console.log('error while updating brand', error)
        return res.status(500).json({ message: "error while updating brand" })
    }
}


const changeStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    try {
        const brand = await Brand.findById(id)
        if (!brand) return res.status(400).json({ message: 'no brand found' })
        brand.status = status
        await brand.save()
        return res.status(200).json({ message: "status changed" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error in while changing status" })
    }
}

module.exports = {
    addBrand,
    showBrand,
    changeStatus,
    changeBrandName
}