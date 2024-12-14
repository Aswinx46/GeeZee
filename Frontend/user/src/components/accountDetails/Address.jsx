import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../../axios/userAxios'
import { useSelector } from 'react-redux';
import { persistor } from '@/redux/store';
import { toast } from 'react-toastify';
import { green } from '@mui/material/colors';
import EditAddressModal from './EditAddressPopUp';
const AddressForm = () => {
  // State for shipping address form
  const [userId,setUserId]=useState()
  const[addresses,setAddresses]=useState([])
  const[defaultAddress,setDefaultAddress]=useState({})
  const[isOpen,setIsOpen]=useState(false)
  const user=useSelector(state=>state.user.user)
    const[update,setUpdate]=useState(false)
    const [editAddress,setEditAddress]=useState({})
  
  useEffect(()=>{
    const fetchAddress=async()=>{
      const addressList=await axios.get(`/showAddress/${user._id}`)
      console.log('this is the addresslist',addressList)
      setAddresses(addressList.data.address)
      const defaultAddressTrue=addressList.data.address.find((address)=>address.defaultAddress == true)
      setDefaultAddress(defaultAddressTrue)
      console.log(defaultAddress)
      setUserId(user._id)
    }
    fetchAddress()
  },[update,isOpen])
  const[errors,setErrors]=useState({})
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: ''
  });

  // Default address data
  // const defaultAddress = {
  //   street: '2436 Naples Avenue',
  //   city: 'Panama City',
  //   state: 'FL',
  //   pinCode: '32405',
  //   country: 'United States',
  //   phone: '123456789'
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    validation()
    try {
      if(validation())
      {

        const response=await axios.post('/address',{shippingAddress,userId})
        toast.success(response.data.message)
        setShippingAddress({  street: '',
          city: '',
          state: '',
          pinCode: '',
          country: '',
          phone: ''})
          setUpdate(!update)
        }
    } catch (error) {
      console.log('error while creating the address',error)
      toast.error('error while creating address')
    }

    
  };

  const validation=()=>{
    const error={}
    if(!shippingAddress.street.trim()) error.street='enter a valid street'

    if(!shippingAddress.city.trim()) error.city='enter a valid city'

    if(!shippingAddress.country.trim()) error.country='enter a valid country'

    if(!shippingAddress.pinCode.trim()) error.pinCode='enter a valid pinCode'

    if(!shippingAddress.state.trim()) error.state='enter a valid street'
    
    if (!shippingAddress.phone.trim()) {
      error.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(shippingAddress.phone)) {
      error.phone = 'Phone number should contain only digits';
    } else if (shippingAddress.phone.length !== 10) {
      error.phone = 'Phone number should be exactly 10 digits';
    }
    setErrors(error)
    return Object.keys(error).length === 0;
  }

  const handleDelete=async(addressId)=>{

    console.log(addressId)
    try {
      const isDefault=addresses.find((address)=>address._id == addressId && address.defaultAddress == true)
      console.log(isDefault)
      if(isDefault)
      {
        toast.error('Default Address cant be delete')
        return
      }
      const deleteAddress=await axios.delete(`/deleteAddress/${addressId}`)
      toast.success(deleteAddress.data.message)
      // setAddresses(deleteAddress.data.address)
      setUpdate(!update)
    } catch (error) {
      console.log('error while deleting the address',error)
    }
  }

  const handleDefaultAddress=async (addressId) => {
    
    try {
      const changeDefaultAddress=await axios.patch(`/changeDefaultAddress/${addressId}/${userId}`)
      toast.success('Default address changed')
      setUpdate(!update)
    } catch (error) {
      console.log('error while changing the default addresss',error)
    }
  }

  const handleEditSavedAddress=async(addressId)=>{
    console.log(addressId)
    const changeAddress=addresses.find((address)=>address._id == addressId)
    console.log(changeAddress)
    setEditAddress(changeAddress)
    setIsOpen(true)
    console.log(isOpen)
  }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Address Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span className="text-red-500 text-sm">{errors.street && errors.street}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="text-red-500 text-sm">{errors.city && errors.city}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="text-red-500 text-sm">{errors.state && errors.state}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pin Code
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="number"
                    name="pinCode"
                    value={shippingAddress.pinCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="text-red-500 text-sm">{errors.pinCode && errors.pinCode}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="text-red-500 text-sm">{errors.country && errors.country}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />

                <span className="text-red-500 text-sm">{errors.phone && errors.phone}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-auto px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Add Address
              </motion.button>
            </form>
          </motion.div>

          {/* Default Address Display */}
          {defaultAddress && 
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-100 p-6 rounded-lg"
          >
            <h2 className="text-xl font-semibold mb-6">Default Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <p className="px-4 py-2 bg-white rounded-md border border-gray-200">
                  {defaultAddress.street}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <p className="px-4 py-2 bg-white rounded-md border border-gray-200">
                    {defaultAddress.city}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <p className="px-4 py-2 bg-white rounded-md border border-gray-200">
                    {defaultAddress.state}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pin Code
                  </label>
                  <p className="px-4 py-2 bg-white rounded-md border border-gray-200">
                    {defaultAddress.pinCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <p className="px-4 py-2 bg-white rounded-md border border-gray-200">
                    {defaultAddress.country}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <p className="px-4 py-2 bg-white rounded-md border border-gray-200">
                  {defaultAddress.phone}
                </p>
              </div>

              {/* <div className="flex space-x-4">
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                Edit Address
                </motion.button>
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Delete Address
                  </motion.button>
                  </div> */}
            </div>
          </motion.div>
                  }
        </div>

        {/* Saved Addresses Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">Saved Addresses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses?.map((address, index) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{address.street}</h3>
                  {address.isDefault && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded">Default</span>
                  )}
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>{address.city}, {address.state}</p>
                  <p>{address.pinCode}</p>
                  <p>{address.country}</p>
                  <p>Phone: {address.phone}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={()=>handleEditSavedAddress(address._id)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Edit
                  </motion.button>
                  {!address.isDefault && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>handleDefaultAddress(address._id)}
                      className={`px-3 py-1 text-xs rounded hover:bg-gray-800 ${address.defaultAddress ? 'bg-green-500' : 'bg-black'} text-white`}

                    >
                      {address.defaultAddress == true ? 'Default address' : 'Set Default'}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={()=>handleDelete(address._id)}
                    className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
            {(!addresses || addresses.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-2 text-center py-8 text-gray-500"
              >
                <p>No saved addresses yet</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      {isOpen && <EditAddressModal isOpen={isOpen} setIsOpen={setIsOpen} setEditAddress={setEditAddress} editAddress={editAddress}/>}
    </div>
  );
};

export default AddressForm;
