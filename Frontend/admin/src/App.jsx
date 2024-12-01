// import { useState } from 'react'
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import reactLogo from './assets/react.svg'
// import AdminLoginPage from './components/login/AdminLogin'
// import {BrowserRouter,Route,Routes} from 'react-router-dom'
// import AdminDashboard from './components/dashboard/AdminDashboard';
// import UserList from './components/dashboard/UserList';
// import CategoryManagement from './components/categoryManagement/categoryManage';
// import AddProduct from './components/productManagement/AddProduct'
// import ShowProduct from './components/productManagement/showProducts'
// function App() {


//   return (
//     <BrowserRouter>
//     <ToastContainer/>
//     <Routes>
//     <Route path='/' element={<AdminLoginPage/>}></Route>
//     <Route path='/dashboard' element={<AdminDashboard/>}></Route>
//     <Route path='/users' element={<UserList/>}></Route>
//     <Route path='/categoryManagement' element={<CategoryManagement/>}></Route>
//     <Route path='/addProduct' element={<AddProduct/>}></Route>
//     <Route path='/showProduct' element={<ShowProduct/>}></Route>
//     </Routes>
//     </BrowserRouter>
    
//   )
// }

// export default App
import { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import reactLogo from './assets/react.svg'
import AdminLoginPage from './components/login/AdminLogin'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserList from './components/dashboard/UserList';
import CategoryManagement from './components/categoryManagement/categoryManage';
import AddProduct from './components/productManagement/AddProduct'
import ShowProduct from './components/productManagement/showProducts'
import Layout from './components/sidebar/layout'
import EditProduct from './components/productManagement/editProduct';

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  

  if (location.pathname === '/') {
    return children;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <LayoutWrapper>
        <Routes>
          <Route path='/' element={<AdminLoginPage />} />
          <Route path='/dashboard' element={<AdminDashboard />} />
          <Route path='/users' element={<UserList />} />
          <Route path='/categoryManagement' element={<CategoryManagement />} />
          <Route path='/addProduct' element={<AddProduct />} />
          <Route path='/showProduct' element={<ShowProduct />} />
          <Route path='/editProduct' element={<EditProduct />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  )
}

export default App


