const Product=require('../models/productSchema')
const Category=require('../models/categorySchema')
const product = require('../models/productSchema')
const addProduct=async (req,res) => {
    const{name,price,quantity,subHead,categoryId,subHeadDescription,variant,sku,description,status,imageUrl,specAndDetails}=req.body
    console.log(name,price,quantity,categoryId,sku,description,status,imageUrl)
    try {
        const category=await Category.findById(categoryId)
        console.log(category)
        if(!category) return res.status(400).json({message:"the category is not found"})
            const existingProduct=await Product.findOne({title:new RegExp(`^${name}$`, 'i')})
        console.log(existingProduct)
        if(existingProduct) return res.status(400).json({message:"the product is already created"})
            const product=new Product({
                title:name,
                sku,
                price,
                availableQuantity:quantity,
                description,
                productImg:imageUrl,
                stock:status,
                categoryId:categoryId,
                spec:specAndDetails,
                subHead,
                subHeadDescription,
                variant
        })
        await product.save()
        res.status(201).json({message:"product created"})
    } catch (error) {
        console.log('error while creating the product',error)
        res.status(500).json({message:"server error in creating a product"})
    }
}

const showProduct=async (req,res) => {
    
    try {
        const products=await Product.find().populate('categoryId','categoryName')
        return res.status(200).json({message:'products fetched',products})
    } catch (error) {
        console.log('error while fetching the products')
        return res.status(500).json({message:"error while fetching the products"})
    }
}

const editProduct=async (req,res) => {
    const{id}=req.params
   
  
    const {title,sku,price,availableQuantity,subHeadDescription,description,status,categoryId,stock,category,spec,subHead}=req.body.product
   
    const oldCatId=categoryId._id
    const{urls}=req.body
  
    
    try {
        const checkCategory=await Category.findOne({categoryName:category})
        
        if(!checkCategory)
        {
            
            const editedProduct=await Product.findByIdAndUpdate(id,{
                title,
                sku,
                price,
                availableQuantity,
                description,
                productImg:urls,
                status,
                stock,
                categoryId:oldCatId,
                spec,
                subHead,
                subHeadDescription
            })
            console.log("Spec saved " , spec)
           
            return res.status(200).json({message:"product edited"})
        }else{
            console.log(checkCategory)
            const editedProduct=await Product.findByIdAndUpdate(id,{
                title,
                sku,
                price,
                availableQuantity,
                description,
                productImg:urls,
                status,
                stock,
                categoryId:checkCategory._id,
                subHead
            })
           
            return res.status(200).json({message:"product edited"})
        }
          
    } catch (error) {
        console.log('error while editing the product',error)
        return res.status(500).json({message:"error while editing the product"})
    }
}


const showProductListed=async (req,res) => {
    
    try {
        const products=await Product.find({status:'active',availableQuantity:{$gt:0}}).populate({
            path:'categoryId',
            match:{status:'active'},
            select: '_id categoryName status'
        })
        console.log('this is products',products)
        const activeProducts = products.filter(product => product.categoryId);
        console.log('this is active products',activeProducts)
        return res.status(200).json({message:'products fetched',products:activeProducts})
    } catch (error) {
        console.log('error while fetching the products')
        return res.status(500).json({message:"error while fetching the products"})
    }
}

const showProductVariants=async(req,res)=>{
    try {
       
    } catch (error) {
        
    }
}

const showRelatedProducts=async (req,res) => {
    const {id}=req.params
    console.log(id)
    try {
        const relatedProducts=await Product.find({status:'active',categoryId:id}).limit(4)
        const notRelatedProducts=await product.find({status:"active"}).limit(4)
        if(!relatedProducts) return res.status(200).json({message:"related products is empty so random products",notRelatedProducts})
           return res.status(200).json({message:"related products fetched",relatedProducts})
    } catch (error) {
        console.log('error while fetching the related products',error)
        return res.status(400).json({message:"error while retrieving the related products"})
    }
}

module.exports={
    addProduct,
    showProduct,
    editProduct,
    showProductListed,
    showRelatedProducts
    
}




