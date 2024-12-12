

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MinimalQuantitySelector = ({ initialQuantity = 1, onQuantityChange,receiveQuantity }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const updateQuantity = (newQuantity) => {
    const updatedQuantity = Math.max(1, newQuantity);
    setQuantity(updatedQuantity);
    onQuantityChange(updatedQuantity);
    
  };
  useEffect(()=>{
    receiveQuantity(quantity)
  },[updateQuantity])

  return (
    <>

    <motion.div 
      className="flex items-center justify-between bg-black p-2 rounded-2xl border border-white w-[630px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      >
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-white w-8 h-8 flex items-center justify-center rounded-full focus:outline-none"
        onClick={() => updateQuantity(quantity - 1)}
      >
        -
      </motion.button>
      <div className="relative w-16 h-8 overflow-hidden">
        {/* <div className="absolute inset-0 flex items-center justify-start text-white text-xs">
          Quantity
        </div> */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span 
            key={quantity}
            initial={{ x: quantity > initialQuantity ? 20 : -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: quantity > initialQuantity ? -20 : 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center text-white text-lg font-medium"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-white w-8 h-8 flex items-center justify-center rounded-full focus:outline-none"
        onClick={() => updateQuantity(quantity + 1)}
        >
        +
      </motion.button>
    </motion.div>
          </>
  );
};

export default MinimalQuantitySelector;

