import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import axios from '../../../axios/adminAxios'
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaUpload, FaImage } from 'react-icons/fa';
import OfferModal from '../productManagement/OrderManagement';
const StaticCategoryManagement = () => {

    const [newCategory,setNewCategory]=useState('')
    const [categories,setCategories]=useState([])
    const[fetch,setFetch]=useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const[editNameCategory,setEditNameCategory]=useState('')
    const[selectedId,setSelectedId]=useState(null)
    const [OpenOffer, setOpenOffer] = useState(false)
    const[selectedCateogryId,setSelectedCategoryId]=useState()
    const[offerCategories,setOfferCategories]=useState([])
    const[selectedOffer,setSelectedOffer]=useState({})
    const[update,setUpdate]=useState(false)
    useEffect(()=>{
        const fetchCategory=async () => {
          try {
            const category=await axios.get('/category')
            
            setCategories(category.data.category)
            const offerCategories=category.data.category.filter((category)=>category.categoryOffer)
            setOfferCategories(offerCategories)
            
          } catch (error) {
            console.log(error)
            toast.error('error in fetching category')
          }
            
        }
        fetchCategory()
    },[fetch,update])




    const handleAddCategory=async (e) => {
        e.preventDefault()
        if(newCategory.trim())
      {
      
        
        try {
            const duplicate=categories.filter((cat)=>cat.categoryName.toLowerCase()==newCategory.toLowerCase())
            if(duplicate.length>0) 
              {
                toast.error('category already exist')
                return;
              }
            
            const response=await axios.post('/addCategory',{newCategory})
            setFetch(!fetch)
        } catch (error) {
            console.log('error in adding the category',error)
            toast.error(error.response.data.message)
          
        }
      }else{

        toast.error('cant add empty string')
      }
    }

    const handleStatus=async(id)=>{
      try {
        const category=categories.find((cat)=>cat._id==id)
        const status=category.status=='active'?'inactive':'active'
        const response =await axios.patch(`/editCategory/${id}`,{status})
        toast.success(response.data.message)
        setCategories((p)=>p.map((cat)=>cat._id==id?{...cat,status:status}:cat))
      } catch (error) {
        console.log('error in changing the status of the response',error)
      }
 

    }

    const handleEditCategory = async () => {
      try {
    

        const clone=categories.find((item)=>item.categoryName.toLowerCase()==editNameCategory.toLowerCase())
        setIsEditOpen(false)
        if(clone)
        {
          toast.error('this category is already exist')
          return
        }
        const editName=await axios.patch(`/editCategoryName/${selectedId}`,{editNameCategory})
       setFetch(!fetch)
       toast.success(editName.data.message)
        // setCategories(editName.data.changeName)
      } catch (error) {
        console.log('error in editing the category', error.message)
        toast.error(error.response.data.message)
      }
    }

   const handleAddOfferCateogry=(category)=>{
     setOpenOffer(true)
    setSelectedCategoryId(category._id)

   }

   const handleListOffer = async (id) => {
    try {
      const response = await axios.patch(`/changeListOfferCategory/${id}`);
      toast.success(response.data.message);
      setUpdate(!update)
   
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleEditCategoryOffer=(category)=>{
    setSelectedOffer(category.categoryOffer)
    setSelectedCategoryId(category._id)
    setOpenOffer(true)
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
                <th className="py-3 px-6 text-center">Add Offer</th>
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
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={()=>handleAddOfferCateogry(category)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 ease-in-out"
                      >
                        <FaSave className="mr-2" />
                        Add Offer
                      </motion.button>
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
          <OfferModal OpenOffer={OpenOffer} setUpdate={setUpdate} setOpenOffer={setOpenOffer} categoryId={selectedCateogryId} existingProductOffer={selectedOffer}/>
        </motion.div>

        {/* Category Offers Section */}
        {offerCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden border border-gray-200"
          >
            <div className="bg-black text-white py-4 px-6">
              <h2 className="text-xl font-semibold">Category Offers</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6">
                {offerCategories.map((category) => (
                  <div key={category._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{category.categoryName}</h3>
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditCategoryOffer(category)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit Offer
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleListOffer(category.categoryOffer._id)}
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                            category.categoryOffer?.isListed 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50`}
                        >
                          {category.categoryOffer?.isListed ? 'Block' : 'Unblock'}
                        </motion.button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Offer Type:</span>
                        <p className="font-medium capitalize">{category.categoryOffer?.offerType}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Offer Value:</span>
                        <p className="font-medium">
                          {category.categoryOffer?.offerType === 'percentage'
                            ? `${category.categoryOffer?.offerValue}%`
                            : `₹${category.categoryOffer?.offerValue}`}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Start Date:</span>
                        <p className="font-medium">
                          {new Date(category.categoryOffer?.validFrom).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">End Date:</span>
                        <p className="font-medium">
                          {new Date(category.categoryOffer?.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

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
