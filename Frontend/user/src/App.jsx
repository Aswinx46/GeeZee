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
import ScrollToTop from './extraAddonComponents/ScrollToTop';
import BreadCrumps from './components/BreadCrump/BreadCrumps';
import Footer from './components/Footer/Footer';
import Cart from './components/cart/Cart';
import ProductVariants from './components/productDetails/ProductVariant';
function App() {


  return (
    <BrowserRouter>
    <ToastContainer/>
    <ScrollToTop/>
    <Header/>
    <BreadCrumps/>
    <Routes>
       <Route path='/' element={<HomePage/>}></Route>
       <Route path='/signup' element={<Signup/>}></Route>
       <Route path='/prod' element={<Prod/>}></Route>
       <Route path='/otpVerification' element={ <OtpVerification/>   }></Route>
       <Route path='/login' element={ <LoginPage/>}></Route>
       <Route path='/home' element={ <HomePage/> }></Route>
       <Route path='/productPage' element={  <ProductPage/>}></Route>
       {/* <Route path='/productDetails' element={  <ProductDetails/>}></Route> */}
       <Route path="/productDetails/:id?" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart/>}></Route>
        <Route path="/ProductVariants" element={<ProductVariants/>}></Route>
     
    </Routes>
    <Footer/>
    </BrowserRouter>
    
  )
}

export default App
