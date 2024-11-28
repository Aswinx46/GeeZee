import React, { useState } from 'react';
import { FaHome, FaUser, FaShoppingCart, FaHeart, FaSignOutAlt } from 'react-icons/fa';

const ProductCard = ({ name, price, image }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
    <img src={image} alt={name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-white text-lg font-semibold">{name}</h3>
      <p className="text-green-500 font-bold mt-2">${price.toFixed(2)}</p>
      <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200">
        Add to Cart
      </button>
    </div>
  </div>
);

const UserHomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const featuredProducts = [
    { id: 1, name: 'Gaming Mouse', price: 59.99, image: '/placeholder.svg?height=200&width=300&text=Gaming+Mouse' },
    { id: 2, name: 'Mechanical Keyboard', price: 129.99, image: '/placeholder.svg?height=200&width=300&text=Mechanical+Keyboard' },
    { id: 3, name: 'Gaming Headset', price: 89.99, image: '/placeholder.svg?height=200&width=300&text=Gaming+Headset' },
    { id: 4, name: 'Gaming Chair', price: 249.99, image: '/placeholder.svg?height=200&width=300&text=Gaming+Chair' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-green-500 text-2xl font-bold">GeeZee</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#" className="text-white hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium">
                    <FaHome className="inline mr-1" /> Home
                  </a>
                  <a href="#" className="text-gray-300 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <FaUser className="inline mr-1" /> Account
                  </a>
                  <a href="#" className="text-gray-300 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <FaShoppingCart className="inline mr-1" /> Cart
                  </a>
                  <a href="#" className="text-gray-300 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <FaHeart className="inline mr-1" /> Wishlist
                  </a>
                  <a href="#" className="text-gray-300 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <FaSignOutAlt className="inline mr-1" /> Logout
                  </a>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="text-white hover:bg-green-600 block px-3 py-2 rounded-md text-base font-medium">
              <FaHome className="inline mr-1" /> Home
            </a>
            <a href="#" className="text-gray-300 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <FaUser className="inline mr-1" /> Account
            </a>
            <a href="#" className="text-gray-300 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <FaShoppingCart className="inline mr-1" /> Cart
            </a>
            <a href="#" className="text-gray-300 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <FaHeart className="inline mr-1" /> Wishlist
            </a>
            <a href="#" className="text-gray-300 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <FaSignOutAlt className="inline mr-1" /> Logout
            </a>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to GeeZee Gaming</h1>
          <p className="text-xl text-gray-300 mb-6">Discover the latest gaming gear and accessories</p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Shop Now
          </button>
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['PC Gaming', 'Console Gaming', 'VR Gaming', 'Gaming Accessories'].map((category, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-white">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">&copy; 2023 GeeZee Gaming. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserHomePage;

