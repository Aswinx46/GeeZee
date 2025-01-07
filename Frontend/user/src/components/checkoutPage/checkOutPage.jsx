import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp, Signature } from 'lucide-react';
import axios from '../../axios/userAxios'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddressModal from './AddNewAddress';
import { toast } from 'react-toastify';
import { RAZORPAY_KEY_ID } from '@/config/razorPayKey';
const CheckoutPage = () => {
  //   const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState()
  const [update, setUpdate] = useState(false)
  const [defaultAddress, setDefaultAddress] = useState({})
  const [cartItems, setCartItems] = useState([])
  const [mainAddress, setMainAddress] = useState({})
  const user = useSelector(state => state.user.user)
  const userId = user?._id
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [showCoupons, setShowCoupons] = useState(false);
  const navigate = useNavigate()
  const [shippingCharge, setShippingCharge] = useState(40)
  const [coupons, setCoupons] = useState([])
  const [selectedCoupon, setSelectedCoupon] = useState()
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [finalAmount, setFinalAmount] = useState()
  const [discount, setDiscount] = useState()
  const [total, setTotal] = useState()
  useEffect(() => {
    const fetchData = async () => {
      const addresses = await axios.get(`/showAddress/${userId}`) ?? []
      const defaultAdd = addresses.data.address.find((address) => address.defaultAddress == true)
      setDefaultAddress(defaultAdd)

      const coupon = await axios.get('/showCoupons')
      const notUsedCoupons = coupon.data.allCoupons.filter((coupon) =>
        !coupon.userId.includes(userId))
      setCoupons(notUsedCoupons)
      setMainAddress((prev) => {
        return selectedAddress ? selectedAddress : defaultAdd;
      });

      const savedAddress = addresses.data.address.filter((address) => address._id !== (selectedAddress?._id || defaultAdd?._id));
      setSavedAddresses(savedAddress)
      const cartItems = await axios.get(`/cartItems/${userId}`)

      const neededItems = cartItems.data.result.map((product) => {
        const variantPrice = product?.variants[0]?.price
        const categoryOfferPrice = product.categoryOffer?.offerType == 'percentage' ? variantPrice - variantPrice * product.categoryOffer?.offerValue / 100 : variantPrice - product.categoryOffer?.offerValue
        const productOfferPrice = product.productOffer?.offerType == 'percentage' ? variantPrice - variantPrice * product.productOffer?.offerValue / 100 : variantPrice - product.productOffer?.offerValue
     
        const offerPrice =
          Number.isNaN(categoryOfferPrice) ? productOfferPrice :
            Number.isNaN(productOfferPrice) ? categoryOfferPrice :
              Math.max(categoryOfferPrice, productOfferPrice);
        return { ...product, offerPrice }
      })
      
      setCartItems(neededItems)

      const calculateSubTotal = () => {
        return neededItems.reduce((total, item) => {
          if (item.offerPrice) {
            const itemTotal = item.offerPrice * item.quantity
            return total + itemTotal;
          }
          const itemTotal = item.variants[0].price * item.quantity
          return total + itemTotal;
        }, 0)
      }

      const total = await calculateSubTotal()
      setTotal(total)
  
      const finalAmount = total - shippingCharge
      setFinalAmount(finalAmount)

    }
    fetchData()
  }, [update, isOpen])

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);






  const handlePlaceOrder = async (e) => {
    e.preventDefault()


    const variantId = cartItems[0].variants[0]._id
    const blockedProduct = cartItems.some((item) => item.productStatus == 'inactive' || item.brandStatus == 'inactive' || item.categoryStatus == 'inactive')
 
    if (blockedProduct) {
      toast.error('Product is blocked by admin remove the product to continue purchase')
      return
    }
  
    if (!mainAddress) {
      toast.error('No address Selected')
      return
    }
    try {
      const response = await axios.post(`/createOrder/${userId}/${variantId}`, { mainAddress, cartItems, paymentMethod, total, shippingCharge, selectedCoupon })
      if (paymentMethod == 'Razorpay') {
        const { razorpayOrderId, amount, currency } = response.data;

        const options = {
          key: RAZORPAY_KEY_ID, // Replace with your Razorpay key
          amount,
          currency,
          name: 'GeeZee',
          description: 'Order Payment',
          order_id: razorpayOrderId,
          handler: async (response) => {
            toast.success('Payment Successful');
            navigate("/checkoutSuccess");
            // Optionally send payment confirmation to the backend

            await axios.post(`/confirmPayment/${userId}`, {
              paymentId: response.razorpay_payment_id,
              orderId: razorpayOrderId,
              signature: response.razorpay_signature
            });
            // toast.success("Payment Successful");

          },
          prefill: {
            name: mainAddress.name,
            email: mainAddress.email,
            contact: mainAddress.phone,
          },
          theme: {
            color: '#3399cc',
          }, method: {
            netbanking: true,
            card: true,
            upi: true, // Enables UPI
            wallet: true,
          },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on('payment.failed', (response) => {
          console.error('Payment Failed:', response);
          toast.error('Payment Failed. Please try again.');
        });
      } else {
        toast.success(response.data.message)
        navigate('/checkoutSuccess')
      }



    } catch (error) {
      console.log('error while creating order', error)
      console.log(error)
      // toast.error('error while creating order')
      setUpdate(!update)
      toast.error(error.response.data.message)
    }

  }

  const handleEditCart = () => {
    navigate('/cart')
  }

  const handleNewAddress = () => {
    setIsOpen(true)
    
    // navigate('/address')
  }

  const handleCouponApply = () => {
    setCouponApplied(true)
    const appliedCoupon = coupons.find((coupon) => coupon.name == couponCode)
    if (!appliedCoupon)
      if (total < appliedCoupon.minimumPrice) {
        toast.error(`minimum total amount is ${appliedCoupon.minimumPrice}`)
        return
      }
    if (!appliedCoupon) toast.error('Invalid Coupon')
    setAppliedCoupon(appliedCoupon)
    const tota = total + shippingCharge - appliedCoupon.offerPrice
    setFinalAmount(tota)


  }

  const handleSelectAddress = async (address) => {
    toast.success('Address changed')
    try {
      setSelectedAddress(address)
      setUpdate(!update)
    } catch (error) {
      console.error('Error updating default address:', error);
    }
  };

  const handleCouponSelect = async (id) => {
    const selectedCoupon = coupons.find((coupon) => coupon._id == id)
    if (!selectedCoupon) toast.error('No coupon found')

    setSelectedCoupon(selectedCoupon)
    setCouponCode(selectedCoupon.name)
  }

  const handleClearCoupon = () => {
    setCouponCode('')
    setSelectedCoupon('')
    setAppliedCoupon(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Address Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h1>
              {/* Default Address */}

              {mainAddress && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="border border-gray-200 rounded-md p-4">
                  <p>{mainAddress.street}</p>
                  <p>{`${mainAddress.city}, ${mainAddress.state} `}</p>
                  <p>Pincode : {mainAddress.pinCode}</p>
                  <p>{mainAddress.country}</p>
                  <p>{mainAddress.phone}</p>
                </div>
              </motion.div>
              }
              {/* Add New Address Button */}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNewAddress()}
                className="w-full mb-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                Add New Address
              </motion.button>


              {/* Saved Addresses */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                    className="text-sm text-gray-600 flex items-center"
                  >
                    {showSavedAddresses ? 'Hide' : 'Show'}
                    {showSavedAddresses ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {showSavedAddresses && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {savedAddresses.map((address) => (
                        <motion.div
                          key={address._id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="border border-gray-200 rounded-md p-4 mb-4"
                        >
                          <p>{address.street}</p>
                          <p>{`${address.city}, ${address.state} ${address.pinCode}`}</p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectAddress(address)}
                            className="mt-2 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                          >
                            Select for Shipping
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>


              {/* Product Details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
                {cartItems.map((item, i) => (
                  <div key={i} className={`flex items-center border-t border-b border-gray-200 py-4 relative ${item.productStatus === 'inactive' || item.brandStatus === 'inactive' || item.categoryStatus === 'inactive'
                    ? 'bg-gray-100'
                    : ''
                    }`}>
                    {(item.productStatus === 'inactive' || item.brandStatus === 'inactive' || item.categoryStatus === 'inactive') && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg  shadow-xl border-2 border-white">
                          BLOCKED BY ADMIN
                        </div>
                      </div>
                    )}
                    <img
                      src={item.productImg[0]}
                      alt={item.title}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      {Object.entries(item.variants[0].selectedAttributes).map((val, i) => (
                        <h3 key={i} className="text-sm font-medium text-gray-700">
                          {val.join(' - ')}
                        </h3>
                      ))}
                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    {/* <p className="text-lg font-medium text-gray-900">
                      ₹{item.variants[0].price}
                    </p> */}
                    {item.offerPrice ? <> <p className="font-bold text-gray-900 text-2xl">₹{item.offerPrice}</p> <del className='font-bold text-red-500 text-2xl'> ₹{item.variants[0].price} </del> </> : <p className="font-bold text-gray-900 text-2xl">₹{item.variants[0].price}</p>}
                  </div>
                ))}
              </motion.div>




              {/* New Address Form */}


              {/* Place Order Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}

                onClick={handleEditCart}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Edit Cart
              </motion.button>
            </div>
          </motion.div>

          {/* Right side - Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-96 space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <motion.div
                  className="flex justify-between items-center text-sm text-gray-600 border-b pb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span>Subtotal</span>
                  <span className="font-medium">₹{total}</span>
                </motion.div>

                <motion.div
                  className="flex justify-between items-center text-sm text-gray-600 pb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span>Shipping Charge</span>
                  <span className="font-medium">₹{shippingCharge}</span>
                </motion.div>

                {appliedCoupon && (
                  <motion.div
                    className="flex justify-between items-center space-x-2 text-sm border-b pb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Applied Coupon:</span>
                      <span className="font-medium text-green-600">{appliedCoupon.name}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setAppliedCoupon(null)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  </motion.div>
                )}

                <motion.div
                  className="flex justify-between items-center pt-4 text-lg font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span>Total</span>
                  {appliedCoupon ? <span className="text-black">₹{total + shippingCharge - appliedCoupon.offerPrice}</span> : <span className="text-black">₹{total + shippingCharge}</span>}

                </motion.div>
              </div>
            </div>

            {/* Coupon Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Have a Coupon?</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode || selectedCoupon?.name || ''}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleClearCoupon()}
                    className="px-2 py-1 text-gray-500 hover:text-black transition duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCouponApply()}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                  >
                    Apply
                  </motion.button>
                </div>

                <div className="mt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowCoupons(!showCoupons)}
                    className="text-sm text-gray-600 flex items-center"
                  >
                    {showCoupons ? 'Hide Available Coupons' : 'Show Available Coupons'}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${showCoupons ? 'rotate-180' : ''
                        }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showCoupons && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 space-y-2 overflow-hidden"
                      >
                        {coupons.map((coupon, index) => (
                          <motion.div
                            key={coupon?._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div onClick={() => handleCouponSelect(coupon._id)} className="flex justify-between items-center cursor-pointer">
                              <div>
                                <p className="font-semibold text-gray-800">{coupon?.name}</p>
                                <p className="text-sm text-gray-500">Min. Purchase: {coupon?.minimumPrice}</p>
                              </div>
                              <div className="text-green-600 font-bold">{coupon?.offerPrice}</div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Payment Method Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="form-radio text-black"
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="form-radio text-black"
                  />
                  <span>UPI</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="form-radio text-black"
                  />
                  <span>RazorPay</span>
                </label>
                {/* <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === 'Cash on Delivery' }
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="form-radio text-black"
                  />
                  <span>Cash on Delivery</span>
                </label> */}
                {/* <label className="flex items-center space-x-3 relative">
                  <input
                    type="radio"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    disabled={finalAmount > 1000} // Disable if totalAmount > 1000
                    className="form-radio text-black"
                  />
                  <span
                    className={`${finalAmount > 1000 ? 'cursor-not-allowed text-gray-400' : ''}`}
                    title={finalAmount > 1000 ? 'COD is not available for purchases over ₹1000' : ''}
                  >
                    Cash on Delivery
                  </span>
                  {finalAmount > 1000 && (
                    <div className="absolute bottom-full mb-2 left-0 bg-gray-700 text-white text-xs rounded px-2 py-1 shadow-lg">
                      COD is not available for purchases over ₹1000
                    </div>
                  )}
                </label> */}

                <label className="flex items-center space-x-3 relative group">
                  <input
                    type="radio"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    disabled={finalAmount > 1000} // Disable if totalAmount > 1000
                    className="form-radio text-black"
                  />
                  <span
                    className={`${finalAmount > 1000 ? 'cursor-not-allowed text-gray-400' : ''}`}
                  >
                    Cash on Delivery
                  </span>

                  {/* Tooltip */}
                  {finalAmount > 1000 && (
                    <div className="absolute bottom-full mb-2 left-0 bg-gray-700 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      COD is not available for purchases over ₹1000
                    </div>
                  )}
                </label>
              </div>
            </motion.div>

            {/* Pay Now Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}

              onClick={(e) => handlePlaceOrder(e)}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"

            >
              Place Order
            </motion.button>
          </motion.div>
        </div>
      </div >
      {isOpen && userId && <AddressModal isOpen={isOpen} setIsOpen={setIsOpen} userId={userId} />}
    </div >
  );
};

export default CheckoutPage;
