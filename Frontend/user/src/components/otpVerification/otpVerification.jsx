import React, { useState, useEffect } from 'react';
import Gezee from '../../assets/GeeZee.png'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../axios/userAxios'
import { useSelector } from 'react-redux';
const otpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const[error,setError]=useState(false)
  const[check,setCheck]=useState(null)

    const navigate=useNavigate()
    const otpCheck=useSelector((state)=>state.otpCheck.otp)

   
  useEffect(() => {
    if (!otpCheck) {
      toast.error('OTP session expired. Redirecting to signup.');
      navigate('/signup');
    }
  }, [otpCheck, navigate]); 


    useEffect(()=>{
      console.log(otpCheck)
      setCheck(otpCheck)
        const interval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
          }, 1000);
          return () => clearInterval(interval); 
       
    },[])
    
  
    const handleSubmit=async(e)=>{
        e.preventDefault()
      
      
          if(timer>0)
            {
                const OTP=otp.join('')
                console.log(OTP)

                try {
                    const response= await axios.post('/otpVerification',{otp:OTP})
                    console.log(response)
                    if(response.data.message=='user created')
                        {
                            toast.success(response.data.message);
                            navigate('/login')
                        }else{
                            toast.error(response.data.message)
                        }
                    
                } catch (error) {
                    if (error.response && error.response.data) {
                        toast.error(error.response.data.message || 'Something went wrong');
                    } else {
                        toast.error('Network error');
                    }
                }
               
               
              
                
            }else{
               toast.error('Time Expired')
               setError(true)

            }
      
        
    }

    const handleChange=(element,index)=>{
            setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
            if (element.nextSibling) {
              element.nextSibling.focus(); }
    }
    const handleResendOtp = async()=>{
      setTimer(300)
      setOtp(['', '', '', '', '', ''])
      if(timer>0)
      {
        const OTP=otp.join('')
        try {
          const response=axios.post('/resendOtp',{otp:OTP})
          console.log(response)
        } catch (error) {
          console.log('error while sending resend otp',error)
        }

      }else{
        toast.error('Time Expired')
        setError(true)
      }
      

    }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center  h-screen w-screen absolute top-0 left-0 Z-10">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            {error && <span className='text-red-500 text-2xl'> TIMER EXPIRED </span>}
          <img 
            src={Gezee}
            alt="GeeZee Logo"
            className="mx-auto h-24 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-white">Verify Your Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => {
              return (
                <input
                  className="w-12 h-12 text-center text-2xl rounded-md border border-gray-700 text-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onFocus={e => e.target.select()}
                />
              );
            })}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Verify OTP'}
            </button>
          </div>
        </form>
        <div className="text-center text-white">
          Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </div>
        <p className="mt-2 text-center text-sm text-gray-400">
          Didn't receive the code?{' '}
          <a href="#" onClick={handleResendOtp} className="font-medium text-green-500 hover:text-green-400">
            Resend OTP
          </a>
        </p>
      </div>
    </div>
  );
};

export default otpVerification;

