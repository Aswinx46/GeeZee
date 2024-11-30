const Product=require('../models/productSchema')
const Category=require('../models/categorySchema')
const addProduct=async (req,res) => {
    const{name,price,quantity,categoryId,sku,description,status,imageUrl}=req.body
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
                categoryId:categoryId
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
        const products=await Product.find()
        return res.status(200).json({message:'products fetched',products})
    } catch (error) {
        console.log('error while fetching the products')
        return res.status(500).json({message:"error while fetching the products"})
    }
}
module.exports={
    addProduct,
    showProduct,
}




