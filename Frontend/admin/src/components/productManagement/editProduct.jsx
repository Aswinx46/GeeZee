import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaUpload, FaImage } from 'react-icons/fa';
import ImageCropper from '../common/ImageCropper';
import axios from '../../../axios/adminAxios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { store } from '../../redux/store'
import cloudAxios from 'axios'
import { MutatingDots } from 'react-loader-spinner'
import { toast } from 'react-toastify';
import EditVariant from './editVariant'
import OrderManagement from './OrderManagement'
const EditProduct = () => {
    const [categories, setCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState([]);
    const [image, setImage] = useState([]);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [OpenOffer, setOpenOffer] = useState(false)
    const[selectedOffer,setSelectedOffer]=useState({})


    const [product, setProduct] = useState(store.getState().product.product)
    const [oldUrl, setOldUrl] = useState([])
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState({});
    const [brands, setBrands] = useState([])
    const [selectedBrand, setSelectedBrand] = useState({})
    const [modalOpen, setModalOpen] = useState(false)
    const [varients, setVarients] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [attributes, setAttributes] = useState([])
    const [editingVariant, setEditingVariant] = useState()
    const navigate = useNavigate()
    const [index, setIndex] = useState()
    const [productId, setProductId] = useState()
    const [existingProductOffer, setExistingProductOffer] = useState({})

    useEffect(() => {
        const fetchCategory = async () => {
            const category = await axios.get('/category');
            const sendedProduct = store.getState().product.product
            setVarients(sendedProduct.variants)
            const response = await axios.get('/brands');
            console.log('this is the brands from the backend', response.data.brands)
            const selectedBrand = response.data.brands.find((brand) => brand._id == sendedProduct.brand)
            console.log('this is the selected brand name', selectedBrand)
            setSelectedBrand([selectedBrand])
            setProduct(prev => ({ ...prev, brand: selectedBrand.name }))
            setProductId(product?._id)

            const brand = response.data.brands.filter((bran) => bran.name !== selectedBrand.name)
            console.log('this is after brand filter', brand)
            console.log(selectedBrand)
            console.log('this is the brands without selected one', brand)

            setBrands(brand);

            console.log("Old urls are ", product.productImg)
            console.log(sendedProduct.spec)
            console.log(category)
            const cat = category.data.category.filter((cat) => cat.categoryName != sendedProduct.categoryId.categoryName)
            console.log(cat)



            setOldUrl(sendedProduct.productImg)
            setCategories(cat);
            setSuccess(false)
            console.log(sendedProduct)
            setExistingProductOffer(sendedProduct.productOffer)
            if (sendedProduct.productImg && sendedProduct.productImg.length > 0) setImageUrl(sendedProduct.productImg)
        };
        fetchCategory();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                setCurrentImage(reader.result);
                setCropModalOpen(true);
                setCurrentImageIndex(imageUrl.length);
            };
            reader.readAsDataURL(files[0]);
            setImage([...image, files[0]]);
            console.log("handle Image chagen", oldUrl)
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.src = url;
        });

    const getCroppedImage = async (imageSrc, crop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(URL.createObjectURL(blob));
            }, 'image/jpeg');
        });
    };

    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImage(currentImage, croppedAreaPixels);
            const newImageUrls = [...imageUrl];
            newImageUrls[currentImageIndex] = croppedImage;
            setImageUrl(newImageUrls);
            setCropModalOpen(false);
            setCurrentImage(null);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    };

    const handleCropCancel = () => {
        navigate('/showProduct')
        setCropModalOpen(false);
        setCurrentImage(null);

        const newImage = [...image];
        newImage.splice(currentImageIndex, 1);
        setImage(newImage);

    };

    const deleteImage = (index) => {
        const updatedImageUrl = imageUrl.filter((_, i) => i !== index);
        const updatedImage = image.filter((_, i) => i !== index);
        setImage(updatedImage);
        setImageUrl(updatedImageUrl);
        setOldUrl(updatedImageUrl.filter(url => url.startsWith('https://res.cloudinary.com')))
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'spec') {
            const spec = e.target.value.split('>');
            setProduct((p) => ({ ...p, spec }))
        } else if (name === 'subHead') {

            const subHead = e.target.value.split('>')
            setProduct((p) => ({ ...p, subHead }))
        } else if (name === 'subHeadDescription') {
            const subHeadDescription = e.target.value.split('>')
            setProduct((p) => ({ ...p, subHeadDescription }))
        } else {
            setProduct((p) => ({
                ...p, [name]: value
            }))
        }
    }

    const handleEditVariant = (index) => {
        console.log('modal opened')
        setIndex(index)
        console.log(isOpen)
        setIsOpen(true)
    }



    const handleAddOffer = () => {
        setOpenOffer(true)
        console.log(OpenOffer)
    }
    const handleListOffer=async()=>{
        try {
            
            const response=await axios.patch(`/changeStatusOrder/${existingProductOffer._id}`)
            toast.success(response.data.message)
        } catch (error) {
            console.log('error while changing the status of offer',error)
            toast.error('error while changing the status of offer')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('this is the variant from the parent', varients)
        // Validate all fields
        console.log('this is the product', product)
        const newErrors = {};
        if (!product.title?.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!product.price || Number(product.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }
        if (!product.availableQuantity || Number(product.availableQuantity) <= 0) {
            newErrors.availableQuantity = 'Quantity must be greater than 0';
        }
        if (!product.sku?.trim()) {
            newErrors.sku = 'SKU is required';
        }
        if (!product.description?.trim()) {
            newErrors.description = 'Description is required';
        }
        if (product.spec.length <= 0) {
            newErrors.spec = 'Specifications are required';
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fill all required fields correctly');
            return;
        }

        console.log('this is the product after edit', product)

        setErrors({});
        setSuccess(true)
        console.log("Before axios.put, product:", product);
        const newImageUrls = imageUrl.filter(url => !url.startsWith('https://res.cloudinary.com'));

        const uploadPromises = newImageUrls.map(async (url, index) => {
            try {
                console.log('Processing new image:', index)

                const formData = new FormData();
                const croppedImageBlob = await fetch(url).then(r => r.blob());
                formData.append('file', croppedImageBlob);
                formData.append('upload_preset', 'products')
                formData.append('cloud_name', 'dotlezt0x')

                const response = await cloudAxios.post(
                    'https://api.cloudinary.com/v1_1/dotlezt0x/image/upload',
                    formData
                )

                return response;
            } catch (error) {
                console.log('error while updating the new image to the cloudinary', error)

            }
        })

        try {
            const cloudinaryResponse = await Promise.all(uploadPromises)
            console.log(cloudinaryResponse)
            const urls = cloudinaryResponse.map((obj) => obj.data.secure_url)

            console.log(product)
            if (urls.length > 0) {
                console.log('jhfoasjdf;jaso')
                const response = await axios.put(`/editProduct/${product._id}`, { product, urls: [...oldUrl, ...urls], variants: varients })
                console.log(product)
                console.log(response)
                setSuccess(true)
                navigate('/showProduct')
            } else {
                const response = await axios.put(`/editProduct/${product._id}`, { product, urls: [...oldUrl, ...urls], variants: varients })
                setSuccess(true)
                navigate('/showProduct')
            }

        } catch (error) {
            console.error('Error in Promise.all:', error)
            setSuccess(false)
        }

    }

    const handleDeleteOffer=async()=>{
        try {
            
        } catch (error) {
            console.log('error while deleting the error',error)
            toast.error('error while deleting the error')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-3xl mx-auto">
                <motion.h1
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl font-bold text-gray-900 mb-8"
                >
                    Edit Product
                </motion.h1>
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onSubmit={handleSubmit}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                    <div className="p-6 space-y-6">
                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="title"
                                value={product.title}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all duration-200 ease-in-out ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all duration-200 ease-in-out"

                            >
                                <option value={product.categoryId?.categoryName}> {product.categoryId?.categoryName || "Select a category"}</option>

                                {categories.map((category, index) => (
                                    <option key={index} value={category.categoryName}>{category.categoryName}</option>
                                ))}


                            </select>
                        </motion.div>


                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Brands
                            </label>
                            <select
                                id="brand"
                                name="brand"
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all duration-200 ease-in-out"

                            >
                                <option value={selectedBrand[0]?.name}>{selectedBrand[0]?.name || "Select a brand"}</option>
                                {brands.map((brand, index) => (
                                    <option key={index} value={brand.name}>{brand.name}</option>
                                ))}
                            </select>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={product.price}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all duration-200 ease-in-out ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                min="0"
                                step="0.01"
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="availableQuantity"
                                value={product.availableQuantity}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all duration-200 ease-in-out ${errors.availableQuantity ? 'border-red-500' : 'border-gray-300'}`}
                                min="0"
                            />
                            {errors.availableQuantity && <p className="text-red-500 text-sm mt-1">{errors.availableQuantity}</p>}
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                value={product.description}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all duration-200 ease-in-out ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Spec and Details
                            </label>

                            <textarea
                                rows="4"
                                name='spec'
                                value={product.spec.join(">")}
                                onChange={handleInputChange}
                                className={`w-full bg-white border rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.spec ? 'border-red-500' : 'border-gray-300'}`}
                            >

                            </textarea>
                            {errors.spec && <p className="text-red-500 text-sm mt-1">{errors.spec}</p>}
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={product.status}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all duration-200 ease-in-out"

                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                                SKU
                            </label>
                            <input
                                type="text"
                                id="sku"
                                name="sku"
                                value={product.sku}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all duration-200 ease-in-out ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sub Headings
                            </label>
                            <input
                                type="text"
                                name='subHead'
                                value={product.subHead.join('>')}
                                onChange={handleInputChange}
                                className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.subHead ? 'border-red-500' : ''}`}
                            />
                            {errors.subHead && <p className="text-red-500 text-sm">{errors.subHead}</p>}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sub Heading Description
                            </label>
                            <textarea
                                rows="4"
                                onChange={handleInputChange}
                                name='subHeadDescription'
                                value={product.subHeadDescription.join('>')}
                                className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.subHeadDescription ? 'border-red-500' : ''}`}
                            ></textarea>
                            {errors.subHeadDescription && <p className="text-red-500 text-sm">{errors.subHeadDescription}</p>}
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                                Product Images
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="product-images"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    multiple
                                />
                                <label
                                    htmlFor="product-images"
                                    className="flex items-center justify-center w-full bg-white border border-gray-300 border-dashed rounded-md px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center space-x-2">
                                        <FaUpload className="w-5 h-5" />
                                        <span>Choose product images</span>
                                    </div>
                                </label>
                            </div>
                        </motion.div>


                        {/* Preview Images */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center space-x-2 mt-4"
                        >
                            {imageUrl.length > 0 ? (
                                imageUrl.map((url, index) => (
                                    <div key={index} className="relative w-24 h-24 group">
                                        <div className="w-full h-full bg-white border border-gray-300 rounded-md overflow-hidden">
                                            <img src={url} alt="preview" className="w-full h-full object-cover" />
                                        </div>
                                        <button
                                            type='button'
                                            onClick={() => deleteImage(index)}
                                            className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-800"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="w-24 h-24 bg-white border border-gray-300 rounded-md flex items-center justify-center">
                                    <FaImage className="w-6 h-6 text-gray-600" />
                                </div>
                            )}
                        </motion.div>
                    </div>


                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="flex justify-start"
                        >

                        </motion.div>
                       {!existingProductOffer && 
                        <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleAddOffer}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 ease-in-out"
                        >
                            <FaSave className="mr-2" />
                            Add Offer
                        </motion.button>
                        } 

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 ease-in-out"
                        >
                            <FaTimes className="mr-2" />
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 ease-in-out"
                        >
                            <FaSave className="mr-2" />
                            Save Changes
                        </motion.button>

                    </div>

                </motion.form>
                {/* {success && <MutatingDots className='items-center' visible={true} height="100" width="100" color="black" secondaryColor="yellow" radius="12.5" ariaLabel="mutating-dots-loading" wrapperClass="" wrapperStyle={{}}/>} */}


                {existingProductOffer && Object.keys(existingProductOffer).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden"
                    >
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Current Product Offer</h3>
                            <div className="flex space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => setOpenOffer(true)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Edit Offer
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={handleListOffer}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  {existingProductOffer.isListed ? 'Block' : 'Unblock'}
                                </motion.button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="block text-sm font-medium text-gray-500 mb-1">Offer Type</span>
                                    <p className="text-lg font-semibold text-gray-900 capitalize">
                                        {existingProductOffer.offerType}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="block text-sm font-medium text-gray-500 mb-1">Offer Value</span>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {existingProductOffer.offerType === 'percentage'
                                            ? `${existingProductOffer.offerValue}%`
                                            : `₹${existingProductOffer.offerValue}`}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="block text-sm font-medium text-gray-500 mb-1">Start Date</span>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {(existingProductOffer.validFrom).split('T')[0]}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="block text-sm font-medium text-gray-500 mb-1">End Date</span>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {(existingProductOffer.validUntil).split('T')[0]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
            {varients.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Current Variants:</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {attributes.map((attr, idx) => (
                                    <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {Object.keys(attr)[0]}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {varients.map((variant, idx) => (
                                <tr key={idx} className={editingVariant === idx ? 'bg-yellow-50' : ''}>
                                    {attributes.map((attr, attrIdx) => (
                                        <td key={attrIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {variant.selectedAttributes[Object.keys(attr)[0]]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handleEditVariant(idx)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteVariant(idx)}
                                            className="text-red-600 hover:text-red-800 font-medium ml-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isOpen && <EditVariant isOpen={isOpen} Varient={varients} index={index} setVarient={setVarients} setIsOpen={setIsOpen} />}

            {OpenOffer && <OrderManagement OpenOffer={OpenOffer} setOpenOffer={setOpenOffer} productId={productId} existingProductOffer={existingProductOffer} />}

            {cropModalOpen && currentImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white p-4 rounded-lg w-[90%] max-w-2xl">
                        <h2 className="text-xl font-bold mb-4">Crop Image</h2>
                        <ImageCropper
                            image={currentImage}
                            crop={crop}
                            setCrop={setCrop}
                            zoom={zoom}
                            setZoom={setZoom}
                            rotation={rotation}
                            setRotation={setRotation}
                            onCropComplete={onCropComplete}
                        />
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={handleCropCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCropSave}
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default EditProduct;
