const Banner=require('../models/bannerSchema')

const createBanner=async (req,res) => {
    try {
        console.log('this iis inside the create banner')
        const {formData,videoUrl}=req.body
        console.log(formData)
        const newBanner=new Banner({
            name:formData.name,
            startDate:formData.startDate,
            endDate:formData.endDate,
            status:formData.status,
            bannerUrl:videoUrl
        })
        await newBanner.save()
        return res.status(201).json({message:"new banner created"})
    } catch (error) {
        console.log('error while crating banner',error)
        return res.status(500).json({message:"error while creating banner",error})
    }
}

const showBanner=async (req,res) => {
    try {
        const allBanners=await Banner.findOne({status:'active'})
        if(!allBanners) return res.status(400).json({message:"No banner found"})

        return res.status(200).json({message:'banner fetched',allBanners})
    } catch (error) {
        console.log('error while fetching banner details',error)
        return res.status(500).json({message:"error while fetching banner details",error})
    }
}

const currentBannersInAdmin=async (req,res) => {
    try {
        const allBanners=await Banner.find()
        if(!allBanners) return res.status(400).json({message:"No banner found"})
            return res.status(200).json({message:'banner fetched',allBanners})
    } catch (error) {
        console.log('error while fetching the banner data for the admin',error)
        return res.status(500).json({message:'error while fetching the banner data for the admin'})
    }
}

const changeStatusOfBanner=async (req,res) => {
    try {
        const {bannerId}=req.params
        const {status}=req.body
        const banner=await Banner.findByIdAndUpdate(bannerId,{status},{new:true})
        if(!banner)return res.status(400).json({message:'no banner found'})
            return res.status(200).json({message:"banner status changed"})
    } catch (error) {
        console.log('error while changing the status of banner',error)
        return res.status(500).json({message:"error while changing the status of the banner",error})
    }
}

module.exports={
    createBanner,
    showBanner,
    currentBannersInAdmin,
    changeStatusOfBanner
}