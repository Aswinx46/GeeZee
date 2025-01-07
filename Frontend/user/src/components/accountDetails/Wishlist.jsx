import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart } from 'lucide-react';
import axios from '../../axios/userAxios'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Wishlist = () => {

  const user = useSelector(state => state.user.user)
  const [wishlist, setWishlist] = useState([])
  const [update, setUpdate] = useState(false)
  const userId = user?._id
  const navigate = useNavigate()
  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get(`/getWishlist/${user?._id}`)
        const neededDetails = response.data.wishilst.product.map((product) => {
          return { ...product, variants: product.productId.variants[0] }
        })
        setWishlist(neededDetails)
      } catch (error) {
        console.log('error while fetching the data', error)
      }
    }
    fetchData()
  }, [update])


  const removeFromWishlist = async (item) => {
    try {
      const response = await axios.patch(`removeFromWishlist/${userId}`, { item })
      toast.success(response.data.message)
      setUpdate(!update)
    } catch (error) {
      console.log('error while removing item from the wishlist', error)
      toast.error('error while removing item from the wishlist')
    }
  };

  const handleAddToCart = async (item) => {

    try {


      const selectedVariantId = item.productId.variants[0]._id
      const quantity = 1
      const uploadToCart = await axios.post('/cart', { userId: userId, productId: item.productId._id, selectedVariantId: selectedVariantId, quantity })
      toast.success(uploadToCart.data.message)
    } catch (error) {
      console.log(error)
      console.log('error in adding to the cart')

      toast.error(error.response.data.message)
    }

  };

  return (
    <div className="min-h-screen bg-white p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Wishlist</h1>
          <Heart className="text-white" size={24} />
        </div>
        <AnimatePresence>
          {wishlist.map((item) => (
            <motion.div
              key={item.productId?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden"
            >
              <div className="flex items-center p-4">
                <img
                  src={item.productId?.productImg[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md mr-6"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-black mb-1">{item.productId.title}</h2>
                  <p className="text-gray-600 text-lg">₹{item.productId?.variants[0]?.price.toFixed(2)}</p>
                  <p className={`text-sm mt-1 ${item.productId?.variants[0]?.stock ? 'text-green-600' : 'text-red-600'}`}>
                    {item.productId?.variants[0]?.stock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(item)}
                    className={`bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 ${!item.productId.variants[0].stock && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!item.productId.variants[0].stock}
                  >
                    <ShoppingCart size={18} />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeFromWishlist(item)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {wishlist.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white mt-8"
          >
            <Heart className="mx-auto mb-4" size={48} />
            <p className="text-xl">Your wishlist is empty.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Wishlist;

