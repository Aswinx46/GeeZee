import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import axios from '../../axios/userAxios'

const AddressModal = ({ isOpen, onClose, onSave ,setIsOpen,userId}) => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: '',
   
  });
  const [errors,setErrors]=useState({})
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    validation()
 
    if(validation())
    {
     
        const response=await axios.post('/address',{shippingAddress:address , userId:userId})
        setIsOpen(false)
    }
  };

  const validation=()=>{
    const error={}
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    const onlyLettersRegex = /^[a-zA-Z\s]+$/;
    const numberRegex = /^\d+$/;

    if(!address.street.trim()) {
      error.street = 'Street address is required';
    } else if (!alphanumericRegex.test(address.street)) {
      error.street = 'Street address should only contain letters and numbers';
    }

    if(!address.city.trim()) {
      error.city = 'City is required';
    } else if (!onlyLettersRegex.test(address.city)) {
      error.city = 'City should only contain letters';
    }

    if(!address.state.trim()) {
      error.state = 'State is required';
    } else if (!onlyLettersRegex.test(address.state)) {
      error.state = 'State should only contain letters';
    }

    if(!address.country.trim()) {
      error.country = 'Country is required';
    } else if (!onlyLettersRegex.test(address.country)) {
      error.country = 'Country should only contain letters';
    }

    if (!address.pinCode.trim()) {
      error.pinCode = 'Pincode is required';
    } else if (!numberRegex.test(address.pinCode)) {
      error.pinCode = 'Pincode should contain only numbers';
    } else if (address.pinCode.length !== 6) {
      error.pinCode = 'Pincode should be exactly 6 digits';
    }
    
    if (!address.phone.trim()) {
      error.phone = 'Phone number is required';
    } else if (!numberRegex.test(address.phone)) {
      error.phone = 'Phone number should contain only numbers';
    } else if (address.phone.length !== 10) {
      error.phone = 'Phone number should be exactly 10 digits';
    }

    setErrors(error)
    return Object.keys(error).length === 0;
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white rounded-lg p-8 w-full max-w-md relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={()=>setIsOpen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
            <h2 className="text-2xl font-bold mb-6">Create New Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[/* eslint-disable */
                { name: 'street', label: 'Street Address', type: 'text' },
                { name: 'city', label: 'City', type: 'text' },
                { name: 'state', label: 'State', type: 'text' },
                { name: 'pinCode', label: 'Pincode', type: 'number' },
                { name: 'country', label: 'Country', type: 'text' },
                { name: 'phone', label: 'Phone Number', type: 'number' },
              ].map((field) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={address[field.name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    
                  />
                        <span className="text-red-500 text-sm">{errors[field.name] && errors[field.name]}</span>
                </motion.div>
              ))}/* eslint-enable */
              <motion.button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Address
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddressModal;
