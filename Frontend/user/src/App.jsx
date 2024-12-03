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
import ProtectedRoute from './components/protectedRoute/protectedRoute';
import Signup from './components/signup/Signup'
import Prod from './product'
function App() {


  return (
    <BrowserRouter>
    <ToastContainer/>
    <Header/>
    <Routes>
       <Route path='/' element={<HomePage/>}></Route>
       <Route path='/signup' element={<Signup/>}></Route>
       <Route path='/prod' element={<Prod/>}></Route>
       <Route path='/otpVerification' element={ <OtpVerification/>   }></Route>
       <Route path='/login' element={ <LoginPage/>}></Route>
       <Route path='/home' element={<ProtectedRoute> <HomePage/> </ProtectedRoute> }></Route>
       <Route path='/productPage' element={<ProtectedRoute>  <ProductPage/> </ProtectedRoute>}></Route>
       <Route path='/productDetails' element={ <ProtectedRoute> <ProductDetails/> </ProtectedRoute>}></Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
