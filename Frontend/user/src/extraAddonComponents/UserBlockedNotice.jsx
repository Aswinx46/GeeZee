import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, LogIn, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { removeUser } from '@/redux/slices/userSlice';
import { useDispatch } from 'react-redux';
const UserBlockedNotice = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const dispatch=useDispatch()

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const handleNavigateToLogin=()=>{
   
    dispatch(removeUser())
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <motion.div
          className="text-center mb-6"
          variants={childVariants}
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Blocked</h1>
          <p className="text-gray-600">
            We're sorry, but your account has been blocked by an administrator.
          </p>
        </motion.div>

        <motion.div variants={childVariants}>
          <Link
            to="/login"
            onClick={handleNavigateToLogin}
            className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 text-center mb-4"
          >
            <LogIn  className="inline-block mr-2 h-5 w-5" />
            Go to Login Page
          </Link>
        </motion.div>

        <motion.div
          className="text-center text-gray-600"
          variants={childVariants}
        >
          <p className="mb-2">Need assistance? Contact admin:</p>
          <a
            href="mailto:admin@example.com"
            className="text-blue-500 hover:underline inline-flex items-center"
          >
            <Mail className="mr-2 h-5 w-5" />
            admin@example.com
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserBlockedNotice;

