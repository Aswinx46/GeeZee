import { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import reactLogo from './assets/react.svg'
import AdminLoginPage from './components/login/AdminLogin'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import AdminDashboard from './components/dashboard/AdminDashboard';

function App() {


  return (
    <BrowserRouter>
    <ToastContainer/>
    <Routes>
    <Route path='/' element={<AdminLoginPage/>}></Route>
    <Route path='/dashboard' element={<AdminDashboard/>}></Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
