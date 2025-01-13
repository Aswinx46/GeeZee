import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios/userAxios'
import ResetPassword from './ResetPassword';
const OtpPage = ({ isOpen, onClose, email, setIsOpen }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);
    const[resend,setResend]=useState(false)
    const[resetPass,setResetPass]=useState(false)
    
    console.log('this is email from parent',email)
    useEffect(() => {
        // Initialize refs array
        inputRefs.current = inputRefs.current.slice(0, 6);
        
        if (!isOpen) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen,resend]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        // Update OTP array
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take the last character
        setOtp(newOtp);

        // Move to next input if value is entered and next input exists
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

   

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const newOtp = [...otp];
        
        for (let i = 0; i < pastedData.length; i++) {
            if (/\d/.test(pastedData[i])) {
                newOtp[i] = pastedData[i];
            }
        }
        
        setOtp(newOtp);
        
        // Focus the next empty input or the last input
        const nextEmptyIndex = newOtp.findIndex(val => !val);
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex].focus();
        } else if (inputRefs.current[5]) {
            inputRefs.current[5].focus();
        }
    };

    const handleResendOtp = async () => {
        try {
            setTimeLeft(60);
            setCanResend(false);
            
            const response = await axios.post('/resendOtpInResetPassword', { email });
            toast.success("OTP resent successfully");
            setResend(!resend)
        } catch (error) {
            console.log('error while resending otp in reset password',error)
            toast.error(error?.response?.data?.message || "Failed to resend OTP");
        }
    };

    const handleVerify = async () => {
        try {
            const otpString = otp.join('');
            const response = await axios.post('/forgotPasswordOtpVerification', { email, otp: otpString });
            toast.success('verification done enter new password');
            setResetPass(true)
          
        } catch (error) {
            console.log('error while verifying the otp');
            toast.error(error?.response?.data?.message);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setIsOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-center mb-8"
                    >
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
                        <p className="text-gray-600">
                            We've sent a verification code to<br />
                            <span className="font-medium text-gray-900">{email}</span>
                        </p>
                    </motion.div>

                    <div className="mb-8">
                        <div className="flex gap-2 justify-center mb-4">
                            {otp.map((digit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Input
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        onFocus={(e) => e.target.select()}
                                        className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center text-sm">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-600 mb-2"
                            >
                                {timeLeft > 0 ? (
                                    `Time remaining: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="flex items-center justify-center gap-2 text-red-500 font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Time Expired!
                                    </motion.div>
                                )}
                            </motion.div>
                            {canResend ? (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleResendOtp}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Resend Code
                                </motion.button>
                            ) : (
                                <span className="text-gray-400">
                                    Didn't receive the code?
                                </span>
                            )}
                        </div>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                            disabled={otp==0}
                            onClick={handleVerify}
                        >
                            Verify
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
            {resetPass && <ResetPassword resetPass={resetPass} setResetPass={setResetPass} email={email} setIsOpen={setIsOpen}/>}
        </AnimatePresence>
    );
};

export default OtpPage;