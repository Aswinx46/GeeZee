import React, { useEffect, useState } from 'react';
import { Link, replace, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaShoppingCart, FaSearch, FaUser, FaCrown, FaStore } from 'react-icons/fa';
import {store} from '../../redux/store'
import logo from '../../assets/GeeZee.png'
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '@/redux/slices/userSlice';
import { persistor } from '../../redux/store';
import { removeToken } from '@/redux/slices/tokenSlice';

import Badge from '@mui/material/Badge';
const Header = (props) => {
  const [isHovered, setIsHovered] = useState(null);
  const navigate=useNavigate()
  const[isLogin,setIsLogin]=useState(false)
  const[checkToken,setCheckToken]=useState(false)
  const[user,setUser]=useState({})

  const userData = useSelector(state=>state.user.user);
  const CartCount=useSelector(state=>state.cartCounter.count)
  console.log(userData)
  const dispatch = useDispatch()



  const handleLogin = () => {
    navigate('/login');
    console.log("Login button clicked");
  };
  


  const handleLogout = () => {
  
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    setIsLogin(false);
    dispatch(removeUser())
    dispatch(removeToken())
    localStorage.clear()
    persistor.purge();
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
            <Link to="/" className="">
            <img className='h-20 w-30' src={logo}></img>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', icon: FaHome, path: '/' },
              { name: 'Best Sellers', icon: FaCrown, path: '/productPage' },
              { name: 'Shop', icon: FaStore, path: '/productPage' },
              { name: 'Search', icon: FaSearch, path: '#' },
              { name: 'Cart', icon: FaShoppingCart, path: '/cart' },
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
                  {item.name === 'Cart' ? (
                    <Badge
                      badgeContent={CartCount} // Replace with dynamic cart count
                      color="secondary"
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <item.icon className={`text-lg ${isHovered === index ? 'text-violet-400' : ''}`} />
                    </Badge>
                  ) : (
                    <item.icon className={`text-lg ${isHovered === index ? 'text-violet-400' : ''}`} />
                  )}

                  {/* <item.icon className={`text-lg ${isHovered === index ? 'text-violet-400' : ''}`} /> */}
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


// import React, { useEffect, useState } from 'react';
// import { Link, replace, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaHome, FaShoppingCart, FaSearch, FaUser, FaCrown, FaStore, FaTimes } from 'react-icons/fa';
// import { store } from '../../redux/store';
// import logo from '../../assets/GeeZee.png';
// import { useSelector, useDispatch } from 'react-redux';
// import { removeUser } from '@/redux/slices/userSlice';
// import { persistor } from '../../redux/store';
// import { removeToken } from '@/redux/slices/tokenSlice';

// const Header = (props) => {
//   const [isHovered, setIsHovered] = useState(null);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(false);
//   const [checkToken, setCheckToken] = useState(false);
//   const [user, setUser] = useState({});

//   const userData = useSelector(state => state.user.user);

//   console.log(userData);
//   const dispatch = useDispatch();

//   const handleLogin = () => {
//     navigate('/login');
//     console.log("Login button clicked");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('id');
//     localStorage.removeItem('user');
//     setIsLogin(false);
//     dispatch(removeUser());
//     dispatch(removeToken());
//     localStorage.clear();
//     persistor.purge();
//     navigate('/', { replace: true });
//     console.log("Logout button clicked");
//   };

//   const toggleSearch = () => {
//     if (isSearchOpen) {
//       setTimeout(() => setIsSearchOpen(false), 300);
//     } else {
//       setIsSearchOpen(true);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     // Handle search submission here
//     console.log("Search submitted");
//     setIsSearchOpen(false);
//   };

//   return (
//     <motion.header 
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="bg-gradient-to-r bg-black border-b border-purple-500"
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-20 text-white">
//           {/* Logo */}
//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="flex items-center"
//           >
//             <Link to="/" className="">
//               <img className='h-20 w-30' src={logo} alt="GeeZee Logo" />
//             </Link>
//           </motion.div>

//           {/* Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             <motion.div 
//               className="flex items-center space-x-8"
//               animate={{ marginRight: isSearchOpen ? "200px" : "0px" }}
//               transition={{ duration: 0.3 }}
//             >
//               {[
//                 { name: 'Home', icon: FaHome, path: '/' },
//                 { name: 'Best Sellers', icon: FaCrown, path: '/productPage' },
//                 { name: 'Shop', icon: FaStore, path: '/productPage' },
//                 { name: 'Cart', icon: FaShoppingCart, path: '/cart' },
//                 { name: 'Account', icon: FaUser, path: '#' }
//               ].map((item, index) => (
//                 <motion.div
//                   key={index}
//                   whileHover={{ scale: 1.1 }}
//                   onHoverStart={() => setIsHovered(index)}
//                   onHoverEnd={() => setIsHovered(null)}
//                 >
//                   <Link
//                     to={item.path}
//                     className="flex items-center space-x-1 hover:text-violet-400 transition-colors duration-200"
//                   >
//                     <item.icon className={`text-lg ${isHovered === index ? 'text-violet-400' : ''}`} />
//                     <span className="font-medium">{item.name}</span>
//                   </Link>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Search Button and Input */}
//             <motion.div className="relative flex items-center">
//               <AnimatePresence>
//                 {isSearchOpen && (
//                   <motion.form
//                     initial={{ width: 0, opacity: 0 }}
//                     animate={{ width: "200px", opacity: 1 }}
//                     exit={{ width: 0, opacity: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="absolute right-0 flex items-center"
//                     onSubmit={handleSearchSubmit}
//                   >
//                     <input
//                       type="text"
//                       placeholder="Search..."
//                       className="w-full px-4 py-2 text-black rounded-l-md focus:outline-none bg-white"
//                     />
//                   </motion.form>
//                 )}
//               </AnimatePresence>
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 onClick={toggleSearch}
//                 className={`flex items-center space-x-1 hover:text-violet-400 transition-colors duration-200 ${isSearchOpen ? 'bg-violet-600 rounded-r-md px-3 py-2' : ''}`}
//               >
//                 {isSearchOpen ? <FaTimes className="text-lg" /> : <FaSearch className="text-lg" />}
//                 <span className="font-medium">{isSearchOpen ? '' : 'Search'}</span>
//               </motion.button>
//             </motion.div>

//             {/* Login/Logout Button */}
//             <motion.div whileHover={{ scale: 1.1 }}>
//               {userData ? (
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center space-x-1 hover:text-violet-400 transition-colors duration-200"
//                 >
//                   <FaUser className="text-lg" />
//                   <span className="font-medium">Logout</span>
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleLogin}
//                   className="flex items-center space-x-1 hover:text-violet-400 transition-colors duration-200"
//                 >
//                   <FaUser className="text-lg" />
//                   <span className="font-medium">Login</span>
//                 </button>
//               )}
//             </motion.div>
//           </nav>

//           {/* Mobile Menu Button */}
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             className="md:hidden p-2 rounded-lg hover:bg-indigo-900 transition-colors duration-200"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             </svg>
//           </motion.button>
//         </div>
//       </div>
//     </motion.header>
//   );
// };

// export default Header;






