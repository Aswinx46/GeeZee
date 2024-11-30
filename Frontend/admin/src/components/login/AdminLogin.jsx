import React, { useState } from 'react';
import axios from '../../../axios/adminAxios'
import { useNavigate } from "react-router";
import {toast} from 'react-toastify'
import { addToken } from '@/redux/slices/tokenSlice';
import { useDispatch } from 'react-redux';
export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const validateForm = () => {
    let formErrors = {};
 
   
    if (!email) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid';
    }

 
    if (!password) {
      formErrors.password = 'Password is required';
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {

      try {
        
        const response=await axios.post('/login',{email,password})
        console.log(response)
        dispatch(addToken(response.data.token))
        toast.success(response.data.message)

        navigate('/dashboard')
        
        
      } catch (error) {
        console.log(error)
      }
   
     
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
            GeeZee Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400" style={{ fontFamily: 'Arial, sans-serif' }}>
            Enter your credentials to access the admin panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                style={{ fontFamily: 'Arial, sans-serif' }}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="mt-2 text-sm text-red-500" style={{ fontFamily: 'Arial, sans-serif' }}>{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                style={{ fontFamily: 'Arial, sans-serif' }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="mt-2 text-sm text-red-500" style={{ fontFamily: 'Arial, sans-serif' }}>{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400" style={{ fontFamily: 'Arial, sans-serif' }}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-green-500 hover:text-green-400" style={{ fontFamily: 'Arial, sans-serif' }}>
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

