

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import axios from '../axios/userAxios';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from 'react-router-dom';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const DynamicCarousel = (props) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const productSelected = localStorage.getItem('selectedProduct');
        if (!productSelected) {
          throw new Error('No product selected');
        }
        const produc = JSON.parse(productSelected);
        const id = produc[0]?.categoryId?._id;
        if (!id) {
          throw new Error('Category ID not found');
        }

        const response = await axios.get(`/relatedProducts/${id}`);
        setItems(response.data.relatedProducts);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch related products: ${err.message}`);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const imageIndex = items.length ? Math.abs(page % items.length) : 0;

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (isAutoPlaying && items.length > 0) {
      const timer = setTimeout(() => paginate(1), 5000);
      return () => clearTimeout(timer);
    }
  }, [page, isAutoPlaying, items]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading related products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-8 text-white">No related products to display</div>;
  }

  const handleLearnMore=(item)=>{
    
    const productId=item._id
    if(productId)
    {
      const productId=item._id
      navigate(`/productDetails/${productId}`)
    }else{
      console.log('no id found in carousal',error)
    }
   
 
  }

  return (
    <div className="w-full bg-[#2b2b2b] py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">YOU MAY ALSO LIKE</h2>
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full"
            >
              <Card className="border-none bg-[#1a1a1a] h-[400px] overflow-hidden">
                <CardContent className="p-6 h-full">
                  <div className="flex flex-col md:flex-row gap-6 h-full">
                    <div className="md:w-1/2 h-full">
                      <img
                        src={items[imageIndex].productImg[0]}
                        alt={items[imageIndex].title}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="md:w-1/2 flex flex-col justify-between h-full">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {items[imageIndex].categoryId.categoryName}
                        </Badge>
                        <h3 className="text-2xl font-bold mb-2 text-white">{items[imageIndex].title}</h3>
                        <p className="text-gray-400 mb-4">{items[imageIndex].description.slice(0, 100)}...</p>
                        <p className="text-xl font-bold mb-4 text-white">₹{items[imageIndex].price}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">SKU: {items[imageIndex].sku}</p>
                        <Button onClick={()=> handleLearnMore(items[imageIndex])} className="bg-blue-600 hover:bg-blue-700 text-white">View Product</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
          <div className="absolute z-10 flex justify-between w-full top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full ml-4 bg-white/10 hover:bg-white/20 text-white"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full mr-4 bg-white/10 hover:bg-white/20 text-white"
              onClick={() => paginate(1)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-4 right-4 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={toggleAutoPlay}
          >
            {isAutoPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DynamicCarousel;

