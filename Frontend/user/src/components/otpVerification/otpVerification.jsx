import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from '../../axios/userAxios';
import Gezee from '../../assets/GeeZee.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react';

const OtpVerificationModal = ({ isOpen, onClose, user, setIsOpen }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [check, setCheck] = useState(null);

  const navigate = useNavigate();
  const otpCheck = useSelector((state) => state.otpCheck.otp);

  useEffect(() => {
    if (!otpCheck) {
      toast.error('OTP session expired. Redirecting to signup.');
      navigate('/signup');
    }
  }, [otpCheck, navigate]);

  useEffect(() => {
    setCheck(otpCheck);
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timer > 0) {
      const OTP = otp.join('');
      try {
        const response = await axios.post('/otpVerification', { otp: OTP, user: user });
        if (response.data.message == 'user created') {
          toast.success(response.data.message);
          navigate('/login');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || 'Something went wrong');
        } else {
          toast.error('Network error');
        }
      }
    } else {
      toast.error('Time Expired');
      setError(true);
    }
  };

  const handleChange = (element, index) => {
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleResendOtp = async () => {
    console.log('this is the resend otp')
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    if (timer == 0) {
      const OTP = otp.join('');
      try {
        const response = await axios.post('/resendOtp', { otp: OTP ,email:user.email});
      } catch (error) {
        console.log('error while sending resend otp', error);
      }
    } else {
      toast.error('Time Expired');
      setError(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black dark:bg-gray-900 rounded-xl shadow-xl transform transition-all">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Verify Your Account</DialogTitle>
          <X onClick={()=>setIsOpen(false)} className="h-6 w-6 absolute right-0 top-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors"  />
        </DialogHeader>
        <div className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-4">
            {error && <div className='text-red-500 text-xl font-semibold p-3 bg-red-100 dark:bg-red-900/30 rounded-lg animate-pulse'>Timer Expired</div>}
            <img
              src={Gezee}
              alt="GeeZee Logo"
              className="mx-auto h-28 w-auto drop-shadow-md transition-transform hover:scale-105"
            />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-3">
              {otp.map((data, index) => (
                <Input
                  key={index}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all"
                  type="text"
                  name="otp"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : 'Verify OTP'}
              </Button>

              <div className="text-center font-medium text-gray-700 dark:text-gray-300">
                Time remaining: <span className="text-blue-600 dark:text-blue-400">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Didn't receive the code?{' '}
              <Button
                variant="link"
                onClick={handleResendOtp}
                disabled={timer > 0}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors p-0"
              >
                Resend OTP
              </Button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationModal;
