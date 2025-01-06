import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import axios from '../../axios/userAxios'
import { toast } from 'react-toastify';
const EditAddressModal = ({ isOpen, onClose, setIsOpen, editAddress, setEditAddress }) => {
  const [address, setAddress] = useState(editAddress);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const addressId = editAddress._id
    const updateAddress = await axios.put('/editAddress', { editAddress })
    toast.success(updateAddress.data.message)
    setIsOpen(false)
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const inputVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
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
          >
            <motion.button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setIsOpen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
            <h2 className="text-2xl font-bold mb-6">Edit Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'street', label: 'Street Address', type: 'text' },
                { name: 'city', label: 'City', type: 'text' },
                { name: 'state', label: 'State', type: 'text' },
                { name: 'pinCode', label: 'Pin Code', type: 'number' },
                { name: 'country', label: 'Country', type: 'text' },
                { name: 'phone', label: 'Phone Number', type: 'tel' },
              ].map((field, index) => (
                <motion.div
                  key={field.name}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={editAddress[field.name] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </motion.div>
              ))}
              <motion.button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Changes
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditAddressModal;

