

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
import ProtectedRoute from './components/protectedRoute/protectedRoute';
import BrandManagement from './components/BrandManagement/BrandManagement';
import OrderDetails from './components/orderDetails/SpecificOrderDetail';
import OrderTable from './components/orderDetails/OrderTable';
import ReturnedOrdersTable from './components/orderDetails/ReturnOrderTable';
import CouponCreationForm from './components/CouponManagement/CouponCreation';
import CouponListing from './components/CouponManagement/CouponListing'
import SalesReport from './components/salesReport/SalesReport';
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
          <Route path='/' element={  <AdminLoginPage />  } />
          <Route path='/dashboard' element={ <ProtectedRoute> <SalesReport /> </ProtectedRoute> } />
          <Route path='/users' element={ <ProtectedRoute> <UserList /> </ProtectedRoute> } />
          <Route path='/categoryManagement' element={ <ProtectedRoute> <CategoryManagement /> </ProtectedRoute>} />
          <Route path='/addProduct' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path='/showProduct' element={<ProtectedRoute> <ShowProduct /> </ProtectedRoute>} />
          <Route path='/editProduct' element={<ProtectedRoute> <EditProduct /></ProtectedRoute>} />
          <Route path='/BrandManagement' element={<ProtectedRoute> <BrandManagement /></ProtectedRoute>} />
          <Route path='/orderDetails' element={<ProtectedRoute> <OrderTable /></ProtectedRoute>} />
          <Route path='/returnOrderDetails' element={<ProtectedRoute> <ReturnedOrdersTable /></ProtectedRoute>} />
          <Route path='/addCoupon' element={<ProtectedRoute> <CouponCreationForm /></ProtectedRoute>} />
          <Route path='/couponList' element={<ProtectedRoute> <CouponListing /></ProtectedRoute>} />
          <Route path='/salesReport' element={<ProtectedRoute> <SalesReport /></ProtectedRoute>} />

        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  )
}

export default App


