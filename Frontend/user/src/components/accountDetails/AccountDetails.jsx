import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from '../../axios/userAxios'
import { toast } from 'react-toastify';
import changeEmailVerification from './ChangeEmailOtpVerification'
const AccountDetails = () => {

  const user = useSelector(state => state.user.user)
  const[isOpen,setIsOpen]=useState(false)
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phoneNo
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const updateInformation=await axios.put(`/changeUserInfo/${user._id}`,{formData})
      toast.success(updateInformation.data.message)
    } catch (error) {
      console.log('error while updating the user')
      toast.error(error.response.data.message)
    }
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const formFields = [
    { id: 'firstName', label: 'First name', type: 'text' },
    { id: 'lastName', label: 'Last name', type: 'text' },
    // { id: 'email', label: 'Email', type: 'email' },
    { id: 'phone', label: 'Phone no', type: 'tel' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg p-8 w-full max-w-md shadow-sm"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold mb-6"
        >
          Account Details
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                type={field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: 0.7 }}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors mt-6"
          >
            Save Changes
          </motion.button>
        </form>
      </motion.div>
      {isOpen && <changeEmailVerification isOpen={isOpen} setIsOpen={setIsOpen} formData={formData} userId={user._id}/>}
    </div>
  );
};

export default AccountDetails;

