import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axios/userAxios';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode'
import { GoogleLogin } from '@react-oauth/google';
import { addToken } from '../../redux/slices/tokenSlice';
import {useDispatch} from 'react-redux'
import Header from '../Header/header';
import { addUser } from '@/redux/slices/userSlice';
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState({})
  const [user, setUser] = useState({ email: "", password: "" })
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.target);
    const userInput = {
      email: data.get('email'),
      password: data.get('password'),
    };
    setUser(userInput);
    if (validation(userInput)) {
      try {
        const response = await axios.post('/login', {
          email: data.get('email'),
          password: data.get('password'),
        });
        console.log(response.data.user);
        
      
        dispatch(addToken(response.data.token))
        localStorage.setItem('id',response.data.user._id)
    
        dispatch(addUser(response.data.user))
        toast.success('Login successful!');
        navigate('/home',{replace:true});
     
      } catch (error) {
        console.error('Login failed:', error);
        toast.error(error.response.data.message)
     
      } finally {
        setIsLoading(false);
      }
    }else{
      setIsLoading(false);
    }

  };

  const validation = (userInput) => {
    const errors = {}
    if (!userInput.email.trim() || !/\S+@\S+\.\S+/.test(userInput.email)) {
      errors.email = 'Enter a valid email';
    }
    // Validate password
    if (!userInput.password.trim()) {
      errors.password = 'Password is required';
    } else if (userInput.password.length < 8) {
      errors.password = 'Password should be more than 8 characters';
    } else if (!/[A-Z]/.test(userInput.password)) {
      errors.password = 'Password should include at least one uppercase letter';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(userInput.password)) {
      errors.password = 'Password should include at least one special character';
    }
    setError(errors)
    return Object.keys(errors).length === 0; 
  }

  const googleAuthenticate = async (credentialResponse) => {
    if(credentialResponse?.credential)
      {
          try {
            const credential=jwtDecode(credentialResponse.credential)
            console.log(credential)
            const{email}=credential
            console.log(email)
            const response=await axios.post('/login',{email})
           console.log(response.data.user._id)
           localStorage.setItem('id',response.data.user._id)
           toast.success(response.data.message)
           dispatch(addToken(response.data.token))
            localStorage.setItem('id',response.data.user._id)
            localStorage.setItem('user',response.data.user)
            dispatch((addUser(response.data.user)))
           navigate('/home',{replace:true})
     
      
          } catch (error) {
            console.log('google authenticate failed',error)
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
          }
      }
    
    console.log('Google login clicked');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h2 className="mt-6 text-3xl font-bold text-white">Log in to your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"

                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <span className="text-red-500 text-sm">{error.email}</span>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}

                  autoComplete="current-password"

                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <span className="text-red-500 text-sm">{error.password}</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-700 rounded bg-gray-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-green-500 hover:text-green-400">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div onClick={googleAuthenticate} className="flex justify-center items-center mt-4">
              <GoogleLogin
                onSuccess={googleAuthenticate}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </div>
          </div>
        </div>

        <p className="mt-2 text-center text-sm text-gray-400">
          Don't have an account?{' '}

          <Link to='/signup' className='className="font-medium text-green-500 hover:text-green-400"' >  Sign up</Link>


        </p>
      </div>
    </div>
  );
}

