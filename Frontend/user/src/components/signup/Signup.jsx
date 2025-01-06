
import React, { useState } from 'react';
import axios from '../../axios/userAxios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc'; // For Google icon
import { FaFacebook } from 'react-icons/fa'; // For Facebook icon
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { addValidation } from '@/redux/slices/OtpCheck';
export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch=useDispatch()
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleAddUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validation();
    try {
      if (validation()) {
        const response = await axios.post('/signup', user);
      
        toast.success('DATA SUBMITTED');
        dispatch(addValidation('otp validation done'))
        navigate('/otpVerification');
      }
    } catch (error) {
      console.log(error)
      toast.error('the email is already exist')
    }
  };

  const validation = () => {
    const errors = {};
    if (!user.firstname.trim()) errors.firstname = 'Please enter a first name';
    if (!user.lastname.trim()) {
      errors.lastname = 'Please enter a last name';
    } else if (user.firstname === user.lastname) {
      errors.lastname = "The firstname and the lastname shouldn't be the same";
    }
    if (!user.email.trim() || !/\S+@\S+\.\S+/.test(user.email)) errors.email = 'Enter a valid email';

    if (!user.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d+$/.test(user.phoneNumber)) {
      errors.phoneNumber = 'Phone number should contain only digits';
    } else if (user.phoneNumber.length !== 10) {
      errors.phoneNumber = 'Phone number should be exactly 10 digits';
    }

    if (!user.password.trim()) {
      errors.password = 'Password is required';
    } else if (user.password.length < 8) {
      errors.password = 'Password should be more than 8 characters';
    } else if (!/[A-Z]/.test(user.password)) {
      errors.password = 'Password should include at least one uppercase letter';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(user.password)) {
      errors.password = 'Password should include at least one special character';
    }

    if (user.password !== user.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const googleAuthenticate =async (credentialResponse)=>{
    if(credentialResponse?.credential)
    {
        try {
          const credential=jwtDecode(credentialResponse.credential)
         
          const{email,email_verified,name,sub}=credential
         

          const response=await axios.post('/googleAuthenticate',{email:email,email_verified,firstName:name,id:sub})
         
          toast.success(response.data.message)
          navigate('/login')
        
        } catch (error) {
          console.log('google authenticate failed',error)
          console.log(error.response.data.message)
          toast.error(error.response.data.message)
        }
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-auto text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h2 className="mt-6 text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign up to get started with our service
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Individual input fields */}
            <div>
              <label htmlFor="firstname" className="sr-only">First Name</label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
                onChange={handleAddUser}
              />
              <span className="text-red-500 text-sm">{error.firstname && error.firstname}</span>
            </div>

            <div>
             <label htmlFor="lastname" className="sr-only">Last Name</label>             
              <input
                id="lastname"
                name="lastname"
                type="text"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
                onChange={handleAddUser}
              />
              <span className="text-red-500 text-sm">{error.lastname && error.lastname}</span>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={handleAddUser}
              />
              <span className="text-red-500 text-sm">{error.email && error.email}</span>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="sr-only">Phone number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
                onChange={handleAddUser}
              />
              <span className="text-red-500 text-sm">{error.phoneNumber && error.phoneNumber}</span>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={handleAddUser}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {isPasswordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
              <span className="text-red-500 text-sm">{error.password && error.password}</span>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  onChange={handleAddUser}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {isConfirmPasswordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
              <span className="text-red-500 text-sm">{error.confirmPassword && error.confirmPassword}</span>
            </div>
          </div>

          <div>
            
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">Or sign up with</span>
          </div>
        </div>
            <div onClick={googleAuthenticate} className="flex justify-center items-center mt-4">
      <GoogleLogin
        onSuccess={googleAuthenticate}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
      <span className='text-gray-400 flex justify-center' >Already have a account ? <Link className='text-green-400' to='/login'> CLICK HERE </Link> </span>
      </div>
    
    </div>
    
  )
}
