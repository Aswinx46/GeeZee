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
    // onSave(address);
    console.log('this is the userId',userId)
    console.log(address)
    if(validation())
    {
     
        const response=await axios.post('/address',{shippingAddress:address , userId:userId})
        console.log(address)
        setIsOpen(false)
    }
  };

  const validation=()=>{
    const error={}
    if(!address.street.trim()) error.street='enter a valid street'

    if(!address.city.trim()) error.city='enter a valid city'

    if(!address.country.trim()) error.country='enter a valid country'

    if(!address.pinCode.trim()) error.pinCode='enter a valid pinCode'

    if(!address.state.trim()) error.state='enter a valid street'
    
    if (!address.phone.trim()) {
      error.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(address.phone)) {
      error.phone = 'Phone number should contain only digits';
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
              {[
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
              ))}
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

