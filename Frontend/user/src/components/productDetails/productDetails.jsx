import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const[review,setReview]=useState('')

  useEffect(() => {
    const productSelected = localStorage.getItem('selectedProduct');
    const produc = productSelected ? JSON.parse(productSelected) : [];
    const single = produc[0];
    setProduct(single);
  }, []);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleDoubleClick = () => {
    setScale(scale === 1 ? 2.5 : 1);
    if (scale === 1) {
      setDragPosition({ x: 0, y: 0 });
    }
  };

  const handleDragEnd = (event, info) => {
    setDragPosition({
      x: dragPosition.x + info.offset.x,
      y: dragPosition.y + info.offset.y
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Product Images */}
        <div className="space-y-4">
          {/* Main Product Image */}
          <motion.div
            layoutId="main-image"
            className="bg-white rounded-lg p-4"
          >
            {product.productImg?.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`${index !== 0 ? 'mt-4' : ''} relative overflow-hidden rounded-lg cursor-zoom-in`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedImage(index);
                  setIsModalOpen(true);
                  setScale(1);
                  setDragPosition({ x: 0, y: 0 });
                }}
              >
                <img
                  src={img}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-auto object-contain"
                />
              </motion.div>
            ))}
          </motion.div>

  
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-auto space-y-6 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          
          {/* Price and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-red-600">{product.price}</span>
                <span className="text-xl text-gray-800 line-through">50000.</span>
              </div>
              <div className="flex items-center">
                <span className='text-black'>30</span>
                
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-black text-white rounded-md font-medium"
            >
              Add to Cart
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-red-600 text-white rounded-md font-medium mt-2 hover:bg-red-700 transition-colors"
            >
              Buy Now
            </motion.button>

            {/* Detailed Description */}
            <div>

            <span className='text-2xl text-green-600 font-bold my-6' > In stock : {product.availableQuantity}</span>
            </div>
            <div className="prose prose-sm max-w-none mt-6">
              <p className="text-gray-700 leading-relaxed">
                  {product.description}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-purple-600 text-white rounded-md font-medium mt-4 hover:bg-purple-700 transition-colors"
                onClick={() => setIsReviewModalOpen(true)}
                onChange={(e)=>setReview(e.target.value)}
              >
                Add a Review
              </motion.button>
            </div>

            {/* Specifications Grid */}
            {/* <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Switch Type:</span>
                    <p className="font-medium">Outemu Blue</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Layout:</span>
                    <p className="font-medium">TKL (87 Keys)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Backlight:</span>
                    <p className="font-medium">RGB</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Connection:</span>
                    <p className="font-medium">USB-C</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {/* Review 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="user avatar"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold">John Doe</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">2 days ago</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">Great product! The quality is excellent and it arrived earlier than expected. Would definitely recommend to others.</p>
          </div>

          {/* Review 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                alt="user avatar"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold">Sarah Smith</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">1 week ago</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">Very satisfied with my purchase. The product meets all my expectations and the customer service was excellent.</p>
          </div>

          {/* Review 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
                alt="user avatar"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold">Mike Johnson</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">2 weeks ago</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">Absolutely love it! The quality is top-notch and it's exactly what I was looking for. Fast shipping too!</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src="/path-to-related-product.jpg"
                  alt={`Related product ${item}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium">Related Product {item}</h3>
                <p className="text-sm text-gray-500 mt-1">$59.99</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write your review here..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
            onClick={() => {
              setIsModalOpen(false);
              setScale(1);
              setDragPosition({ x: 0, y: 0 });
            }}
          >
            <motion.div
              className="relative max-w-4xl mx-auto p-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-6 right-6 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors z-50"
                onClick={() => {
                  setIsModalOpen(false);
                  setScale(1);
                  setDragPosition({ x: 0, y: 0 });
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Zoom controls */}
              <div className="absolute bottom-6 right-6 flex space-x-2 z-50">
                <button
                  className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
                  onClick={handleZoomOut}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm flex items-center">
                  {Math.round(scale * 100)}%
                </div>
                <button
                  className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
                  onClick={handleZoomIn}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Image container */}
              <motion.div
                drag={scale !== 1}
                dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                onDragEnd={handleDragEnd}
                style={{
                  scale,
                  x: dragPosition.x,
                  y: dragPosition.y,
                }}
                className="cursor-move"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src={product.productImg?.[selectedImage]}
                  alt={`Product view ${selectedImage + 1}`}
                  className="max-h-[80vh] w-auto object-contain select-none"
                  draggable="false"
                  onDoubleClick={handleDoubleClick}
                  title="Double-click to zoom"
                />
              </motion.div>

              {/* Zoom hint */}
              {scale === 1 && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                  Double-click to zoom
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetails;
