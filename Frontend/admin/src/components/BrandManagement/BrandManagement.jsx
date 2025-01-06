import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlusCircle, FaTimes } from 'react-icons/fa';
import axios from '../../../axios/adminAxios';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import Cropper from 'react-easy-crop';
import cloudAxios from 'axios'
import EditBrandModal from './EditBrandModal';

const BrandManagement = () => {
    const [brands, setBrands] = useState([]);
    const [newBrand, setNewBrand] = useState('');
    const [status, setStatus] = useState('active');
    const [fetch, setFetch] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [editBrandName, setEditBrandName] = useState('');

    // Image handling states
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, [fetch,isEditOpen]);

    const fetchBrands = async () => {
        try {
            const response = await axios.get('/brands');
            setBrands(response.data.brands);
        } catch (error) {
            console.log(error);
            toast.error('Error fetching brands');
        }
    };

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setCurrentImage({
                    src: reader.result,
                    file: file,
                    name: file.name
                });
                setShowCropper(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
            0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result);
                };
            }, 'image/jpeg');
        });
    };

    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImg(
                currentImage.src,
                croppedAreaPixels,
                rotation
            );
            
            setSelectedImages(prev => [...prev, {
                src: croppedImage,
                name: currentImage.name,
                file: dataURLtoFile(croppedImage, currentImage.name)
            }]);
            
            setShowCropper(false);
            setCurrentImage(null);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
        } catch (error) {
            console.error('Error cropping image:', error);
            toast.error('Error cropping image');
        }
    };

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddBrand = async (e) => {
        e.preventDefault();
   
        if (newBrand.trim() && selectedImages.length > 0) {
            try {
                const duplicate = brands.filter(
                    (brand) => brand.name.toLowerCase() === newBrand.toLowerCase()
                );
                if (duplicate.length > 0) {
                    toast.error('Brand already exists');
                    return;
                }

                const formData = new FormData();
               
                selectedImages.forEach((image, index) => {
                    formData.append('file', image.file);
                });
                formData.append('upload_preset', 'Brandd')
                formData.append('cloud_name','dotlezt0x')
               
                const responseFromCloudinary=await cloudAxios.post('https://api.cloudinary.com/v1_1/dotlezt0x/image/upload',formData)
                const imageUrl=responseFromCloudinary.data.secure_url
                const responseFromDatabase=await axios.post('/addBrand',{status,newBrand,imageUrl})

                setFetch(!fetch);
                setNewBrand('');
                setSelectedImages([]);
                toast.success('Brand added successfully');
            } catch (error) {
                console.log('Error adding brand', error);
                toast.error(error.response?.data?.message || 'Error adding brand');
            }
        } else {
            toast.error('Please provide both brand name and at least one image');
        }
    };

    const handleStatus = async (id) => {
        try {
            const brand = brands.find((b) => b._id === id);
            const newStatus = brand.status === 'active' ? 'inactive' : 'active';
            const response = await axios.patch(`/editBrand/${id}`, { status: newStatus });
            toast.success(response.data.message);
            setBrands((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
            );
        } catch (error) {
            console.log('Error changing brand status', error);
            toast.error('Error updating brand status');
        }
    };

    const handleEdit = async(index) => {
        const editingBrand = brands.find((_,i) => i === index);
        setSelectedId(editingBrand._id);
        setEditBrandName(editingBrand.name);
        setIsEditOpen(true);
    };

   
    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-6xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-black mb-8 border-l-4 border-green-500 pl-4"
                >
                    Brand Management
                </motion.h1>

                {/* Add New Brand Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8"
                >
                    <h2 className="text-xl font-bold text-black mb-6 border-l-4 border-green-500 pl-4">
                        Add New Brand
                    </h2>
                    <form onSubmit={handleAddBrand} className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                value={newBrand}
                                onChange={(e) => setNewBrand(e.target.value)}
                                placeholder="Enter brand name"
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaPlusCircle className="w-8 h-8 mb-4 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onSelectFile}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Image Cropper Modal */}
                            {showCropper && currentImage && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium">Crop Image</h3>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCropper(false);
                                                    setCurrentImage(null);
                                                    setCrop({ x: 0, y: 0 });
                                                    setZoom(1);
                                                    setRotation(0);
                                                }}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FaTimes size={20} />
                                            </button>
                                        </div>
                                        <div className="relative h-96">
                                            <Cropper
                                                image={currentImage.src}
                                                crop={crop}
                                                zoom={zoom}
                                                rotation={rotation}
                                                aspect={1}
                                                onCropChange={setCrop}
                                                onZoomChange={setZoom}
                                                onRotationChange={setRotation}
                                                onCropComplete={onCropComplete}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mt-4 space-x-4">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-sm text-gray-600">Zoom</label>
                                                <input
                                                    type="range"
                                                    min={1}
                                                    max={3}
                                                    step={0.1}
                                                    value={zoom}
                                                    onChange={(e) => setZoom(e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <label className="text-sm text-gray-600">Rotation</label>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={360}
                                                    step={1}
                                                    value={rotation}
                                                    onChange={(e) => setRotation(e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4 space-x-2">
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    setShowCropper(false);
                                                    setCurrentImage(null);
                                                    setCrop({ x: 0, y: 0 });
                                                    setZoom(1);
                                                    setRotation(0);
                                                }}
                                                className="bg-gray-500 hover:bg-gray-600"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handleCropSave}
                                                className="bg-green-500 hover:bg-green-600"
                                            >
                                                Crop & Save
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Selected Images Preview */}
                            {selectedImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.src}
                                                alt={`Selected ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FaTimes size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
                            disabled={!newBrand.trim() || selectedImages.length === 0}
                        >
                            Add Brand
                        </Button>
                    </form>
                </motion.div>

                {/* Brands Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                >
                    <table className="w-full">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="py-3 px-6 text-left">S.No</th>
                                <th className="py-3 px-6 text-left">Brand Name</th>
                                <th className="py-3 px-6 text-center">Image</th>
                                <th className="py-3 px-6 text-center">Status</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map((brand, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                                    <td className="py-4 px-6">
                                        <span className="text-gray-800 font-medium">{brand.name}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center">
                                            <img
                                                src={brand.brandImage[0]}
                                                alt={brand.name}
                                                className="h-12 w-12 object-cover rounded"
                                            />
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center">
                                            <Button
                                                onClick={() => handleStatus(brand._id)}
                                                className={`${
                                                    brand.status === 'active'
                                                        ? 'bg-green-500 hover:bg-green-600'
                                                        : 'bg-red-500 hover:bg-red-600'
                                                } text-white transition-colors duration-200`}
                                            >
                                                {brand.status}
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center space-x-3">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={()=>handleEdit(index)}
                                                className="text-green-600 hover:text-green-700 transition-colors"
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
                <EditBrandModal 
                    isOpen={isEditOpen}
                    setIsOpen={setIsEditOpen}
                    brandName={editBrandName}
                    setBrandName={setEditBrandName}
                    
                brandId={selectedId} />
            </div>
        </div>
    );
};

export default BrandManagement;