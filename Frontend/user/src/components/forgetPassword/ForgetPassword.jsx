import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axios/userAxios';
import OtpPage from './Otppage';
const ForgetPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isOpen, setIsOpen]=useState(false)

    const navigate=useNavigate()

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Invalid email address';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }


        setIsSubmitting(true);
        try {
            const response = await axios.post('/forgetPassword', { email })
            toast.success("Otp sended");
            setIsOpen(true)
            // setEmail('');
            setError('');
        } catch (error) {


            toast.error(error?.response?.data?.message)
            console.log('error while forget password', error)
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) {
            setError('');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 100
            }
        },
    };

    const inputVariants = {
        focus: { scale: 1.02 },
        blur: { scale: 1 },
    };

    return (
        <div className="min-h-[calc(100vh-400px)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto h-24 w-24 relative"
                    >
                        <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                    </motion.div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don't worry! It happens. Please enter the email address associated with your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </Label>
                        <motion.div
                            variants={inputVariants}
                            whileFocus="focus"
                            whileBlur="blur"
                            className="mt-1"
                        >
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Enter your email"
                                className={`block w-full px-3 py-2 border ${error
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`}
                            />
                        </motion.div>
                        {error && (
                            <motion.p
                                className="mt-2 text-sm text-red-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <div>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </motion.div>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                        Back to Login
                    </Link>
                </div>
            </motion.div>
            {isOpen && <OtpPage isOpen={isOpen} setIsOpen={setIsOpen} email={email}/> }
        </div>
    );
};

export default ForgetPassword;
