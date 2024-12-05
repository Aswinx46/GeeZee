// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
// } from "@/components/ui/carousel"

// import React, { useEffect } from 'react'
// import axios from '../axios/userAxios'



// function corouser(props) {
 
//    const id=props.id
//     useEffect(()=>{
//         const fetchProduct=async () => {
//             try {
                
//                 const relatedProducts=await axios.get(`/relatedProducts?id=${id}`)
//                 console.log(relatedProducts)
//             } catch (error) {
//                 console.log('error in fetching related products',error)
//             }
//         }
//         fetchProduct()
//     },[])
//     return (
//         <Carousel>
//             <CarouselContent className="-ml-2 md:-ml-4">
//                 <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
//                 <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
//                 <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
//             </CarouselContent>
//         </Carousel>
//     )
// }

// export default corouser
// import {

//     Carousel,

//     CarouselContent,

//     CarouselItem,

//     CarouselNext,

//     CarouselPrevious,

// } from "@/components/ui/carousel"



// import React, { useEffect } from 'react'

// import axios from '../axios/userAxios'







// function corouser(props) {

 

//    const id=props.id

//     useEffect(()=>{

//         const fetchProduct=async () => {

//             try {

                

//                 const relatedProducts=await axios.get(`/relatedProducts?id=${id}`)

//                 console.log(relatedProducts)

//             } catch (error) {

//                 console.log('error in fetching related products',error)

//             }

//         }

//         fetchProduct()

//     },[])

//     return (

//         <Carousel>

//             <CarouselContent className="-ml-2 md:-ml-4">

//                 <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>

//                 <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>

//                 <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>

//             </CarouselContent>

//         </Carousel>

//     )

// }



// export default corouser
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import axios from '../axios/userAxios';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const DynamicCarousel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/carousel-items');
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch carousel items');
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
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-8">No items to display</div>;
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden bg-gray-900 rounded-xl">
      <AnimatePresence initial={false} custom={direction}>
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
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full h-full"
        >
          {items[imageIndex].type === 'image' && (
            <div className="relative w-full h-[400px]">
              <img
                src={items[imageIndex].content}
                alt={items[imageIndex].alt}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
                {items[imageIndex].caption}
              </div>
            </div>
          )}
          {items[imageIndex].type === 'text' && (
            <div className="flex items-center justify-center h-[400px] bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">{items[imageIndex].content}</h2>
                <p className="text-xl">{items[imageIndex].subtext}</p>
              </div>
            </div>
          )}
          {items[imageIndex].type === 'video' && (
            <div className="relative w-full h-[400px]">
              <video
                src={items[imageIndex].content}
                poster={items[imageIndex].poster}
                className="object-cover w-full h-full"
                autoPlay
                loop
                muted
              />
            </div>
          )}
          {items[imageIndex].type === 'quote' && (
            <div className="flex items-center justify-center h-[400px] bg-gradient-to-r from-green-400 to-blue-500 text-white p-8">
              <div className="text-center">
                <blockquote className="text-3xl italic mb-4">"{items[imageIndex].content}"</blockquote>
                <p className="text-xl">- {items[imageIndex].author}</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute z-10 flex justify-between w-full top-1/2 transform -translate-y-1/2">
        <button
          className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 mx-4 focus:outline-none"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 mx-4 focus:outline-none"
          onClick={() => paginate(1)}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <button
        className="absolute bottom-4 right-4 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none"
        onClick={toggleAutoPlay}
      >
        {isAutoPlaying ? (
          <Pause size={24} />
        ) : (
          <Play size={24} />
        )}
      </button>
    </div>
  );
};

export default DynamicCarousel;





