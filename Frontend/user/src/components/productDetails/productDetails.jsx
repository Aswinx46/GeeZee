// export default ProductDetails;
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Search, User } from 'lucide-react'
import axios from '../../axios/userAxios'
import Corouser from '../../extraAddonComponents/corouser'
import sample from '../../assets/banner.jpg'
import { useNavigate, useParams } from 'react-router-dom'
import VariantSelector from '../productDetails/ProductVariant'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import QuantitySelector from '../quantitySelector/QuantitySelector'
import { incrementCounter } from '@/redux/slices/CartCounter'
const ProductDetails = () => {
  const [activeImage, setActiveImage] = useState(0)
  const [activeSection, setActiveSection] = useState(null)
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });


  const userData = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.token.token)

  const features = [
    { title: "chandran", description: "Good Keyboard" },
    { title: "Arjun", description: "Good laptop worth it" },
    { title: "Aswin", description: "Good Gaming Chair" },
    { title: "Athul", description: "Good quality cabinets" }
  ];

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const [selectedImage, setSelectedImage] = useState(0);
  const productSelected = localStorage.getItem('selectedProduct');
  const produc = productSelected ? JSON.parse(productSelected) : [];
  const single = produc[0];
  const [product, setProduct] = useState(single);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [review, setReview] = useState('')
  const [products, setProducts] = useState([])
  const [index, setIndex] = useState(0)
  const [quantity, setQuantity] = useState()
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    console.log('this is useEffect')
    const fetchProduct = async () => {
      console.log(id)
      if (!id) {
        console.log('this is the if case')
        const productSelected = localStorage.getItem('selectedProduct');
        console.log('this is the product selected', productSelected)
        const produc = productSelected ? JSON.parse(productSelected) : [];
        console.log(produc)
        const single = produc[0];
        console.log('this is single', single)



        const productOffer = single.productOffer
        const categoryOffer = single.categoryId?.categoryOffer
        const newVariants = single.variants.map((variant) => {
          const categoryOfferPrice = categoryOffer?.offerType == 'percentage' ? variant - variant.price * categoryOffer?.offerValue / 100 : variant.price - categoryOffer?.offerValue
          const productOfferPrice = productOffer?.offerType == 'percentage' ? variant - variant.price * productOffer?.offerValue / 100 : variant.price - productOffer?.offerValue
          console.log(categoryOfferPrice, productOfferPrice)
          return {...variant,offerPrice:categoryOfferPrice>productOfferPrice ? categoryOfferPrice : productOfferPrice}
          // const validPrices = [categoryOfferPrice, productOfferPrice].filter(price => !isNaN(price) && price >= 0);
          // const minOfferPrice = validPrices.length > 0 ? Math.min(...validPrices) : variant.price;
          // console.log('this is the minprice', minOfferPrice)
          // return { ...variant, offerPrice: minOfferPrice };
        })

        console.log('this is the needed', newVariants)


        setProduct({ ...single, variants: newVariants });
      
        console.log(single.variants)
      } else {
        console.log('this is the else case')
        const productsResponse = await axios.get('/products')
        console.log("re fetching")
        setProducts(productsResponse.data.products)
        const allProducts = productsResponse.data.products
        const selectedProduct = allProducts.find((item) => item._id == id)
        console.log(selectedProduct)
        setProduct(selectedProduct)
      }
    }
    fetchProduct()
  }, [id]);


  console.log("products", product)

  const handleDoubleClick = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) {

      const imageWidth = 500;
      const dragLimit = (imageWidth * (2 - 1)) / 2;
      setDragConstraints({
        top: -dragLimit,
        left: -dragLimit,
        right: dragLimit,
        bottom: dragLimit
      });
    } else {
      // Reset position when unzooming
      setPosition({ x: 0, y: 0 });
    }
  };

  const receiveIndex = (index) => {
    console.log(index)
    setIndex(index)
  }

  const handleCart = async () => {
    console.log(token)
    console.log(quantity)
    if (!token) {
      toast.warning('Please login to add product to the cart')
    }
    try {
      console.log('this is inside the try catcvh')
      const userId = userData._id
      const selectedProductId = product._id
      const selectedVariant = product.variants.find((_, i) => i == index)
      const selectedVariantId = selectedVariant._id
      console.log(selectedVariant._id)
      console.log(product._id)
      console.log(index)
      const uploadToCart = await axios.post('/cart', { userId: userId, productId: selectedProductId, selectedVariantId: selectedVariantId, quantity })
      console.log(uploadToCart.data)
      toast.success(uploadToCart.data.message)
      // dispatch(incrementCounter())
      // navigate('/productDetails/cart')
    } catch (error) {
      console.log(error)
      console.log('error in adding to the cart')

      toast.error(error.response.data.message)
    }



  }

  const receiveQuantity = (quantity) => {
    setQuantity(quantity)
  }

  const handleQuantityChange = (newQuantity) => {
    console.log(`Quantity changed to: ${newQuantity}`);
    // Here you can update your cart state or perform any other actions
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white"
    >
      <motion.div
        key={product?._id || 'loading'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-lg p-8 mb-4 overflow-hidden relative">
              <motion.div
                className="w-full h-[500px]"
                style={{ overflow: 'hidden' }}
              >
                <motion.img
                  src={product?.productImg[selectedImage]}
                  alt="Product Image"
                  className="w-full h-full object-cover cursor-pointer"
                  animate={{
                    scale: isZoomed ? 2 : 1,
                    x: isZoomed ? position.x : 0,
                    y: isZoomed ? position.y : 0,
                    transition: { duration: 0.3 }
                  }}
                  drag={isZoomed}
                  dragConstraints={{
                    top: isZoomed ? -250 : 0,
                    left: isZoomed ? -250 : 0,
                    right: isZoomed ? 250 : 0,
                    bottom: isZoomed ? 250 : 0
                  }}
                  dragElastic={0.05}
                  onDoubleClick={handleDoubleClick}
                  onDragEnd={(e, info) => {
                    const newX = position.x + info.offset.x;
                    const newY = position.y + info.offset.y;
                    // Ensure the position stays within bounds
                    setPosition({
                      x: Math.max(Math.min(newX, 250), -250),
                      y: Math.max(Math.min(newY, 250), -250)
                    });
                  }}
                  style={{
                    transformOrigin: 'center',
                    cursor: isZoomed ? 'grab' : 'pointer'
                  }}
                  whileDrag={{ cursor: 'grabbing' }}
                />
              </motion.div>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product?.productImg?.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${selectedImage === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-auto"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              {product?.title}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className="text-xl text-gray-400 mb-6"
            >
              {product?.categoryId?.categoryName}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className={`mb-8 ${product?.variants[index].stock > 0 && product?.variants[index].stock < 5
                ? "text-red-500"
                : product?.variants[index].stock >= 5 && product?.variants[index].stock < 10
                  ? "text-orange-500"
                  : product?.variants[index].stock >= 10
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
            >
              {product?.variants[index].stock == 0 ? "Out of Stock !!" :
                product?.variants[index].stock > 0 && product?.variants[index].stock < 5
                  ? `Hurry Up: ${product?.variants[index].stock}`
                  : product?.variants[index].stock >= 5 && product?.variants[index].stock <= 10
                    ? `Available Stock: ${product?.variants[index].stock}`
                    : product?.variants[index].stock > 10
                      ? `Available Stock: ${product?.variants[index].stock}`
                      : ""}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className="text-gray-300 mb-8"
            >
              {/* {<span className='font-bold text-white text-2xl' >  PRICE {product?.variants[index]?.price}  </span>} <del className='font-bold text-red-500 text-2xl' >10000</del> */}
              {product.variants[index].offerPrice ? <> <p className="font-bold text-white text-2xl">₹{product.variants[index].offerPrice}</p> <del className='font-bold text-red-500 text-2xl'> ₹{product.variants[index].price} </del> </> : <p className="font-bold text-white text-2xl">₹{product.variants[index].price}</p>}
            </motion.p>

            <VariantSelector sendVariant={product.variants} receiveIndex={receiveIndex} id={product._id} setProducts={setProduct} />





            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className="text-gray-300 mb-8"
            >
              {product?.description}
            </motion.p>

            <div className='flex gap-4 justify-center items-center'>

              <span>QUANTITY</span>
              <QuantitySelector initialQuantity={1} onQuantityChange={handleQuantityChange} receiveQuantity={receiveQuantity} />
            </div>

            {/* Add to Cart and Buy Now Buttons */}
            <div className="space-y-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCart}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full py-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span>Add to Cart</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full py-4 bg-[#521166] text-white rounded-lg font-medium hover:bg-[#3d0d4d] transition-colors flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                <span>Buy Now</span>
              </motion.button>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              <motion.div className="border-t border-gray-800">
                <button
                  onClick={() => toggleSection('specs')}
                  className="w-full py-4 flex justify-between items-center text-left"
                >
                  <span className="font-medium">SPECS & DETAILS</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${activeSection === 'specs' ? 'rotate-180' : ''
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
                      {product.spec.map((item, i) =>

                        <li key={i}>{item}</li>
                      )}

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
                    className={`w-5 h-5 transition-transform ${activeSection === 'box' ? 'rotate-180' : ''
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
                    className={`w-5 h-5 transition-transform ${activeSection === 'support' ? 'rotate-180' : ''
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
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-black text-white"
      >
        {/* Previous navigation and product details sections remain the same... */}

        {/* Review Section */}
        <div className="w-full bg-black px-4 py-16">
          <div className="max-w-8xl mx-auto">
            {/* Previous review header and rating bars remain the same... */}

            {/* Feature Sections - Added between reviews and carousel */}
            <section className="py-16 border-t border-gray-800">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-12 items-center mb-24"
              >
                <div className="space-y-6">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold"
                  >
                    {product.subHead[0]}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    className="text-gray-400 text-lg"
                  >
                    {product.subHeadDescription[0]}
                  </motion.p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg overflow-hidden"
                >
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    src={product?.productImg[1]}
                    alt="Keyboard Design"
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg overflow-hidden"
                >
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    src={product.productImg[2]}
                    alt="Next-Gen Typing"
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
                <div className="space-y-6">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold"
                  >
                    {product.subHead[1]}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    className="text-gray-400 text-lg"
                  >
                    {product.subHeadDescription[1]}
                  </motion.p>
                </div>
              </motion.div>
            </section>

            {/* Previous reviews carousel and related products remain the same... */}
            <div className="overflow-hidden relative w-full">
              {/* Previous carousel content remains the same... */}
            </div>



            {/* Previous related products grid remains the same... */}
          </div>
        </div>
      </motion.div>


      {/* Review Section */}
      <div className="w-full bg-black px-4 py-16">
        <div className="max-w-8xl mx-auto ">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Customer Reviews</h2>
              <div className="flex items-center">
                <span className="text-xl font-semibold mr-2">5.00</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-400">Based on 2 reviews</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-white text-black rounded-md font-medium"
            >
              Write a review
            </motion.button>
          </div>

          <div className="space-y-4 mb-8">
            {/* Rating Bars */}
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <div className="flex items-center w-24">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="flex-1 h-2 mx-4 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: rating === 5 ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-yellow-400"
                  />
                </div>
                <span className="text-sm text-gray-400 w-8">{rating === 5 ? '2' : '0'}</span>
              </div>
            ))}
          </div>


          {/* Reviews List */}
          <div className="overflow-hidden relative w-full">
            <motion.div
              className="flex"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                duration: features.length * 7, // Adjust the duration based on the number of features
                ease: "linear",
                repeat: Infinity,
              }}
            >

              {[...features, ...features].map((feature, index) => (
                <motion.div
                  key={index}
                  className="min-w-[450px] p-6 bg-darkGrey my-10 text-gray-50 rounded-lg text-left mx-4   hover:shadow-[0_0_20px_1px_rgba(256,256,256,0.3)]"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-left">{feature.title}</h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-200 text-left">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <Corouser setProduct={setProduct} />

        </div>
      </div>
    </motion.div>
  )
}

export default ProductDetails
