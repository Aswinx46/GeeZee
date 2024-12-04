import React, { useEffect, useState } from 'react';
import { Link, replace, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaShoppingCart, FaSearch, FaUser, FaCrown, FaStore } from 'react-icons/fa';
import {store} from '../../redux/store'
import BreadCrumps from '../BreadCrump/BreadCrumps';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '@/redux/slices/userSlice';
const Header = (props) => {
  const [isHovered, setIsHovered] = useState(null);
  const navigate=useNavigate()
  const[isLogin,setIsLogin]=useState(false)
  const[checkToken,setCheckToken]=useState(false)
  const[user,setUser]=useState({})

  const userData = useSelector(state=>state.user.user);
  const dispatch = useDispatch()



  const handleLogin = () => {
    navigate('/login');
    console.log("Login button clicked");
  };
  
  const handleLogout = () => {
  
    localStorage.removeItem('id');
    setIsLogin(false);
    dispatch(removeUser())
    navigate('/', { replace: true });
    console.log("Logout button clicked");
  };
  

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      // className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 text-white shadow-xl border-b border-violet-500/30"
            className="bg-gradient-to-r bg-black border-b border-purple-500"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 text-white 	">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 bg-clip-text text-transparent">
              GeeZee
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', icon: FaHome, path: '/' },
              { name: 'Best Sellers', icon: FaCrown, path: '/productPage' },
              { name: 'Shop', icon: FaStore, path: '/productPage' },
              { name: 'Search', icon: FaSearch, path: '#' },
              { name: 'Cart', icon: FaShoppingCart, path: '#' },
              { name: 'Account', icon: FaUser, path: '#' }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setIsHovered(index)}
                onHoverEnd={() => setIsHovered(null)}
              >
                <Link
                  to={item.path}
                  className="flex items-center space-x-1 hover:text-violet-400 transition-colors duration-200"
                >
                  <item.icon className={`text-lg ${isHovered === index ? 'text-violet-400' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </motion.div>
            ))}
            
            {/* Login Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
            >

              {userData ?      <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-violet-400 transition-colors duration-200"
              >
                <FaUser className="text-lg" />
                <span className="font-medium">Logout</span>
              </button> :      <button
                onClick={handleLogin}
                className="flex items-center space-x-1 hover:text-violet-400 transition-colors duration-200"
              >
                <FaUser className="text-lg" />
                <span className="font-medium">Login</span>
              </button>}
              {/* <button
                onClick={handleLogin}
                className="flex items-center space-x-1 hover:text-violet-400 transition-colors duration-200"
              >
                <FaUser className="text-lg" />
                <span className="font-medium">Login</span>
              </button> */}
         
            </motion.div>
          </nav>
            
          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg hover:bg-indigo-900 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
      </div>
      {/* <BreadCrumps/> */}
    </motion.header>
  );
};

export default Header;
