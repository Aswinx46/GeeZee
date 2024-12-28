import { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header/header'
import SignupPage from './components/signup/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
import Sidebar from './components/accountDetails/SideBar';
import AddressForm from './components/accountDetails/Address';
import Wishlist from './components/accountDetails/Wishlist';
import ChangePassword from './components/accountDetails/ChangePassword';
import AccountDetails from './components/accountDetails/AccountDetails';
import Wallet from './components/accountDetails/Wallet';
import OrderDetails from './components/accountDetails/OrderDetails';
import CheckoutPage from './components/checkoutPage/checkOutPage';
import CheckOutSuccess from './components/checkoutPage/CheckOutSuccess'
import OrderDetailsTable from './components/orderDetails/orderTable';
import BestSellers from './components/bestSeller/ProductCard';
import OTPVerification from './components/accountDetails/ChangeEmailOtpVerification';
import UserBlockedNotice from './extraAddonComponents/UserBlockedNotice';
import NotFoundPage from './extraAddonComponents/NotFoundPage';
function App() {


  return (
    <BrowserRouter>
      <ToastContainer />
      <ScrollToTop />
      <Header />
      <BreadCrumps />
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/prod' element={<Prod />}></Route>
        <Route path='/otpVerification' element={<OtpVerification />}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/home' element={<HomePage />}></Route>
        <Route path='/productPage' element={<ProductPage />}></Route>
        {/* <Route path='/productDetails' element={  <ProductDetails/>}></Route> */}
        <Route path="/productDetails/:id?" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/productDetails/cart" element={<Cart />}></Route>
        <Route path="/ProductVariants" element={<ProductVariants />}></Route>
        <Route path="/sidebar" element={<ProtectedRoute> <Sidebar /> </ProtectedRoute> }></Route>
        <Route path="/address" element={<AddressForm />}></Route>
        <Route path="/home/wishlist" element={<Wishlist />}></Route>
        <Route path="/changePassword" element={<ChangePassword />}></Route>
        <Route path="/accountDetails" element={<AccountDetails />}></Route>
        <Route path="/wallet" element={<Wallet />}></Route>
        <Route path="/order" element={<OrderDetails />}></Route>
        <Route path="/checkoutPage" element={<CheckoutPage />}></Route>
        <Route path="/checkoutSuccess" element={<CheckOutSuccess />}></Route>
        <Route path="/orderDetailsTable" element={<OrderDetailsTable />}></Route>
        <Route path="/bestSeller" element={<BestSellers />}></Route>
        <Route path="/emailOtpVerification" element={<OTPVerification />}></Route>
        <Route path="/userBlockNotice" element={<UserBlockedNotice />}></Route>
        <Route path="*" element={<NotFoundPage />} />


      </Routes>
      <Footer />
    </BrowserRouter>

  )
}

export default App
