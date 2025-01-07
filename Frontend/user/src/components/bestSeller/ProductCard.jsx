import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Star, ShoppingCart, Eye } from 'lucide-react';
import axios from '../../axios/userAxios'
import ProductCard from './BestSeller';
import Filter from './Filter'
import Pagination from '@/extraAddonComponents/Pagination';

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/products/${currentPage}`)

      const neededItems = response.data.products.map((product) => {
        const variantPrice = product?.variants[0]?.price
        const categoryOfferPrice = product.categoryId?.categoryOffer?.offerType == 'percentage' ? variantPrice - variantPrice * product.categoryId?.categoryOffer?.offerValue / 100 : variantPrice - product.categoryId?.categoryOffer?.offerValue
        const productOfferPrice = product.productOffer?.offerType == 'percentage' ? variantPrice - variantPrice * product.productOffer?.offerValue / 100 : variantPrice - product.productOffer?.offerValue
        // const offerPrice = categoryOfferPrice > productOfferPrice ? categoryOfferPrice : productOfferPrice
        const offerPrice =
          Number.isNaN(categoryOfferPrice) ? productOfferPrice :
            Number.isNaN(productOfferPrice) ? categoryOfferPrice :
              Math.max(categoryOfferPrice, productOfferPrice);
        return { ...product, offerPrice }
      })
      setProducts(neededItems)
    }
    fetchData()
  }, [currentPage,isOpen])
  const navigate = useNavigate()
  const handleItem = (item) => {
  
    localStorage.setItem("selectedProduct", JSON.stringify([item]));
    navigate('/productDetails')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const detailsVariants = {
    hidden: {
      opacity: 0,
      x: 100
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  const onPageChange=(page)=>{
    setCurrentPage(page)
  }

  const filterIconVariants = {
    initial: { rotate: 0 },
    hover: {
      rotate: 90,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const handleFilter = () => {
    setIsOpen(true)
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Best Sellers</h1>
          <p className="text-gray-400 text-lg">Our most popular gaming gear</p>
          <motion.div
            className="relative ml-6 mt-8"
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <motion.button
              variants={buttonVariants}
              onClick={handleFilter}
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 shadow-lg shadow-[#39FF14]/20 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:border-[#39FF14]"
            >
              <motion.div
                variants={filterIconVariants}
                className="text-[#39FF14]"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
              <span>FILTER</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              className="w-12 h-12 border-4 border-[#39FF14] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} {...{ selectedProduct, setSelectedProduct }} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              variants={detailsVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-zinc-900 p-6 rounded-lg max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <motion.img
                    src={selectedProduct.productImg[0]}
                    alt={selectedProduct.title}
                    className="object-cover w-full h-full"
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="space-y-4">
                  <motion.h2
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {selectedProduct.title}
                  </motion.h2>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* <p className="text-[#39FF14] text-2xl font-bold">
                      ₹{selectedProduct.variants[0].price}
                    </p> */}
                    {selectedProduct.offerPrice ? <> <p className="text-lg font-bold text-[#8b5cf6] mb-2">₹{selectedProduct.offerPrice}</p> <del className='text-red-600'> ₹{selectedProduct.variants[0].price} </del> </> : <p className="text-lg font-bold text-[#8b5cf6] mb-2">₹{selectedProduct.variants[0].price}</p>}
                    {selectedProduct.discount > 0 && (
                      <Badge className="bg-[#39FF14] text-black">
                        {selectedProduct.discount}% OFF
                      </Badge>
                    )}
                  </motion.div>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-semibold">Key Features:</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {selectedProduct.description && (
                        <li>{selectedProduct.description}</li>
                      )}
                      {selectedProduct.variants[0].selectedAttributes &&
                        Object.entries(selectedProduct.variants[0].selectedAttributes).map(([key, value]) => (
                          <li key={key}>{`${key}: ${value}`}</li>
                        ))
                      }
                    </ul>
                  </motion.div>
                  <motion.div
                    className="pt-4 flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleItem(selectedProduct)}
                      className="w-full bg-[#39FF14] text-black py-3 px-6 rounded-lg font-semibold"
                    >
                      View Details
                    </motion.button>

                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
        )}
          <Pagination onPageChange={onPageChange} currentPage={currentPage} totalPages={totalPage}/>
        {isOpen && <Filter isOpen={isOpen} setIsOpen={setIsOpen} {...{ setProducts }} />}
      </AnimatePresence>
    </div>
  );
};

export default BestSeller;