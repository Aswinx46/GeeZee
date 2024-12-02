import { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header/header'
import SignupPage from './components/signup/Signup'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import OtpVerification from './components/otpVerification/otpVerification'
import LoginPage from './components/Login/Login';
import HomePage from './components/home/Home';
import ProductPage from './components/productPage/ProductPage';
import ProductDetails from './components/productDetails/productDetails';
import protectedRoute from './components/protectedRoute/protectedRoute';
function App() {


  return (
    <BrowserRouter>
    <ToastContainer/>
    <Header/>
    <Routes>
       <Route path='/' element={<HomePage/>}></Route>
       <Route path='/otpVerification' element={<protectedRoute> <OtpVerification/> </protectedRoute>  }></Route>
       <Route path='/login' element={<protectedRoute>  <LoginPage/> </protectedRoute>}></Route>
       <Route path='/home' element={<protectedRoute> <HomePage/> </protectedRoute> }></Route>
       <Route path='/productPage' element={<protectedRoute>  <ProductPage/> </protectedRoute>}></Route>
       <Route path='/productDetails' element={ <protectedRoute> <ProductDetails/> </protectedRoute>}></Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
