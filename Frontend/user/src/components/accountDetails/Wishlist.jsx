import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart } from 'lucide-react';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      image: '/placeholder.svg?height=120&width=120',
      inStock: true,
      price: 129.99,
    },
    {
      id: 2,
      name: 'Smart Watch',
      image: '/placeholder.svg?height=120&width=120',
      inStock: false,
      price: 199.99,
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      image: '/placeholder.svg?height=120&width=120',
      inStock: true,
      price: 79.99,
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    console.log(`Added ${item.name} to cart`);
    // Implement your add to cart logic here
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
          {wishlistItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden"
            >
              <div className="flex items-center p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md mr-6"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-black mb-1">{item.name}</h2>
                  <p className="text-gray-600 text-lg">${item.price.toFixed(2)}</p>
                  <p className={`text-sm mt-1 ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(item)}
                    className={`bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 ${!item.inStock && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!item.inStock}
                  >
                    <ShoppingCart size={18} />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {wishlistItems.length === 0 && (
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

