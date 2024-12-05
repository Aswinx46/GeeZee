const Product=require('../models/productSchema')
const Category=require('../models/categorySchema')
const addProduct=async (req,res) => {
    const{name,price,quantity,subHead,categoryId,subHeadDescription,sku,description,status,imageUrl,specAndDetails}=req.body
    console.log(name,price,quantity,categoryId,sku,description,status,imageUrl)
    try {
        const category=await Category.findById(categoryId)
        console.log(category)
        if(!category) return res.status(400).json({message:"the category is not found"})
            const existingProduct=await Product.findOne({title:new RegExp(`^${name}$`, 'i')})
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
                subHeadDescription
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
        const products=await Product.find({status:'active'}).populate('categoryId','categoryName')
        return res.status(200).json({message:'products fetched',products})
    } catch (error) {
        console.log('error while fetching the products')
        return res.status(500).json({message:"error while fetching the products"})
    }
}

const showRelatedProducts=async (req,res) => {
    const {id}=req.query
    console.log(id)
    try {
        const relatedProducts=await Product.find({status:'active',categoryId:id})
        console.log(relatedProducts)
    } catch (error) {
        
    }
}

module.exports={
    addProduct,
    showProduct,
    editProduct,
    showProductListed,
    showRelatedProducts
    
}




