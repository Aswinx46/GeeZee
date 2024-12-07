
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
// import axios from '../axios/userAxios';

// const variants = {
//   enter: (direction) => ({
//     x: direction > 0 ? 1000 : -1000,
//     opacity: 0
//   }),
//   center: {
//     zIndex: 1,
//     x: 0,
//     opacity: 1
//   },
//   exit: (direction) => ({
//     zIndex: 0,
//     x: direction < 0 ? 1000 : -1000,
//     opacity: 0
//   })
// };

// const swipeConfidenceThreshold = 10000;
// const swipePower = (offset, velocity) => {
//   return Math.abs(offset) * velocity;
// };

// const DynamicCarousel = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [[page, direction], setPage] = useState([0, 0]);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const productSelected = localStorage.getItem('selectedProduct');
//         if (!productSelected) {
//           throw new Error('No product selected');
//         }
//         const produc = JSON.parse(productSelected);
//         const id = produc[0]?.categoryId?._id;
//         if (!id) {
//           throw new Error('Category ID not found');
//         }

//         const response = await axios.get(`/relatedProducts/${id}`);
//         setItems(response.data.relatedProducts);
//         console.log(response.data.relatedProducts);
//         setLoading(false);
//       } catch (err) {
//         setError(`Failed to fetch related products: ${err.message}`);
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   console.log(items);
//   const imageIndex = items.length ? Math.abs(page % items.length) : 0;

//   const paginate = (newDirection) => {
//     setPage([page + newDirection, newDirection]);
//   };

//   useEffect(() => {
//     if (isAutoPlaying && items.length > 0) {
//       const timer = setTimeout(() => paginate(1), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [page, isAutoPlaying, items]);

//   const toggleAutoPlay = () => {
//     setIsAutoPlaying(!isAutoPlaying);
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading related products...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-8 text-red-500">{error}</div>;
//   }

//   if (items.length === 0) {
//     return <div className="text-center py-8">No related products to display</div>;
//   }

//   return (
//     <div className="relative w-full max-w-3xl mx-auto overflow-hidden bg-gray-900 rounded-xl h-[400px]">
//       <AnimatePresence initial={false} custom={direction}>
//         <motion.div
//           key={page}
//           custom={direction}
//           variants={variants}
//           initial="enter"
//           animate="center"
//           exit="exit"
//           transition={{
//             x: { type: 'spring', stiffness: 300, damping: 30 },
//             opacity: { duration: 0.2 }
//           }}
//           drag="x"
//           dragConstraints={{ left: 0, right: 0 }}
//           dragElastic={1}
//           onDragEnd={(e, { offset, velocity }) => {
//             const swipe = swipePower(offset.x, velocity.x);

//             if (swipe < -swipeConfidenceThreshold) {
//               paginate(1);
//             } else if (swipe > swipeConfidenceThreshold) {
//               paginate(-1);
//             }
//           }}
//           className="absolute w-full h-full"
//         >
//           <div className="relative w-full h-full">
//             <img
//               src={items[imageIndex].productImg[0]}
//               alt={items[imageIndex].title}
//               className="object-cover w-full h-full"
//             />
//             <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
//               <h3 className="text-xl font-bold mb-2">{items[imageIndex].title}</h3>
//               <p className="text-lg mb-1">Price: ₹{items[imageIndex].price}</p>
//               <p className="text-sm">SKU: {items[imageIndex].sku}</p>
//             </div>
//           </div>
//         </motion.div>
//       </AnimatePresence>
//       <div className="absolute z-10 flex justify-between w-full top-1/2 transform -translate-y-1/2">
//         <button
//           className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 mx-4 focus:outline-none"
//           onClick={() => paginate(-1)}
//         >
//           <ChevronLeft size={24} />
//         </button>
//         <button
//           className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 mx-4 focus:outline-none"
//           onClick={() => paginate(1)}
//         >
//           <ChevronRight size={24} />
//         </button>
//       </div>
//       <button
//         className="absolute bottom-4 right-4 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none"
//         onClick={toggleAutoPlay}
//       >
//         {isAutoPlaying ? (
//           <Pause size={24} />
//         ) : (
//           <Play size={24} />
//         )}
//       </button>
//     </div>
//   );
// };

// export default DynamicCarousel;


// carousal 2

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
// import axios from '../axios/userAxios';
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// const variants = {
//   enter: (direction) => ({
//     x: direction > 0 ? 1000 : -1000,
//     opacity: 0
//   }),
//   center: {
//     zIndex: 1,
//     x: 0,
//     opacity: 1
//   },
//   exit: (direction) => ({
//     zIndex: 0,
//     x: direction < 0 ? 1000 : -1000,
//     opacity: 0
//   })
// };

// const swipeConfidenceThreshold = 10000;
// const swipePower = (offset, velocity) => {
//   return Math.abs(offset) * velocity;
// };

// const DynamicCarousel = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [[page, direction], setPage] = useState([0, 0]);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const productSelected = localStorage.getItem('selectedProduct');
//         if (!productSelected) {
//           throw new Error('No product selected');
//         }
//         const produc = JSON.parse(productSelected);
//         const id = produc[0]?.categoryId?._id;
//         if (!id) {
//           throw new Error('Category ID not found');
//         }

//         const response = await axios.get(`/relatedProducts/${id}`);
//         setItems(response.data.relatedProducts);
//         setLoading(false);
//       } catch (err) {
//         setError(`Failed to fetch related products: ${err.message}`);
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   const imageIndex = items.length ? Math.abs(page % items.length) : 0;

//   const paginate = (newDirection) => {
//     setPage([page + newDirection, newDirection]);
//   };

//   useEffect(() => {
//     if (isAutoPlaying && items.length > 0) {
//       const timer = setTimeout(() => paginate(1), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [page, isAutoPlaying, items]);

//   const toggleAutoPlay = () => {
//     setIsAutoPlaying(!isAutoPlaying);
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading related products...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-8 text-red-500">{error}</div>;
//   }

//   if (items.length === 0) {
//     return <div className="text-center py-8">No related products to display</div>;
//   }

//   return (
//     <div className="relative w-full max-w-4xl mx-auto overflow-hidden bg-background rounded-xl shadow-lg">
//       <AnimatePresence initial={false} custom={direction}>
//         <motion.div
//           key={page}
//           custom={direction}
//           variants={variants}
//           initial="enter"
//           animate="center"
//           exit="exit"
//           transition={{
//             x: { type: 'spring', stiffness: 300, damping: 30 },
//             opacity: { duration: 0.2 }
//           }}
//           drag="x"
//           dragConstraints={{ left: 0, right: 0 }}
//           dragElastic={1}
//           onDragEnd={(e, { offset, velocity }) => {
//             const swipe = swipePower(offset.x, velocity.x);

//             if (swipe < -swipeConfidenceThreshold) {
//               paginate(1);
//             } else if (swipe > swipeConfidenceThreshold) {
//               paginate(-1);
//             }
//           }}
//           className="w-full"
//         >
//           <Card className="border-none">
//             <CardContent className="p-6">
//               <div className="flex flex-col md:flex-row gap-6">
//                 <div className="md:w-1/2">
//                   <img
//                     src={items[imageIndex].productImg[0]}
//                     alt={items[imageIndex].title}
//                     className="w-full h-64 object-cover rounded-lg shadow-md"
//                   />
//                 </div>
//                 <div className="md:w-1/2 flex flex-col justify-between">
//                   <div>
//                     <Badge variant="secondary" className="mb-2">
//                       {items[imageIndex].categoryId.categoryName}
//                     </Badge>
//                     <h3 className="text-2xl font-bold mb-2">{items[imageIndex].title}</h3>
//                     <p className="text-muted-foreground mb-4">{items[imageIndex].description.slice(0, 100)}...</p>
//                     <p className="text-xl font-bold mb-4">₹{items[imageIndex].price}</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-sm text-muted-foreground">SKU: {items[imageIndex].sku}</p>
//                     <Button>View Product</Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </AnimatePresence>
//       <div className="absolute z-10 flex justify-between w-full top-1/2 transform -translate-y-1/2">
//         <Button
//           variant="outline"
//           size="icon"
//           className="rounded-full ml-4"
//           onClick={() => paginate(-1)}
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </Button>
//         <Button
//           variant="outline"
//           size="icon"
//           className="rounded-full mr-4"
//           onClick={() => paginate(1)}
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//       <Button
//         variant="outline"
//         size="icon"
//         className="absolute bottom-4 right-4 rounded-full"
//         onClick={toggleAutoPlay}
//       >
//         {isAutoPlaying ? (
//           <Pause className="h-4 w-4" />
//         ) : (
//           <Play className="h-4 w-4" />
//         )}
//       </Button>
//     </div>
//   );
// };

// export default DynamicCarousel;

// carousal 3


// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import axios from '../axios/userAxios';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// const variants = {
//   enter: (direction) => ({
//     x: direction > 0 ? '-100%' : '100%',
//     opacity: 0
//   }),
//   center: {
//     zIndex: 1,
//     x: 0,
//     opacity: 1
//   },
//   exit: (direction) => ({
//     zIndex: 0,
//     x: direction < 0 ? '-100%' : '100%',
//     opacity: 0
//   })
// };

// const ProductCarousel = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [[page, direction], setPage] = useState([0, 0]);
//   const [visibleItems, setVisibleItems] = useState(4);

//   useEffect(() => {
//     const updateVisibleItems = () => {
//       if (window.innerWidth < 640) setVisibleItems(1);
//       else if (window.innerWidth < 1024) setVisibleItems(2);
//       else if (window.innerWidth < 1280) setVisibleItems(3);
//       else setVisibleItems(4);
//     };

//     updateVisibleItems();
//     window.addEventListener('resize', updateVisibleItems);
//     return () => window.removeEventListener('resize', updateVisibleItems);
//   }, []);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const productSelected = localStorage.getItem('selectedProduct');
//         if (!productSelected) {
//           throw new Error('No product selected');
//         }
//         const produc = JSON.parse(productSelected);
//         const id = produc[0]?.categoryId?._id;
//         if (!id) {
//           throw new Error('Category ID not found');
//         }

//         const response = await axios.get(`/relatedProducts/${id}`);
//         setItems(response.data.relatedProducts);
//         setLoading(false);
//       } catch (err) {
//         setError(`Failed to fetch related products: ${err.message}`);
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   const paginate = (newDirection) => {
//     setPage([page + newDirection, newDirection]);
//   };

//   if (loading) {
//     return <div className="text-center py-8 text-white">Loading products...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-8 text-red-500">{error}</div>;
//   }

//   if (items.length === 0) {
//     return <div className="text-center py-8 text-white">No products to display</div>;
//   }

//   const currentIndex = ((page % items.length) + items.length) % items.length;
//   const visibleProducts = [...items, ...items].slice(currentIndex, currentIndex + visibleItems);

//   return (
//     <div className="w-full bg-[#2b2b2b] py-16">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-white mb-10 text-center">YOU MAY ALSO LIKE</h2>
        
//         <div className="relative">
//           <div className="overflow-hidden">
//             <motion.div
//               className="flex gap-6"
//               animate={{ x: `calc(-${currentIndex * 100}% / ${visibleItems})` }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             >
//               {visibleProducts.map((product, index) => (
//                 <motion.div
//                   key={index}
//                   className={`flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Card className="bg-[#1a1a1a] border-none hover:bg-[#252525] transition-colors duration-300">
//                     <CardContent className="p-4">
//                       <div className="aspect-[4/3] relative mb-4 overflow-hidden rounded-lg">
//                         <motion.img
//                           src={product.productImg[0]}
//                           alt={product.title}
//                           className="w-full h-full object-cover"
//                           whileHover={{ scale: 1.05 }}
//                           transition={{ duration: 0.3 }}
//                         />
//                       </div>
//                       <Badge variant="secondary" className="mb-2">
//                         {product.categoryId.categoryName}
//                       </Badge>
//                       <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
//                         {product.title}
//                       </h3>
//                       <p className="text-2xl font-bold text-white mb-4">
//                         ₹{product.price}
//                       </p>
//                       <Button 
//                         className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                         variant="secondary"
//                       >
//                         Learn More
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>

//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
//             onClick={() => paginate(-1)}
//           >
//             <ChevronLeft className="h-6 w-6 text-white" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
//             onClick={() => paginate(1)}
//           >
//             <ChevronRight className="h-6 w-6 text-white" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCarousel;

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
    console.log(item._id)
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

