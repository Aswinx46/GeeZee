import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, MapPin, Key, User, Wallet, LogOut } from 'lucide-react';
import AddressForm from './Address';
import Wishlist from './Wishlist';
import ChangePassword from './ChangePassword';
import AccountDetails from './AccountDetails';
import WalletPage from './Wallet';
import Home from '../home/Home';
import OrderDetails from './OrderDetails';
const menuItems = [
  { id: 1, icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { id: 2, icon: Heart, label: 'Wishlist', path: '/home/wishlist' },
  { id: 3, icon: MapPin, label: 'Address', path: '/address' },
  { id: 4, icon: Key, label: 'Password', path: '/changePassword' },
  { id: 5, icon: User, label: 'Account Detail', path: '/accountDetails' },
  { id: 6, icon: Wallet, label: 'Wallet', path: '/wallet' },

];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(5); // Setting Address as default active item
  const [hoveredItem, setHoveredItem] = useState(null);

  const renderPage=() => {
   
    switch(activeItem)
    {
      case 1:
        return <OrderDetails/>
      
      case 2:
        return <Wishlist/>

      case 3:
        return <AddressForm/>

      case 4:
        return <ChangePassword/>

      case 5:
        return <AccountDetails/>

      case 6:
        return <WalletPage/>

      default :
        return <Home/>
    }
  }

  return (
    <div className="flex">
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-64 min-h-screen bg-black border-r border-gray-200 py-6 px-4"
    >
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.id * 0.1 }}
            >
              <motion.button
                className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 text-gray-700
                  ${activeItem === item.id ? 'bg-gray-50' : 'hover:bg-gray-50'}
                  transition-colors duration-200`}
                onClick={() => setActiveItem(item.id)}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{
                    scale: hoveredItem === item.id ? 1.2 : 1,
                    color: activeItem === item.id ? "#000" : "#666"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon size={20} strokeWidth={1.5} />
                </motion.span>
                <span className={`${activeItem === item.id ? 'font-medium text-black' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.div>
    <div className="flex-grow p-6">
        {renderPage()} 
      </div>
    </div>
  );
};

export default Sidebar;

