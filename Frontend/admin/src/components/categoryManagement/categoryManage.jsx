import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import axios from '../../../axios/adminAxios'
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion';

const StaticCategoryManagement = () => {

    const [newCategory,setNewCategory]=useState('')
    const [categories,setCategories]=useState([])
    const[fetch,setFetch]=useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const[editNameCategory,setEditNameCategory]=useState('')
    const[selectedId,setSelectedId]=useState(null)

    useEffect(()=>{
        const fetchCategory=async () => {
          try {
            const category=await axios.get('/category')
            
            setCategories(category.data.category)
            console.log('category added in the state')
          } catch (error) {
            console.log(error)
            toast.error('error in fetching category')
          }
            
        }
        fetchCategory()
    },[fetch])




    const handleAddCategory=async (e) => {
        e.preventDefault()
        console.log(categories)
        if(newCategory.trim())
      {
      
        
        try {
            console.log(newCategory)
            const duplicate=categories.filter((cat)=>cat.categoryName.toLowerCase()==newCategory.toLowerCase())
            if(duplicate.length>0) 
              {
                toast.error('category already exist')
                return;
              }
            
            const response=await axios.post('/addCategory',{newCategory})
            console.log(response)
            setFetch(!fetch)
        } catch (error) {
            console.log('error in adding the category',error)
            toast.error(error.response.data.message)
          
        }
      }else{

        console.log('cant add empty string')
        toast.error('cant add empty string')
      }
    }

    const handleStatus=async(id)=>{
      try {
        const category=categories.find((cat)=>cat._id==id)
        const status=category.status=='active'?'inactive':'active'
        console.log(status)
        const response =await axios.patch(`/editCategory/${id}`,{status})
        console.log(response)
        toast.success(response.data.message)
        setCategories((p)=>p.map((cat)=>cat._id==id?{...cat,status:status}:cat))
      } catch (error) {
        console.log('error in changing the status of the response',error)
      }
 

    }

    const handleEditCategory = async () => {
      try {
        console.log(selectedId)
        console.log(editNameCategory)
        setIsEditOpen(false)
        const editName=await axios.patch(`/editCategoryName/${selectedId}`,{editNameCategory})
        console.log(editName.data.changeName)
       setFetch(!fetch)
       toast.success(editName.data.message)
        // setCategories(editName.data.changeName)
      } catch (error) {
        console.log('error in editing the category', error.message)
      }
    }

   

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-black mb-8 border-l-4 border-green-500 pl-4"
        >
          Category Management
        </motion.h1>

        {/* Categories Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden border border-gray-200"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white">
                <th className="py-3 px-6 text-left">S.No</th>
                <th className="py-3 px-6 text-left">Category Name</th>
                <th className="py-3 px-6 text-center">List / Unlist</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                  <td className="py-4 px-6">
                    <span className="text-gray-800 font-medium">{category.categoryName}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => handleStatus(category._id)} 
                        className={`${
                          category.status === 'active' 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-red-500 hover:bg-red-600'
                        } text-white transition-colors duration-200`}
                      >
                        {category.status}
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center space-x-3">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        onClick={() => {
                          setIsEditOpen(true)
                          setEditNameCategory(category.categoryName)
                          setSelectedId(category._id)
                        }}
                      >
                        <FaEdit size={18} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <FaTrash size={18} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Add New Category Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-black mb-6 border-l-4 border-green-500 pl-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="w-full bg-white border-2 border-gray-200 text-black px-4 py-2 rounded-md 
                          focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 
                       transition-colors flex items-center space-x-2 shadow-lg"
            >
              <FaPlusCircle />
              <span>Add</span>
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Edit Category Popup */}
      {isEditOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-4 rounded-lg shadow-lg w-72"
          >
            <h2 className="text-lg font-semibold text-black mb-3 border-l-4 border-green-500 pl-3">Edit Category</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={editNameCategory}
                onChange={(e) => setEditNameCategory(e.target.value)}
                className="w-full bg-white border-2 border-gray-200 text-black px-3 py-1.5 rounded-md 
                          focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Edit category name"
              />
              <div className="flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditCategory}
                  className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition-colors"
                >
                  Submit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {setIsEditOpen(false)}}
                  className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StaticCategoryManagement;


