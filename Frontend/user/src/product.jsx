// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// const Product = () => {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isSpecsOpen, setIsSpecsOpen] = useState(false);
//   const [isBoxOpen, setIsBoxOpen] = useState(false);
//   const [isSupportOpen, setIsSupportOpen] = useState(false);

//   const product = {
//     series: 'G SERIES',
//     name: 'G515 TKL',
//     subtitle: 'Wired Gaming Keyboard',
//     description: 'Logitech G515 TKL wired tenkeyless gaming keyboard offers high performance and low-profile aesthetic. Personalize your play with gear that is engineered to hold up to intense moments of play and designed for a finely-tuned gaming experience.',
//     images: [
//       '/keyboard-front.jpg',
//       '/keyboard-angle.jpg',
//       '/keyboard-side.jpg',
//       '/keyboard-back.jpg',
//       '/keyboard-rgb.jpg',
//       '/keyboard-detail.jpg'
//     ],
//     specs: {
//       'Switch Type': 'Mechanical GX',
//       'Form Factor': 'Tenkeyless (TKL)',
//       'Connectivity': 'USB-C to USB-A',
//       'Backlighting': 'Per-key RGB',
//       'Battery Life': 'N/A (Wired)',
//       'Weight': '615g'
//     }
//   };

//   return (
//     <div className="bg-black min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 py-8 bg-[#000000]">
//         {/* Breadcrumb */}
//         <div className="text-gray-400 text-sm mb-8">
//           <span className="hover:text-white cursor-pointer">Products</span>
//           <span className="mx-2">/</span>
//           <span className="hover:text-white cursor-pointer">Gaming Keyboards</span>
//           <span className="mx-2">/</span>
//           <span className="text-white">{product.name}</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Left Column - Images */}
//           <div>
//             <motion.div
//               className="bg-[#1b1b1b] rounded-lg p-6 mb-4"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               <img
//                 src={product.images[selectedImage]}
//                 alt={product.name}
//                 className="w-full h-auto"
//               />
//             </motion.div>
            
//             {/* Thumbnail Grid */}
//             <div className="grid grid-cols-6 gap-2">
//               {product.images.map((img, index) => (
//                 <motion.div
//                   key={index}
//                   className={`cursor-pointer rounded-md overflow-hidden border-2 ${
//                     selectedImage === index ? 'border-[#8b5cf6]' : 'border-transparent'
//                   }`}
//                   whileHover={{ scale: 1.05 }}
//                   onClick={() => setSelectedImage(index)}
//                 >
//                   <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-auto" />
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           {/* Right Column - Product Details */}
//           <div>
//             <div className="bg-[#1b1b1b] rounded-lg p-8">
//               <span className="text-sm text-[#8b5cf6] font-medium">{product.series}</span>
//               <h1 className="text-4xl font-bold text-white mt-2 mb-1">{product.name}</h1>
//               <h2 className="text-xl text-gray-400 mb-6">{product.subtitle}</h2>
              
//               <p className="text-gray-300 mb-8">{product.description}</p>

//               {/* Specs & Details Accordion */}
//               <div className="border-t border-[#3d3d3d] py-4">
//                 <button
//                   className="w-full flex justify-between items-center text-white"
//                   onClick={() => setIsSpecsOpen(!isSpecsOpen)}
//                 >
//                   <span className="text-lg font-medium">SPECS & DETAILS</span>
//                   <span className="text-2xl">{isSpecsOpen ? '-' : '+'}</span>
//                 </button>
//                 {isSpecsOpen && (
//                   <div className="mt-4 space-y-4">
//                     {Object.entries(product.specs).map(([key, value]) => (
//                       <div key={key} className="flex justify-between">
//                         <span className="text-gray-400">{key}</span>
//                         <span className="text-white">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* In The Box Accordion */}
//               <div className="border-t border-[#3d3d3d] py-4">
//                 <button
//                   className="w-full flex justify-between items-center text-white"
//                   onClick={() => setIsBoxOpen(!isBoxOpen)}
//                 >
//                   <span className="text-lg font-medium">IN THE BOX</span>
//                   <span className="text-2xl">{isBoxOpen ? '-' : '+'}</span>
//                 </button>
//                 {isBoxOpen && (
//                   <ul className="mt-4 text-gray-300 list-disc list-inside">
//                     <li>G515 TKL Gaming Keyboard</li>
//                     <li>USB-C to USB-A Cable</li>
//                     <li>User Documentation</li>
//                     <li>2-year Limited Hardware Warranty</li>
//                   </ul>
//                 )}
//               </div>

//               {/* Support Accordion */}
//               <div className="border-t border-[#3d3d3d] py-4">
//                 <button
//                   className="w-full flex justify-between items-center text-white"
//                   onClick={() => setIsSupportOpen(!isSupportOpen)}
//                 >
//                   <span className="text-lg font-medium">SUPPORT</span>
//                   <span className="text-2xl">{isSupportOpen ? '-' : '+'}</span>
//                 </button>
//                 {isSupportOpen && (
//                   <div className="mt-4 space-y-4 text-gray-300">
//                     <p>Need help with your G515 TKL?</p>
//                     <button className="text-[#8b5cf6] hover:underline">
//                       Download Support Software
//                     </button>
//                     <button className="text-[#8b5cf6] hover:underline">
//                       View Online Manual
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Product;

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Search, User } from 'lucide-react'

const ProductDetails = () => {
  const [activeImage, setActiveImage] = useState(0)
  const [activeSection, setActiveSection] = useState(null)

  const images = [
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
  ]

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <img
                src="/placeholder.svg?height=40&width=120"
                alt="Logitech G"
                className="w-auto h-8"
              />
              <div className="hidden md:flex space-x-6">
                <button className="text-gray-300 hover:text-white">SHOP</button>
                <button className="text-gray-300 hover:text-white">DISCOVER</button>
                <button className="text-gray-300 hover:text-white">SOFTWARE</button>
                <button className="text-gray-300 hover:text-white">SUPPORT</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800 text-white px-4 py-1 rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <User className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Products</span>
          <ChevronRight className="w-4 h-4" />
          <span>Gaming Keyboards</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">G515 TKL</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-[#2d2d2d] rounded-lg p-8 mb-4">
              <img
                src={images[activeImage]}
                alt="G515 TKL Keyboard"
                className="w-full h-auto"
              />
            </div>
            <div className="grid grid-cols-6 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
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
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              G SERIES
            </div>
            <h1 className="text-4xl font-bold mb-4">G515 TKL</h1>
            <h2 className="text-xl text-gray-400 mb-6">Wired Gaming Keyboard</h2>
            <p className="text-gray-300 mb-8">
              Logitech G515 TKL wired tenkeyless gaming keyboard offers high performance and low-profile aesthetic. 
              Personalize your play with gear that is engineered to hold up to intense moments of play and designed 
              for a finely-tuned gaming experience.
            </p>

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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails

