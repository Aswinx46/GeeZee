import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaList,
  FaIndustry ,
  FaArrowCircleLeft,
  FaTicketAlt,
  FaChartLine,
  FaRegFlag  
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"


const Sidebar = () => {
  const menuItems = [
    // { icon: FaHome, text: 'Dashboard', href: '/dashboard' },
    { icon: FaHome, text: 'Dashboard', href: '/salesReport' },
    { icon: FaBox, text: 'Products', href: '/showProduct' },
    { icon: FaShoppingCart, text: 'Orders', href: '/orderDetails' },
    { icon: FaUsers, text: 'Customers', href: '/users' },
    { icon: FaList, text: 'Categories', href: '/categoryManagement' },
    { icon: FaIndustry , text: 'Brand', href: '/BrandManagement' },
    { icon: FaArrowCircleLeft , text: 'Return Orders', href: '/returnOrderDetails' },
    { icon: FaTicketAlt , text: 'Coupon', href: '/couponList' },
    { icon: FaChartLine  , text: 'Trending', href: '/trending' },
    { icon: FaRegFlag   , text: 'Banner', href: '/bannerManagement' }
  ];
  const navigate=useNavigate()
  const handleLogout=()=>{
    navigate('/', { replace: false });
    localStorage.removeItem('id')
  }
  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-[280px] bg-black text-white p-6 z-50"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold">GeeZee</h1>
      </motion.div>

      {/* Navigation Menu */}
      <nav>
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-2"
        >
          {menuItems.map((item, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <Link
                to={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.text}</span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
        <Button onClick={handleLogout} variant="outline">LOGOUT</Button>

      </nav>
    </motion.div>
  );
};

export default Sidebar;

