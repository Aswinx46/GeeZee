import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaEllipsisH, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from '../../../axios/adminAxios'
import { toast } from 'react-toastify';
const ProductList = () => {
  // Sample data for design purposes
  const [products,setProducts]=useState([])
//   const products = [
//     { id: 1, name: 'Xpro Keyboard', sku: '47514501', price: '$75.00', stock: 'In Stock', category: 'Keyboard', image: '/placeholder.svg?height=50&width=80' },
//     { id: 2, name: 'Logitech Keyboard', sku: '47514551', price: '$35.00', stock: 'In Stock', category: 'Mouse', image: '/placeholder.svg?height=50&width=80' },
//     { id: 3, name: 'Evolux Mouse', sku: '47514501', price: '$27.00', stock: 'In Stock', category: 'Monitor', image: '/placeholder.svg?height=50&width=80' },
//     { id: 4, name: 'Asus TUF A15', sku: '47514501', price: '$22.00', stock: 'In Stock', category: 'Laptop', image: '/placeholder.svg?height=50&width=80' },
//     { id: 5, name: '4090 Graphics Card', sku: '47514501', price: '$43.00', stock: 'In Stock', category: 'Monitor', image: '/placeholder.svg?height=50&width=80' },
//   ];

    useEffect(()=>{
        const fetchProducts=async()=>{

            const products= await axios.get('/products')
            console.log(products)
            setProducts(products.data.message.products)
            
            toast.success(products.data.message)
        }
        fetchProducts()
    },[])
  const [activeDropdown, setActiveDropdown] = useState(null);
  


  return (
    <div className="min-h-screen bg-white p-8">
      
      

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-64 bg-white text-gray-900 border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          {/* Add Product Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            <Link to='/addProduct' className="text-white">
              <span>Add product</span>
            </Link> 
          </motion.button>
        </div>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
      >
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">SKU</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Stock</th>
              <th className="py-3 px-6 text-left">Categories</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-12 object-cover rounded border border-gray-200"
                    />
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-900">{product.name}</td>
                <td className="py-4 px-6 text-gray-600">{product.sku}</td>
                <td className="py-4 px-6 text-gray-600">{product.price}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                    {product.stock}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                    {product.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === product.id ? null : product.id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <FaEllipsisH />
                      </button>
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === product.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-10"
                          >
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
                              Edit Product
                            </button>
                            <button className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left transition-colors">
                              Delete Product
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing 1 to 5 of 24 entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-black text-white">1</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">3</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductList;
