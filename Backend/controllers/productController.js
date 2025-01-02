const Product = require('../models/productSchema')
const Category = require('../models/categorySchema')
const product = require('../models/productSchema')
const Brand = require('../models/brandSchema')
// const product = require('../models/productSchema')
const addProduct = async (req, res) => {
    const { name, price, quantity, subHead, categoryId, subHeadDescription, variant, brand, sku, description, status, imageUrl, specAndDetails } = req.body

    // console.log( 'this is spec', specAndDetails)

    try {

        const category = await Category.findById(categoryId)

        // console.log(category)

        if (!category) return res.status(400).json({ message: "the category is not found" })

        const existingProduct = await Product.findOne({ title: new RegExp(`^${name}$`, 'i') })

        // console.log(existingProduct)



        if (existingProduct) return res.status(400).json({ message: "the product is already created" })



        const product = new Product({

            title: name,

            sku,

            price,

            availableQuantity: quantity,

            description,

            productImg: imageUrl,

            stock: status,

            categoryId: categoryId,

            spec: specAndDetails,

            subHead,

            subHeadDescription,

            variants: variant,

            brand



        })

        // console.log(product)

        await product.save()

        res.status(201).json({ message: "product created" })

    } catch (error) {

        console.log('error while creating the product', error)

        res.status(500).json({ message: "server error in creating a product" })

    }

}



const showProduct = async (req, res) => {

    try {
        const { pageNumber } = req.params
        const page = parseInt(pageNumber, 10);
        const limit = 5
        const skip = (page - 1) * limit
        console.log('this is the pagenumber', pageNumber)
        const products = await Product.find().populate('categoryId').populate('productOffer').limit(limit).skip(skip)
        console.log(products)
        return res.status(200).json({ message: 'products fetched', products })
    } catch (error) {
        console.log('error while fetching the products', error)
        return res.status(500).json({ message: "error while fetching the products" })
    }

}



const showProductInHotDeals = async (req, res) => {

    try {
        const products = await Product.find().populate('categoryId').populate('productOffer')
        console.log(products)
        return res.status(200).json({ message: 'products fetched', products })
    } catch (error) {
        console.log('error while fetching the products', error)
        return res.status(500).json({ message: "error while fetching the products" })

    }

}



const showParticularProduct = async (req, res) => {

    try {

        const { id } = req.params

        const products = await Product.findById(id, { status: 'active' }).populate('categoryId').populate('productOffer')

        return res.status(200).json({ message: 'products fetched', products })

    } catch (error) {

        console.log('error while fetching the products', error)

        return res.status(500).json({ message: "error while fetching the products" })

    }

}



const editProduct = async (req, res) => {

    const { id } = req.params





    const { title, sku, price, availableQuantity, brand, subHeadDescription, description, status, categoryId, stock, category, spec, subHead } = req.body.product

    //    console.log('this is the variants id',categoryId)

    console.log('this is the brand name', brand)

    const oldCatId = categoryId._id

    const { urls } = req.body

    const { variants } = req.body

    //   console.log('this is the name of the editing brand',variants)



    try {



        const checkCategory = await Category.findOne({ categoryName: category })



        const checkBrand = await Brand.findOne({ name: brand })

        console.log('this is the checkbrand', checkBrand)



        if (!checkCategory) {



            const editedProduct = await Product.findByIdAndUpdate(id, {

                title,

                sku,

                price,

                availableQuantity,

                description,

                productImg: urls,

                status,

                stock,

                categoryId: oldCatId,

                spec,

                subHead,

                subHeadDescription,

                brand: checkBrand._id,

                variants

            })

            // console.log("Spec saved " , spec)



            return res.status(200).json({ message: "product edited" })

        } else {

            // console.log(checkCategory)

            const editedProduct = await Product.findByIdAndUpdate(id, {

                title,

                sku,

                price,

                availableQuantity,

                description,

                productImg: urls,

                status,

                stock,

                categoryId: checkCategory._id,

                subHead,

                brand: checkBrand._id,

                variants

            })



            return res.status(200).json({ message: "product edited" })

        }



    } catch (error) {

        console.log('error while editing the product', error)

        return res.status(500).json({ message: "error while editing the product" })

    }

}





const showProductListed = async (req, res) => {



    try {

        const { pageNumber } = req.params

        const page = parseInt(pageNumber, 10);

        const limit = 5

        const skip = (page - 1) * limit



        const products = await Product.find({ status: 'active', availableQuantity: { $gt: 0 } }).populate({

            path: 'categoryId',

            match: { status: 'active' },

            // select: '_id categoryName status'

            populate: {

                path: 'categoryOffer',

                match: { validUntil: { $gte: new Date() }, isListed: true },

                select: 'offerType offerValue validFrom validUntil',
            }

        }).populate({

            path: 'brand',

            match: { status: 'active' },

            select: '_id name status'

        }).populate({

            path: 'productOffer',

            match: { validUntil: { $gte: new Date() }, isListed: true },

            select: 'offerType offerValue validFrom validUntil'

        }).limit(limit).skip(skip)

        console.log('this is products', products)

        console.log(products)

        const activeProducts = products.filter(product => product.categoryId && product.brand?.status == 'active');

        // console.log('this is active products',activeProducts)

        return res.status(200).json({ message: 'products fetched', products: activeProducts })

    } catch (error) {

        console.log('error while fetching the products')

        return res.status(500).json({ message: "error while fetching the products" })

    }

}



const showProductVariantQuantity = async (req, res) => {

    const { id } = req.params

    const { variantId } = req.query;

    try {

        console.log(id)

        const selectedProduct = await product.findById(id)

        console.log("selected ", selectedProduct.variants)

        //    console.log(Array.isArray(selectedProduct));

        const selectedVariant = selectedProduct.variants.find((variant) => variant._id == variantId)

        console.log(selectedVariant)

        res.status(200).json(selectedVariant.stock)

    } catch (error) {

        console.log(error)

    }

}



const showRelatedProducts = async (req, res) => {

    const { id } = req.params



    // console.log(id)

    try {

        const relatedProducts = await Product.find({ status: 'active', categoryId: id }).limit(4)

        const notRelatedProducts = await Product.find({ status: "active" }).limit(4)

        if (!relatedProducts) return res.status(200).json({ message: "related products is empty so random products", notRelatedProducts })

        return res.status(200).json({ message: "related products fetched", relatedProducts })

    } catch (error) {

        console.log('error while fetching the related products', error)

        return res.status(400).json({ message: "error while retrieving the related products" })

    }

}



const filterProducts = async (req, res) => {

    console.log(req.query)

    try {

        const { sortBy, brands, categories, minPrice, maxPrice } = req.query

        const filter = {};



        if (brands) {

            filter.brand = { $in: brands };

        }



        if (categories) {

            filter.categoryId = { $in: categories };

        }



        if (minPrice || maxPrice) {

            filter.price = {};

            if (minPrice) filter.price.$gte = Number(minPrice);

            if (maxPrice) filter.price.$lte = Number(maxPrice);

        }



        const products = await Product.find(filter);





        if (sortBy) {

            const sortOptions = {};

            switch (sortBy) {

                case 'popularity':

                    sortOptions.popularity = 1;

                    break;

                case 'price-low-high':

                    sortOptions.price = 1;

                    break;

                case 'price-high-low':

                    sortOptions.price = -1;

                    break;

                case 'average-rating':

                    sortOptions.rating = -1;

                    break;

                case 'featured':

                    sortOptions.featured = 1;

                    break;

                case 'new-arrivals':

                    sortOptions.createdAt = -1;

                    break;

                case 'a-z':

                    sortOptions.title = 1;

                    break;

                case 'z-a':

                    sortOptions.title = -1;

                    break;

                default:

                    break;

            }





            const sortedProducts = await Product.find(filter).sort(sortOptions);

            return res.status(200).json(sortedProducts);

        }



        return res.status(200).json(products);





    } catch (error) {

        console.log('error while filtering the product', error)

        return res.status(500).json({ message: 'error while filtering the product' })

    }

}



const search = async (req, res) => {

    try {
        console.log('this is search')
        const { searchTerm } = req.query
        console.log(searchTerm)
        const products = await Product.find({
            title: { $regex: searchTerm, $options: 'i' },
            status: 'active'
        }).populate('categoryId').populate('productOffer').limit(5);
        console.log('the is the product', products)
        return res.status(200).json({ message: 'Searched product fetched', products })
    } catch (error) {
        console.log('error while searching', error)
        return res.status(500).json({ message: "error while searching " })
    }

}


module.exports = {
    addProduct,
    showProduct,
    editProduct,
    showProductListed,
    showRelatedProducts,
    showProductVariantQuantity,
    filterProducts,
    search,
    showProductInHotDeals,
    showParticularProduct



}









