import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaImage } from 'react-icons/fa';
import ImageCropper from '../common/ImageCropper';
import cloudAxios from 'axios'
import axios from '../../../axios/adminAxios'
import { MutatingDots } from 'react-loader-spinner'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProductForm from './Variant';

const ProductManagement = () => {
    const[imageUrl,setImageUrl]=useState([])
    const[image,setImage]=useState([])
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);
    const [isLoading,setIsLoading]=useState(false)
    const[categories,setCategories]=useState([])
    const[success,setSuccess]=useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const navigate=useNavigate()
    const formRef=useRef()
    const [errors, setErrors] = useState({});

    useEffect(()=>{
        const getCategory=async () => {
            const category= await axios.get('/category')
            setCategories(category.data.category)
        }
        getCategory()
    },[success])

    const validateForm = (formData) => {
        const newErrors = {};
        
        // Title validation
        if (!formData.get('title').trim()) {
            newErrors.title = 'Title is required';
        }

        // Price validation
        const price = formData.get('price');
        if (!price) {
            newErrors.price = 'Please enter a valid price';
        } else if (Number(price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        // Quantity validation
        const quantity = Number(formData.get('quantity'));
        if (!formData.get('quantity')) {
            newErrors.quantity = 'Please enter a valid quantity';
        } else if (quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        // SKU validation
        if (!formData.get('SKU').trim()) {
            newErrors.SKU = 'SKU is required';
        }

        // Description validation
        if (!formData.get('description').trim()) {
            newErrors.description = 'Description is required';
        }

        // Specs validation
        if (!formData.get('spec').trim()) {
            newErrors.spec = 'Specifications are required';
        }

        if (!formData.get('SubHeadings').trim()) {
          newErrors.SubHeadings = 'SubHeadings are required';
      }

      

      if (!formData.get('subHeadingdescription').trim()) {
        newErrors.subHeadingdescription = 'subHeadingdescription are required';
    }
     
        return newErrors;
    };

    const handleSubmit=async(event)=>{
        event.preventDefault()
        const formData = new FormData(event.target);
        console.log(formData.get('variant'))
        // Validate form
        const formErrors = validateForm(formData);
        console.log(formErrors)
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            toast.error('Please fill the form');
            return;
        }
        setErrors({});
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
            
           
            const spec=data.get('spec')
            const specArray=spec.split('>').map((item)=>item.trim()).filter((item)=>item.length>0)
            // console.log(specArray)

            const subHeading=data.get('SubHeadings')
            const subHeadArray=subHeading.split('>').map((item)=>item.trim()).filter((item)=>item.length>0)
            console.log(subHeadArray)

            const subHeadingdescription=data.get('subHeadingdescription')
            const subHeadingDescriptionArray=subHeadingdescription.split('>').map((item)=>item.trim()).filter((item)=>item.length>0)
            console.log(subHeadingDescriptionArray)

            const variantsData=data.get('SubHeadings')
            const variantsArray=variantsData.split('>').map((item)=>item.trim()).filter((item)=>item.length>0)
            console.log(variantsArray)
          
            const productDetails={
                name:data.get('title'),
                price:data.get('price'),
                quantity:data.get('quantity'),
                categoryId:selectedCategoryId,
                sku:data.get('SKU'),
                description:data.get('description'),
                status:data.get('stockStatus'),
                imageUrl:imageUrls,
                specAndDetails:specArray,
                subHead:subHeadArray,
                subHeadDescription:subHeadingDescriptionArray,
                variant:variantsArray
            }
         
            try {
                console.log(productDetails)
                const uploadProduct=await axios.post('/addProduct',productDetails)
              
                console.log(uploadProduct)
                toast.success(uploadProduct.data.message)
                navigate('/showProduct')
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

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = () => {
        const newImageUrls = [...imageUrl];
        newImageUrls[currentImageIndex] = currentImage;
        setImageUrl(newImageUrls);
        setCropModalOpen(false);
        setCurrentImage(null);
      
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
    };

    const handleCropCancel = () => {
        setCropModalOpen(false);
        setCurrentImage(null);
        setImage(image.slice(0, -1));
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
                  className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
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
                  className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
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
                  className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.quantity ? 'border-red-500' : ''}`}
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
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
                  className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.SKU ? 'border-red-500' : ''}`}
                />
                {errors.SKU && <p className="text-red-500 text-sm">{errors.SKU}</p>}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex justify-start"
            >
              <button
                type="button"
                onClick={() => setIsVariantModalOpen(true)}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Add Varient
              </button>
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
                  name='SubHeadings'
                  className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.SKU ? 'border-red-500' : ''}`}
                />
               {errors.SubHeadings && <p className="text-red-500 text-sm">{errors.SubHeadings}</p>}
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
                name='subHeadingdescription'
                className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.description ? 'border-red-500' : ''}`}
              ></textarea>
              {errors.subHeadingdescription && <p className="text-red-500 text-sm">{errors.subHeadingdescription}</p>}
            </motion.div>

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
                className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.description ? 'border-red-500' : ''}`}
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
                className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black ${errors.spec ? 'border-red-500' : ''}`}
              ></textarea>
              {errors.spec && <p className="text-red-500 text-sm">{errors.spec}</p>}
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
      {isLoading&&
            <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50'>
                <MutatingDots
                    height="100"
                    width="100"
                    color="#ee3a24"
                    secondaryColor= '#ee3a24'
                    radius='12.5'
                    ariaLabel="mutating-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>}
      {/* Variant Modal */}
      {isVariantModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Variant</h2>
              <button
                onClick={() => setIsVariantModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <ProductForm />
          </div>
        </div>
      )}
      {cropModalOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
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
    </div>
  );
};

export default ProductManagement;
