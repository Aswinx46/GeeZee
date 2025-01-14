import React, { useCallback, useEffect, useState } from 'react';
import { Link, replace, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaShoppingCart, FaSearch, FaUser, FaCrown, FaStore, FaTimes } from 'react-icons/fa';
import { store } from '../../redux/store'
import logo from '../../assets/GeeZee.png'
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '@/redux/slices/userSlice';
import { persistor } from '../../redux/store';
import { removeToken } from '@/redux/slices/tokenSlice';
import { resetCounter } from '@/redux/slices/CartCounter';
import Badge from '@mui/material/Badge';
import { throttle } from 'lodash';
import { toast } from 'react-toastify';
import axios from '../../axios/userAxios'

const Header = (props) => {
  const [isHovered, setIsHovered] = useState(null);
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(false)
  const [checkToken, setCheckToken] = useState(false)
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState([])
  const userData = useSelector(state => state.user.user);

  const token=useSelector(state=>state.token.token)
  
  const CartCount = useSelector(state => state.cartCounter.count)

  
  const userLoggedIn = userData?._id? true:false;




  const dispatch = useDispatch()

  const handleCartClick = (e) => {
    if (!userLoggedIn) {
      e.preventDefault();
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const throttledSearch = useCallback(
    throttle(async (searchTerm) => {
      if (!searchTerm) {
        setResult([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/search',{
          params : {searchTerm},
        })
        setResult(response.data.products)
      } catch (error) {
        console.log('error while searching')
        toast.error('error while searching')
      } finally {
        setLoading(false)
      }
    }, 2000),
    [setResult, setLoading]
  )

  useEffect(() => {
    // Only cleanup
    return () => throttledSearch.cancel && throttledSearch.cancel();
  }, [throttledSearch]);

  const handleLogin = () => {
    navigate('/login');
  };



  const handleLogout = async () => {
    navigate('/', { replace: true });
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    setIsLogin(false);
    dispatch(removeUser())
    dispatch(removeToken())
    localStorage.clear()
    dispatch(resetCounter())
    await persistor.purge();

  };

  const handleSearch=(e)=>{
    const query=e.target.value
    setSearchTerm(query)
    throttledSearch(query)
    
  }

  const handleSelectProduct=(product)=>{
    setShowSearch(false);
    localStorage.setItem("selectedProduct", JSON.stringify([product]));
    navigate('/productDetails')
  }


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
              { name: 'Best Sellers', icon: FaCrown, path: '/bestSeller' },
              { name: 'Shop', icon: FaStore, path: '/productPage' },
              {
                name: 'Search',
                icon: FaSearch,
                path: '#',
                onClick: () => setShowSearch(true)
              },
              // { name: 'Cart', icon: FaShoppingCart, path: '/cart' },
              ...(userLoggedIn ? [{ name: 'Cart', icon: FaShoppingCart, path: '/cart' }] : []),
              ...(userLoggedIn ? [{ name: 'Account', icon: FaUser, path: '/sidebar' }] : [])
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
                  onClick={item.onClick}
                >
                  {item.name === 'Cart' ? (
                    <div onClick={handleCartClick}>

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
                    </div>
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
              {userLoggedIn? <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-violet-400 transition-colors duration-200"
              >
                <FaUser className="text-lg" />
                <span className="font-medium">Logout</span>
              </button> : <button
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

      {/* Search Popup */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-20 left-[34%] transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-8 z-50 w-[600px] max-w-[90vw]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Search Products</h3>
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={ handleSearch}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        navigate(`/search?q=${searchTerm}`);
                        setShowSearch(false);
                      }
                    }}
                    className="w-full px-5 py-3 text-base bg-white border-2 border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                             text-black placeholder-gray-400 transition-all duration-200"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {/* Search Results Section */}
                {searchTerm && result.length > 0 && (
                  <div className="mt-4 max-h-60 overflow-y-auto bg-white rounded-lg shadow-lg">
                    {result.map((product) => (
                      <div
                        key={product._id}
                        className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        onClick={()=>handleSelectProduct(product)}
                      >
                        <div className="flex items-center space-x-4">
                          <img 
                            src={product.productImg[0]} 
                            alt={product.title} 
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{product.title}</h4>
                            <p className="text-sm text-gray-500">{product.description.substring(0, 60)}...</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">₹{product.variants[0].price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {searchTerm && result.length === 0 && !loading && (
                  <div className="mt-4 p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                    No products found
                  </div>
                )}
                {loading && (
                  <div className="mt-4 p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                    Searching...
                  </div>
                )}
                <div className="flex justify-end">
                  {/* <button
                    onClick={handleSearch}
                    className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 
                             transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FaSearch className="h-4 w-4" />
                    <span>Search</span>
                  </button> */}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* <BreadCrumps/> */}
    </motion.header>
  );
};

export default Header;
