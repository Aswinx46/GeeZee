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
function App() {


  return (
    <BrowserRouter>
    <ToastContainer/>
    <Header/>
    <Routes>
       <Route path='/' element={<SignupPage/>}></Route>
       <Route path='/otpVerification' element={<OtpVerification/>}></Route>
       <Route path='/login' element={<LoginPage/>}></Route>
       <Route path='/home' element={<HomePage/>}></Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
