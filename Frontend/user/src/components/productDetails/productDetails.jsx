// import { motion, AnimatePresence } from 'framer-motion';
// import { useEffect, useState } from 'react';

// const ProductDetails = () => {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [product, setProduct] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [scale, setScale] = useState(1);
//   const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
//   const[review,setReview]=useState('')

//   useEffect(() => {
//     const productSelected = localStorage.getItem('selectedProduct');
//     const produc = productSelected ? JSON.parse(productSelected) : [];
//     console.log(produc)
//     const single = produc[0];
//     setProduct(single);
//   }, []);

//   const handleZoomIn = () => {
//     setScale(prev => Math.min(prev + 0.5, 4));
//   };

//   const handleZoomOut = () => {
//     setScale(prev => Math.max(prev - 0.5, 1));
//   };

//   const handleDoubleClick = () => {
//     setScale(scale === 1 ? 2.5 : 1);
//     if (scale === 1) {
//       setDragPosition({ x: 0, y: 0 });
//     }
//   };

//   const handleDragEnd = (event, info) => {
//     setDragPosition({
//       x: dragPosition.x + info.offset.x,
//       y: dragPosition.y + info.offset.y
//     });
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen bg-black text-white"
//     >
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="container mx-auto px-4 py-8"
//       >
//         <div className="grid md:grid-cols-2 gap-12">
//           {/* Product Images */}
//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="rounded-lg p-8 mb-4">
//               <motion.img
//                 src={product?.productImg[0]}
//                 alt="G515 TKL Keyboard"
//                 className="w-full h-[500px] w-50 object-cover"
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               />
//             </div>
//             <div className="grid grid-cols-6 gap-2">
//               {product?.productImg?.map((image, index) => (
//                 <motion.button
//                   key={index}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                   transition={{ type: "spring", stiffness: 400 }}
//                   onClick={() => setSelectedImage(index)}
//                   className={`border-2 rounded-lg overflow-hidden ${
//                     selectedImage === index ? 'border-blue-500' : 'border-transparent'
//                   }`}
//                 >
//                   <img
//                     src={image}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-auto"
//                   />
//                 </motion.button>
//               ))}
//             </div>
//           </motion.div>

//           {/* Product Info */}
//           <motion.div
//             initial={{ x: 20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.h1 
//               initial={{ y: -20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               className="text-4xl font-bold mb-4"
//             >
//               {product?.title}
//             </motion.h1>
//             <h2 className="text-xl text-gray-400 mb-6">{product?.categoryId?.categoryName}</h2>
//             <p className="text-gray-300 mb-8">
//               {product?.description}
//             </p>

//             {/* Add to Cart and Buy Now Buttons */}
//             <div className="space-y-4 mb-8">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                 className="w-full py-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
//                 </svg>
//                 <span>Add to Cart</span>
//               </motion.button>
              
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                 className="w-full py-4 bg-[#521166] text-white rounded-lg font-medium hover:bg-[#3d0d4d] transition-colors flex items-center justify-center space-x-2"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
//                 </svg>
//                 <span>Buy Now</span>
//               </motion.button>
//             </div>

//             {/* Expandable Sections */}
//             <div className="space-y-4">
//               <motion.div className="border-t border-gray-800">
//                 <button
//                   onClick={() => toggleSection('specs')}
//                   className="w-full py-4 flex justify-between items-center text-left"
//                 >
//                   <span className="font-medium">SPECS & DETAILS</span>
//                   <ChevronDown
//                     className={`w-5 h-5 transition-transform ${
//                       activeSection === 'specs' ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>
//                 {activeSection === 'specs' && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     className="pb-4 text-gray-400"
//                   >
//                     <ul className="space-y-2">
//                       <li>Tenkeyless Form Factor</li>
//                       <li>RGB Backlit Keys</li>
//                       <li>Mechanical Switches</li>
//                       <li>USB-C Connection</li>
//                       <li>Anti-Ghosting</li>
//                     </ul>
//                   </motion.div>
//                 )}
//               </motion.div>

//               <motion.div className="border-t border-gray-800">
//                 <button
//                   onClick={() => toggleSection('box')}
//                   className="w-full py-4 flex justify-between items-center text-left"
//                 >
//                   <span className="font-medium">IN THE BOX</span>
//                   <ChevronDown
//                     className={`w-5 h-5 transition-transform ${
//                       activeSection === 'box' ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>
//                 {activeSection === 'box' && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     className="pb-4 text-gray-400"
//                   >
//                     <ul className="space-y-2">
//                       <li>G515 TKL Gaming Keyboard</li>
//                       <li>USB-C Cable</li>
//                       <li>User Documentation</li>
//                       <li>2-Year Limited Hardware Warranty</li>
//                     </ul>
//                   </motion.div>
//                 )}
//               </motion.div>

//               <motion.div className="border-t border-gray-800">
//                 <button
//                   onClick={() => toggleSection('support')}
//                   className="w-full py-4 flex justify-between items-center text-left"
//                 >
//                   <span className="font-medium">SUPPORT</span>
//                   <ChevronDown
//                     className={`w-5 h-5 transition-transform ${
//                       activeSection === 'support' ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>
//                 {activeSection === 'support' && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     className="pb-4 text-gray-400"
//                   >
//                     <ul className="space-y-2">
//                       <li>Specifications</li>
//                       <li>Setup Guide</li>
//                       <li>Downloads</li>
//                       <li>Community Forums</li>
//                       <li>Warranty Information</li>
//                     </ul>
//                   </motion.div>
//                 )}
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ProductDetails;
import React, { useState,useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Search, User } from 'lucide-react'
import axios from '../../axios/userAxios'
const ProductDetails = () => {
  const [activeImage, setActiveImage] = useState(0)
  const [activeSection, setActiveSection] = useState(null)


  const features = [
    { title: "chandran", description: "Good Keyboard" },
    { title: "Arjun", description: "Good laptop worth it" },
    { title: "Aswin", description: "Good Gaming Chair" },
    { title: "Athul", description: "Good quality cabinets" }
  ];

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const [selectedImage, setSelectedImage] = useState(0);
  const productSelected = localStorage.getItem('selectedProduct');
  const produc = productSelected ? JSON.parse(productSelected) : [];
  const single = produc[0];
  const [product, setProduct] = useState(single);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const[review,setReview]=useState('')
  const[products,setProducts]=useState([])

  useEffect(() => {
    const productSelected = localStorage.getItem('selectedProduct');
    const produc = productSelected ? JSON.parse(productSelected) : [];
    const single = produc[0];
    const fetchProduct=async () => {
      
      const productsResponse = await axios.get('/products')
      setProducts(productsResponse.data.products)
    }
    fetchProduct()
    console.log(single)
    setProduct(single);
  }, []);
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-lg p-8 mb-4">
              <motion.img
                src={product?.productImg[activeImage]}
                alt="G515 TKL Keyboard"
                className="w-full h-[500px] w-50 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "tween", duration: 0.5 }}
              />
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product?.productImg?.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  onClick={() => setActiveImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    activeImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-auto"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              {product?.title}
            </motion.h1>
            <h2 className="text-xl text-gray-400 mb-6">{product?.categoryId?.categoryName}</h2>
            <p className="text-gray-300 mb-8">
              {product?.description}
            </p>

            {/* Add to Cart and Buy Now Buttons */}
            <div className="space-y-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full py-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span>Add to Cart</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full py-4 bg-[#521166] text-white rounded-lg font-medium hover:bg-[#3d0d4d] transition-colors flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                <span>Buy Now</span>
              </motion.button>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              <motion.div className="border-t border-gray-800">
                <button
                  onClick={() => toggleSection('specs')}
                  className="w-full py-4 flex justify-between items-center text-left"
                >
                  <span className="font-medium">SPECS & DETAILS</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      activeSection === 'specs' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeSection === 'specs' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-4 text-gray-400"
                  >
                    <ul className="space-y-2">
                      <li>Tenkeyless Form Factor</li>
                      <li>RGB Backlit Keys</li>
                      <li>Mechanical Switches</li>
                      <li>USB-C Connection</li>
                      <li>Anti-Ghosting</li>
                    </ul>
                  </motion.div>
                )}
              </motion.div>

              <motion.div className="border-t border-gray-800">
                <button
                  onClick={() => toggleSection('box')}
                  className="w-full py-4 flex justify-between items-center text-left"
                >
                  <span className="font-medium">IN THE BOX</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      activeSection === 'box' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeSection === 'box' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-4 text-gray-400"
                  >
                    <ul className="space-y-2">
                      <li>G515 TKL Gaming Keyboard</li>
                      <li>USB-C Cable</li>
                      <li>User Documentation</li>
                      <li>2-Year Limited Hardware Warranty</li>
                    </ul>
                  </motion.div>
                )}
              </motion.div>

              <motion.div className="border-t border-gray-800">
                <button
                  onClick={() => toggleSection('support')}
                  className="w-full py-4 flex justify-between items-center text-left"
                >
                  <span className="font-medium">SUPPORT</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      activeSection === 'support' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeSection === 'support' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-4 text-gray-400"
                  >
                    <ul className="space-y-2">
                      <li>Specifications</li>
                      <li>Setup Guide</li>
                      <li>Downloads</li>
                      <li>Community Forums</li>
                      <li>Warranty Information</li>
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
     
    {/* Review Section */}
    <div className="w-full bg-black px-4 py-16">
      <div className="max-w-8xl mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Customer Reviews</h2>
            <div className="flex items-center">
              <span className="text-xl font-semibold mr-2">5.00</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-400">Based on 2 reviews</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-white text-black rounded-md font-medium"
          >
            Write a review
          </motion.button>
        </div>

        <div className="space-y-4 mb-8">
          {/* Rating Bars */}
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <div className="flex items-center w-24">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex-1 h-2 mx-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: rating === 5 ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-yellow-400"
                />
              </div>
              <span className="text-sm text-gray-400 w-8">{rating === 5 ? '2' : '0'}</span>
            </div>
          ))}
        </div>

        {/* Reviews List */}
         <div className="overflow-hidden relative w-full">
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          duration: features.length * 15, // Adjust the duration based on the number of features
          ease: "linear",
          repeat: Infinity,
        }}
      >
      
        {[...features, ...features].map((feature, index) => (
          <motion.div
            key={index}
            className="min-w-[450px] p-6 bg-[#521166] my-10 text-gray-50 rounded-lg text-left mx-4   hover:shadow-[0_0_20px_1px_rgba(256,256,256,0.3)]"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-left">{feature.title}</h3>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-200 text-left">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
        {/* <div className="space-y-6">
          <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <span className="font-semibold text-white mr-2">Arjun</span>
                <span className="px-2 py-1 text-xs bg-gray-800 text-white rounded">Verified</span>
              </div>
              <span className="text-sm text-gray-400">10/24/2024</span>
            </div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-white">Nice Keyboard</p>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <span className="font-semibold text-white mr-2">Chandran</span>
                <span className="px-2 py-1 text-xs bg-gray-800 text-white rounded">Verified</span>
              </div>
              <span className="text-sm text-gray-400">10/03/2024</span>
            </div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-white">Perfect</p>
            <p className="text-gray-400 mt-1">The clicking sound of this keyboard is perfect, I think its because of its Blue Switches</p>
          </div>
        </div> */}
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...products].map((product, index) => (
            <motion.div
              key={index}
              className="w-full"
            >
              <div className="bg-black rounded-md shadow-md overflow-hidden h-full border border-[#white]">
                <div className="relative pt-[60%]">
                  <img
                    src={product.productImg[0]}
                    alt={product.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold mb-2 line-clamp-2 text-white">{product.title}</h3>
                  <p className="text-lg font-bold text-[#8b5cf6] mb-2">₹{product.price}</p>
                  <button onClick={() => handleDeal(index)} className="w-full bg-[#8b5cf6] text-white px-3 py-1.5 rounded-full hover:bg-[#7c3aed] transition-all text-sm font-semibold">
                    View Deal
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </motion.div>
  )
}

export default ProductDetails