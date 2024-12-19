import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const OTPVerificationModal = ({ isOpen, onClose,setIsOpen,formData,userId }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);
console.log(formData,userId)
  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setError('');

    // Simulating API call
    setTimeout(() => {
      if (otp.join('') === '1234') { // Replace with actual verification logic
        setIsVerified(true);
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleResend = () => {
    setResendDisabled(true);
    // Simulating OTP resend
    console.log('Resending OTP...');
    // Add your resend logic here
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    }
  };

  const inputVariants = {
    focus: { scale: 1.05 },
    blur: { scale: 1 }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
            <div className="flex justify-center space-x-4 mb-6">
              {otp.map((digit, index) => (
                <motion.div key={index} variants={inputVariants} whileFocus="focus" initial="blur" animate="blur">
                  <Input
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-12 h-12 text-center text-2xl"
                  />
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-center mb-4 flex items-center justify-center"
                >
                  <AlertCircle className="mr-2" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-green-500 text-center mb-4 flex items-center justify-center"
                >
                  <CheckCircle2 className="mr-2" />
                  OTP Verified Successfully!
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                onClick={handleVerify}
                disabled={otp.some((digit) => digit === '') || isVerifying}
                className="w-full mb-4"
              >
                {isVerifying ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                onClick={handleResend}
                disabled={resendDisabled}
                variant="outline"
                className="w-full"
              >
                {resendDisabled ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OTPVerificationModal;

