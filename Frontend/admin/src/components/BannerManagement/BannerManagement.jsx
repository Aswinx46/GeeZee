import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import cloudAxios from 'axios';
import axios from '../../../axios/adminAxios'

const BannerManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({
    name: '',
    startDate: '',
    endDate: '',
    video: ''
  });

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentBanners, setCurrentBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const[update,setUpdate]=useState(false)

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.95 }
  };

  useEffect(() => {
    fetchBanners();
  }, [update]);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/getBanners');
      setCurrentBanners(response.data.allBanners);
      console.log(response.data.allBanners)
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load current banners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bannerId, newStatus) => {
    try {
      await axios.patch(`/changeBannerStatus/${bannerId}`, { status: newStatus });
      toast.success('Banner status updated successfully');
      fetchBanners(); // Refresh the list
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast.error('Failed to update banner status');
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await axios.delete(`/deleteBanner/${bannerId}`);
        toast.success('Banner deleted successfully');
        fetchBanners(); // Refresh the list
      } catch (error) {
        console.error('Error deleting banner:', error);
        toast.error('Failed to delete banner');
      }
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Banner name is required';
        } else if (value.length < 3) {
          error = 'Banner name must be at least 3 characters long';
        } else if (value.length > 50) {
          error = 'Banner name must be less than 50 characters';
        }
        break;
      case 'startDate':
        if (!value) {
          error = 'Start date is required';
        } else if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          error = 'Start date cannot be in the past';
        }
        break;
      case 'endDate':
        if (!value) {
          error = 'End date is required';
        } else if (new Date(value) <= new Date(formData.startDate)) {
          error = 'End date must be after the start date';
        }
        break;
      case 'video':
        if (!selectedVideo) {
          error = 'Video is required';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateVideoFile = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid video format. Please upload MP4, WebM, or Ogg video';
    }
    if (file.size > maxSize) {
      return 'Video size must be less than 100MB';
    }
    return '';
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoError = validateVideoFile(file);
      if (videoError) {
        toast.error(videoError);
        setErrors(prev => ({ ...prev, video: videoError }));
        return;
      }

      setSelectedVideo(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, video: '' }));
    }
  };

  const handleDeleteVideo = () => {
    setSelectedVideo(null);
    setPreviewUrl('');
    setErrors(prev => ({ ...prev, video: '' }));
    // Reset the file input
    const fileInput = document.getElementById('video-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUploadBanner=async()=>{
    console.log('this is the form data',formData)
    console.log('thios is the video',selectedVideo)
    try {
      const cloudFormData  = new FormData();
      
     
      cloudFormData .append('file', selectedVideo);
     
      cloudFormData .append('upload_preset','Banner')
      cloudFormData .append('cloud_name','dotlezt0x')
     
      const responseFromCloudinary=await cloudAxios.post('https://api.cloudinary.com/v1_1/dotlezt0x/video/upload',cloudFormData)
      console.log(responseFromCloudinary)
      const videoUrl=responseFromCloudinary.data.secure_url
      const responseFromBackend=await axios.post('/createBanner',{formData,videoUrl})
      toast.success(responseFromBackend.data.message)
      setUpdate(!update)
      
    } catch (error) {
      console.log('error while uploading video',error)
      toast.error('error while uploading the video')
    }
  }

  return (
    <div className="space-y-8">
      <motion.div 
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Video Banner Management</h2>
        
        {/* Current Banners Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Current Banners</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : currentBanners.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No banners available</p>
          ) : (
            <div className="grid gap-6">
              {currentBanners.map((banner) => (
                <motion.div
                  key={banner._id}
                  className="bg-gray-50 p-4 rounded-lg shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <video
                        src={banner.bannerUrl}
                        controls
                        className="w-full rounded-lg shadow-sm max-h-[200px] object-contain bg-black"
                        preload="metadata"
                        playsInline
                      />
                    </div>
                    <div className="md:w-2/3 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold text-gray-800">{banner.name}</h4>
                        <div className="flex gap-2">
                          <select
                            value={banner.status}
                            onChange={(e) => handleStatusChange(banner._id, e.target.value)}
                            className="px-2 py-1 border rounded-md text-sm"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                          <button
                            onClick={() => handleDeleteBanner(banner._id)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Start Date:</p>
                          <p className="font-medium">{new Date(banner.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">End Date:</p>
                          <p className="font-medium">{new Date(banner.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          banner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {banner.status.charAt(0).toUpperCase() + banner.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Add New Banner</h3>
          <div className="space-y-6 mb-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Banner Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter banner name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <motion.div 
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-colors duration-300
              ${errors.video ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}`}
            whileHover={{ boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
              id="video-upload"
            />
            <motion.label 
              htmlFor="video-upload"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Choose Video *
            </motion.label>
            <p className="text-gray-500 mt-2 text-sm">Supported formats: MP4, WebM, Ogg (Max size: 100MB)</p>
            {errors.video && (
              <p className="mt-2 text-sm text-red-500">{errors.video}</p>
            )}
          </motion.div>

          {previewUrl && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Preview</h3>
                <motion.button
                  onClick={handleDeleteVideo}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Remove</span>
                </motion.button>
              </div>
              <video 
                ref={videoRef}
                src={previewUrl}
                controls
                className="w-full rounded-lg shadow-md max-h-[400px] object-contain bg-black"
              />
            </motion.div>
          )}

          <motion.button
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-300 
              ${!selectedVideo || Object.values(errors).some(error => error !== '')
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'}`}
            disabled={!selectedVideo || Object.values(errors).some(error => error !== '')}
            variants={buttonVariants}
            whileHover={!selectedVideo ? {} : "hover"}
            whileTap={!selectedVideo ? {} : "tap"}
            onClick={handleUploadBanner}
          >
            Upload Banner
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default BannerManagement;