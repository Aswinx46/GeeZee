import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import axios from '../../axios/userAxios'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddressModal from './AddNewAddress';
import { toast } from 'react-toastify';
const CheckoutPage = () => {
//   const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const[savedAddresses,setSavedAddresses]=useState([])
  const[selectedAddress,setSelectedAddress]=useState()
  const [update,setUpdate]=useState(false)
  const[defaultAddress,setDefaultAddress]=useState({})
  const[cartItems,setCartItems]=useState([])
  const[mainAddress,setMainAddress]=useState({})
  const user=useSelector(state=>state.user.user)
  const userId=user._id
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const[isOpen,setIsOpen]=useState(false)
  const navigate=useNavigate()
  const [shippingCharge,setShippingCharge]=useState(40)

  useEffect(()=>{
    const fetchData=async () => {
        const addresses=await axios.get(`/showAddress/${userId}`)??[]
        const defaultAdd=addresses.data.address.find((address)=>address.defaultAddress == true)
        setDefaultAddress(defaultAdd)

        setMainAddress((prev) => {
            return selectedAddress ? selectedAddress : defaultAdd;
          });

        // const savedAddress=addresses.data.address.filter((address)=>address._id != mainAddress)
        const savedAddress = addresses.data.address.filter((address) => address._id !== (selectedAddress?._id || defaultAdd?._id));
        console.log('this is hte saved addresses',savedAddress)
        setSavedAddresses(savedAddress)
        console.log(savedAddress)
        const cartItems=await axios.get(`/cartItems/${userId}`)
        
        console.log(cartItems.data.result)
        setCartItems(cartItems.data.result)


    }
    fetchData()
  },[update,isOpen])



  const calculateSubTotal=()=>{
    return cartItems.reduce((total,item)=>{
        const itemTotal=item.variants[0].price * item.quantity
        return total + itemTotal ;
    },0)
  }

  const total=calculateSubTotal()

  
  const handlePlaceOrder=async(e)=>{
    e.preventDefault()
    console.log(defaultAddress)
    console.log('this is main address',mainAddress)
    console.log('this is the items',cartItems)
    console.log('this is the user id',userId)
    console.log('this is the paymnent method',paymentMethod)
    console.log('this is the variant id',cartItems[0].variants[0]._id)
    const variantId=cartItems[0].variants[0]._id
    const blockedProduct=cartItems.some((item)=>item.productStatus == 'inactive' ||item.brandStatus == 'inactive' || item.categoryStatus == 'inactive')
    console.log(blockedProduct)
    if(blockedProduct)
    {
        toast.error('Product is blocked by admin remove the product to continue purchase')
        return 
    }
    try {
        const respone=await axios.post(`/createOrder/${userId}/${variantId}`,{mainAddress,cartItems,paymentMethod,total,shippingCharge})
        toast.success(respone.data.message)
        navigate('/checkoutSuccess')
        
    } catch (error) {
        console.log('error while creating order',error)
        // toast.error('error while creating order')
        setUpdate(!update)
        toast.error(error.response.data.message)
    }
    
  }
 
  const handleEditCart=()=>{
    navigate('/cart')
  }

  const handleNewAddress=()=>{
    console.log('kajsfd')
    setIsOpen(true)
    console.log(isOpen)
    // navigate('/address')
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

              {mainAddress&&<motion.div
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
                {cartItems.map((item,i)=>(
                <div key={i} className={`flex items-center border-t border-b border-gray-200 py-4 relative ${
                  item.productStatus === 'inactive' || item.brandStatus === 'inactive' || item.categoryStatus === 'inactive' 
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
                    {Object.entries(item.variants[0].selectedAttributes).map((val,i)=>(
                      <h3 key={i} className="text-sm font-medium text-gray-700">
                        {val.join(' - ')}
                      </h3>
                    ))}
                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    ₹{item.variants[0].price}
                  </p>
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
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between text-green-600"
                  >
                    <span>Shipping Charge</span>
                    <span>₹{shippingCharge}</span>
                  </motion.div>
                {couponApplied && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between text-green-600"
                  >
                    <span>Discount</span>
                    <span>-₹20.00</span>
                  </motion.div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{couponApplied ? total - 20 : total+shippingCharge}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Have a Coupon?</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCouponApplied(true)}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Apply
                </motion.button>
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
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="form-radio text-black"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </motion.div>

            {/* Pay Now Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
             
              onClick={(e)=>handlePlaceOrder(e)}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              
            >
                Place Order
            </motion.button>
          </motion.div>
        </div>
      </div>
      {isOpen && userId && <AddressModal isOpen={isOpen} setIsOpen={setIsOpen} userId={userId}/>}
    </div>
  );
};

export default CheckoutPage;
