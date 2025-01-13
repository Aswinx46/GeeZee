import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import axios from '../../axios/userAxios'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from '@/extraAddonComponents/Pagination';
const ProductCard = ({ product, selectedProduct, setSelectedProduct }) => {
  const [isHovered, setIsHovered] = useState(false);
  



  const user = useSelector(state => state.user.user)
  const userId = user?._id

  const handleWishlilst = async () => {

    try {
      if (!userId) {
        toast.error('Please login to add product to wishlist')
        return
      }
      const response = await axios.post(`addProductWishlist/${userId}`, { product },)
      toast.success(response.data.message)
    } catch (error) {
      console.log('error while adding product in the wishlist', error)
      toast.error(error.response.data.message)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    sible: { opacity: 1, y: 0 },
    hover: { y: -10 }
  };

  const imageVariants = {
    hover: { scale: 1.1 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    hover: { opacity: 1 }
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };



  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <Card className="overflow-hidden bg-zinc-900 border-zinc-800 h-full">
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            variants={imageVariants}
            src={product.productImg[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {/* <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="p-3 rounded-full bg-[#39FF14] text-black"
            >
              <ShoppingCart size={20} />
            </motion.button> */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleWishlilst()}
              className="p-3 rounded-full bg-[#39FF14] text-black"
            >
              <Heart size={20} />
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="p-3 rounded-full bg-[#39FF14] text-black"
              onClick={() => setSelectedProduct(product)}
            >
              <Eye size={20} />
            </motion.button>
          </motion.div>
          {product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-[#39FF14] text-black">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">{product.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-[#39FF14] fill-current" />
                <span className="ml-1">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">({product.ratingCount})</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                {/* <p className="text-[#39FF14] font-bold text-lg">
                  ₹{product.variants[0].price}
                </p> */}
                {product.offerPrice ? <> <p className="text-[#39FF14] font-bold text-lg">₹{product.offerPrice}</p> <del className='text-red-600'> ₹{product.variants[0].price} </del> </> : <p className="text-[#39FF14] font-bold text-lg">₹{product.variants[0].price}</p>}
                {product.discount > 0 && (
                  <p className="text-sm text-gray-400 line-through">
                    ₹{Math.round(product.variants[0].price * (1 + product.discount / 100))}
                  </p>
                )}
              </div>
              {/* <Badge
                  className={`${
                    product.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge> */}
            </div>
          </motion.div>
        </CardContent>
      </Card>

    </motion.div>
  );
};
export default ProductCard