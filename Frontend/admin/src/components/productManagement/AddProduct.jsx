import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaImage } from 'react-icons/fa';
import ImageCropper from '../common/ImageCropper';
import cloudAxios from 'axios'
import axios from '../../../axios/adminAxios'
import { MutatingDots } from 'react-loader-spinner'
import { toast } from 'react-toastify';
const ProductManagement = () => {
    const[imageUrl,setImageUrl]=useState([])
    const[image,setImage]=useState([])
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);
    const [isLoading,setIsLoading]=useState(false)
    const[categories,setCategories]=useState([])
    const[success,setSuccess]=useState(false)

    const formRef=useRef()

    useEffect(()=>{
        const getCategory=async () => {
            
            const category= await axios.get('/category')
            setCategories(category.data.category)

        }
        getCategory()
    },[success])

    const handleSubmit=async(event)=>{
        event.preventDefault()
        console.log(categories)
        setIsLoading(true)
        const data=new FormData(event.target)
        const selectedCategory=categories.find((cat)=>cat.categoryName==data.get('category'))
        const selectedCategoryId=selectedCategory._id
        
        console.log(selectedCategoryId)
          try {
          
            const uploadPromises= image.map(async(file, index)=>{
                const formData = new FormData();
                const croppedImageBlob = await fetch(imageUrl[index]).then(r => r.blob());
                formData.append('file', croppedImageBlob);
                formData.append('upload_preset', 'products')
                formData.append('cloud_name','dotlezt0x')
                return cloudAxios.post(
                    'https://api.cloudinary.com/v1_1/dotlezt0x/image/upload',
                    formData
                )
            })
            
            const cloudinaryUpload=await Promise.all(uploadPromises) 
            const imageUrls = cloudinaryUpload.map(res=>res.data?.secure_url)
            console.log(imageUrls)
           
            const productDetails={
                name:data.get('title'),
                price:data.get('price'),
                quantity:data.get('quantity'),
                categoryId:selectedCategoryId,
                sku:data.get('SKU'),
                description:data.get('description'),
                status:data.get('stockStatus'),
                imageUrl:imageUrls
            }
         
            try {
                console.log(productDetails)
                const uploadProduct=await axios.post('/addProduct',productDetails)
                console.log('jashdfoasdfnalskdjfaksdj')
                console.log(uploadProduct)
                toast.success(uploadProduct.data.data.message)
                setIsLoading(false)
                setSuccess(!success)
               if(formRef.current) formRef.current.reset()
              
            } catch (error) {
                console.log('error while adding the product',error)
                toast.error(error.response.data.message)
                if(formRef.current) formRef.current.reset()
            }
       
           
           

          } catch (error) {
            console.log('error in uploading the cloudinary',error)
            setIsLoading(false)
          }finally{
            setIsLoading(false)
          }
     
    }

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
        }
    };

    const handleCropSave = (croppedImageUrl) => {
        const newImageUrls = [...imageUrl];
        newImageUrls[currentImageIndex] = croppedImageUrl;
        setImageUrl(newImageUrls);
        setCropModalOpen(false);
        setCurrentImage(null);
    };

    const handleCropCancel = () => {
        setCropModalOpen(false);
        setCurrentImage(null);
    };

    const deleteImage =(index)=>{
        const updatedImageUrl=imageUrl.filter((_,i)=>i!==index)
        const updatedImage=image.filter((_,i)=>i!==index)
        setImage(updatedImage)
        setImageUrl(updatedImageUrl)
        console.log(updatedImageUrl)
    }

  return (
    <div className="min-h-screen bg-white">
   

      {/* Main Content */}
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Add Product</h1>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name='title'
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </motion.div>

              {/* Stock Status Field */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock status
                </label>
                <select name='stockStatus' className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black">
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
              </motion.div>

              {/* Price Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name='price'
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </motion.div>

              {/* Available Quantity Field */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available quantity
                </label>
                <input
                  type="number"
                  name='quantity'
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </motion.div>

              {/* Category Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
              
                     <select name='category' className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black">
                     {categories.map((category,i)=>(
                     <option key={i}>{category.categoryName}</option>
                    ))}
                   </select>
              
               
              </motion.div>

              {/* Image Upload Field */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="product-images"
                    onChange={handleImageChange}
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

              {/* SKU Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name='SKU'
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </motion.div>

              {/* Preview Images */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center space-x-2"
              >
                {imageUrl.length > 0 ? (
                    imageUrl.map((url,index)=>(
                        <div key={index} className="relative w-24 h-24 group">
                            <div className="w-full h-full bg-white border border-gray-300 rounded-md overflow-hidden">
                                <img src={url} alt="preview" className="w-full h-full object-cover"/>
                            </div>
                            <button 
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

            {/* Description Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                name='description'
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              ></textarea>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex justify-start"
            >
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Save Product
              </button>
            </motion.div>
          </form>
          <div className='flex justify-center'>
          {isLoading &&  <MutatingDots className='items-center' visible={true} height="100" width="100" color="black" secondaryColor="yellow" radius="12.5" ariaLabel="mutating-dots-loading" wrapperClass="" wrapperStyle={{}}/> }        

          </div>

        </motion.div>
      </div>
      {cropModalOpen && (
                <ImageCropper
                    image={currentImage}
                    onCropSave={handleCropSave}
                    onCropCancel={handleCropCancel}
                />
            )}
    </div>
  );
};

export default ProductManagement;
