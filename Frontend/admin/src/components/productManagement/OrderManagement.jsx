import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Percent, Calendar, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-toastify';
import axios from '../../../axios/adminAxios'
const OfferModal = ({ OpenOffer, setOpenOffer, onClose, onSubmit,productId, update,setUpdate, type,existingProductOffer,categoryId }) => {
  const [offerType, setOfferType] = useState('percentage');
  const [offerValue, setOfferValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});

  console.log('this is the existingoffer',existingProductOffer)
  console.log('this is the category id',categoryId)

  const validateForm = () => {
    const newErrors = {};
    
    // Validate offer value
    if (!offerValue) {
      newErrors.offerValue = 'Offer value is required';
    } else {
      const value = parseFloat(offerValue);
      if (offerType === 'percentage') {
        if (value <= 0 || value > 100) {
          newErrors.offerValue = 'Percentage must be between 0 and 100';
        }
      } else {
        if (value <= 0) {
          newErrors.offerValue = 'Amount must be greater than 0';
        }
      }
    }

    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(offerType, offerValue, startDate, endDate,productId);
      try {
        if(productId)
        {console.log('this is inside the product');
        
          const response=await axios.post(`/addOffer/${productId}`,{offerType, offerValue, startDate, endDate})
          console.log(response.data)
          toast.success(response.data.message);
          setOpenOffer(false);

        }else if(categoryId)
        {console.log('this is inside teh category')
          console.log(offerType, offerValue, startDate, endDate)
          const response=await axios.post(`/addOfferCategory/${categoryId}`,{offerType, offerValue, startDate, endDate})
          toast.success(response.data.message);
          setOpenOffer(false);
          setUpdate(!update)
        }
      } catch (error) {
        console.log('error while updating offer in the backend',error)
        toast.error('error while updating offer in the backend')
      }
   
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {OpenOffer && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Offer to {type}</h2>
              <Button variant="ghost" size="icon" onClick={()=>setOpenOffer(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="offerType">Offer Type</Label>
                <RadioGroup
                  id="offerType"
                  value={offerType || existingProductOffer?.offerType}
                  onValueChange={setOfferType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage">Percentage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed Amount</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="offerValue">Offer Value</Label>
                <div className="relative">
                  <Input
                    id="offerValue"
                    type="number"
                    value={offerValue || existingProductOffer?.offerValue}
                    onChange={(e) => setOfferValue(e.target.value)}
                    placeholder={offerType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                    className={`pl-8 ${errors.offerValue ? 'border-red-500' : ''}`}
                  />
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    {offerType === 'percentage' ? <Percent className="h-4 w-4" /> : '$'}
                  </span>
                </div>
                {errors.offerValue && (
                  <p className="text-red-500 text-sm mt-1">{errors.offerValue}</p>
                )}
              </div>

              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate || existingProductOffer?.validFrom}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`pl-8 ${errors.startDate ? 'border-red-500' : ''}`}
                  />
                  <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                </div>
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate || existingProductOffer?.validUntil}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`pl-8 ${errors.endDate ? 'border-red-500' : ''}`}
                  />
                  <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                </div>
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Add Offer
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferModal;
