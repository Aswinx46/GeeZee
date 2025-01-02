import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaEllipsisH, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../axios/adminAxios'
import { toast } from 'react-toastify';
import EditProduct from './editProduct';
import { useDispatch } from 'react-redux';
import { addProductSlice } from '@/redux/slices/editProductSlice';
import Pagination from '../Pagination/Pagination';
const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5)
  const[changePage,setChangePage]=useState(false)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const fetchProducts = async () => {

      const products = await axios.get(`/products/${currentPage}`)
      console.log(products)
      setProducts(products.data.products)

    }
    fetchProducts()
  }, [,changePage])
  const [activeDropdown, setActiveDropdown] = useState(null);

  const EditProduct = async (index) => {
    const product = products.find((_, ind) => ind == index)
    console.log(product)
    dispatch(addProductSlice(product))
    navigate('/editProduct')

  }
  const filteredProducts = products.filter(
    (product) =>
      product.title?.toLowerCase().includes(search.toLowerCase()) ||
      product.status?.toLowerCase().includes(search.toLowerCase())

  );
  console.log(filteredProducts)
  

  const onPageChange=async(newPage)=>{
    setCurrentPage(newPage)
    setChangePage(!changePage)
    
    
  }

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
              onChange={(e) => setSearch(e.target.value)}
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
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <img
                      src={product.productImg[0]}
                      alt={product.name}
                      className="w-20 h-12 object-cover rounded border border-gray-200"
                    />
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-900">{product.title}</td>
                <td className="py-4 px-6 text-gray-600">{product.sku}</td>
                <td className="py-4 px-6 text-gray-600">{product.price}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                    {product.stock}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                    {product.categoryId.categoryName}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === product._id ? null : product._id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <FaEllipsisH />
                      </button>
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === product._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-10"
                          >
                            <button onClick={() => EditProduct(index)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
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
        {/* <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
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
        </div> */}
        <Pagination  totalPages={totalPage} currentPage={currentPage} onPageChange={onPageChange}/>
      </motion.div>
    </div>
  );
};

export default ProductList;
