import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Percent, DollarSign, FileText, Hash, Calendar, Users, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios/adminAxios'
const CouponCreationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    couponCode: '',
    couponType: '',
    discountValue: '',
    description: '',
    limit: '',
    expireDate: '',
    minimumPrice: '',
  });

  const [errors, setErrors] = useState({
    couponCode: '',
    discountValue: '',
    limit: '',
    expireDate: '',
    minimumPrice: '',
  });

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Coupon code validation
    if (!formData.couponCode.match(/^[A-Z0-9]{4,12}$/)) {
      tempErrors.couponCode = 'Code must be 4-12 characters long and contain only uppercase letters and numbers';
      isValid = false;
    }

    const discount = parseFloat(formData.discountValue);
    const minPrice = parseFloat(formData.minimumPrice);

    // Discount value validation
    if (formData.couponType === 'percentage') {
      if (isNaN(discount) || discount <= 0 || discount > 100) {
        tempErrors.discountValue = 'Percentage must be between 0 and 100';
        isValid = false;
      }
    } else if (formData.couponType === 'fixed') {
      if (isNaN(discount) || discount <= 0) {
        tempErrors.discountValue = 'Amount must be greater than 0';
        isValid = false;
      } else if (discount > 10000) {
        tempErrors.discountValue = 'Offer amount cannot exceed ₹10,000';
        isValid = false;
      } else if (minPrice && discount >= minPrice) {
        tempErrors.discountValue = 'Offer amount cannot be more than or equal to minimum purchase price';
        isValid = false;
      }
    }

    // Usage limit validation
    if (formData.limit && parseInt(formData.limit) <= 0) {
      tempErrors.limit = 'Usage limit must be greater than 0';
      isValid = false;
    }

    // Minimum price validation
    if (!formData.minimumPrice) {
      tempErrors.minimumPrice = 'Minimum price is required';
      isValid = false;
    } else if (isNaN(minPrice) || minPrice <= 0) {
      tempErrors.minimumPrice = 'Minimum price must be greater than 0';
      isValid = false;
    } else if (minPrice > 1000000) {
      tempErrors.minimumPrice = 'Minimum price cannot exceed ₹100,000';
      isValid = false;
    }

    // Expiration date validation
    const currentDate = new Date();
    const selectedDate = new Date(formData.expireDate);
    if (selectedDate <= currentDate) {
      tempErrors.expireDate = 'Expiration date must be in the future';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        console.log(formData)
        if (!formData.couponType) {
          toast.error('Choose The Type')
        }
        const response = await axios.post('/createCoupon', { formData })
        toast.success(`Coupon ${response.data.newCoupon.couponCode} has been created successfully.`);
        // Reset form after submission
        setFormData({
          couponCode: '',
          couponType: '',
          discountValue: '',
          description: '',
          limit: '',
          expireDate: '',
          minimumPrice: '',
        });
        setErrors({});
      } catch (error) {
        console.log('error while creating the coupon', error)

        toast.error(error.response.data.message)
      }

    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
        <Ticket className="mr-2" />
        Create New Coupon
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="couponCode">Coupon Code</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur" animate="blur">
            <Input
              id="couponCode"
              name="couponCode"
              value={formData.couponCode}
              onChange={handleChange}
              required
              className={`w-full ${errors.couponCode ? 'border-red-500' : ''}`}
              icon={<Hash className="text-gray-400" />}
            />
            {errors.couponCode && <p className="text-red-500 text-sm mt-1">{errors.couponCode}</p>}
          </motion.div>
        </div>
        <div>
          <Label htmlFor="couponType">Coupon Type</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur" animate="blur">
            <Select
              name="couponType"
              value={formData.couponType}
              onValueChange={(value) => handleSelectChange('couponType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coupon type" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="percentage">Percentage</SelectItem> */}
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>
        <div>
          <Label htmlFor="discountValue">Discount Value</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur" animate="blur">
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              value={formData.discountValue}
              onChange={handleChange}
              required
              className={`w-full ${errors.discountValue ? 'border-red-500' : ''}`}
              icon={formData.couponType === 'percentage' ? <Percent className="text-gray-400" /> : <DollarSign className="text-gray-400" />}
            />
            {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>}
          </motion.div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur" animate="blur">
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full"
              rows={3}
              icon={<FileText className="text-gray-400" />}
            />
          </motion.div>
        </div>
        {/* <div>
          <Label htmlFor="limit">Usage Limit</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur" animate="blur">
            <Input
              id="limit"
              name="limit"
              type="number"
              value={formData.limit}
              onChange={handleChange}
              className={`w-full ${errors.limit ? 'border-red-500' : ''}`}
              icon={<Users className="text-gray-400" />}
            />
            {errors.limit && <p className="text-red-500 text-sm mt-1">{errors.limit}</p>}
          </motion.div>
        </div> */}
        <div>
          <Label htmlFor="minimumPrice">Minimum Price</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur" animate="blur">
            <Input
              id="minimumPrice"
              name="minimumPrice"
              type="number"
              value={formData.minimumPrice}
              onChange={handleChange}
              required
              className={`w-full ${errors.minimumPrice ? 'border-red-500' : ''}`}
              icon={<DollarSign className="text-gray-400" />}
            />
            {errors.minimumPrice && <p className="text-red-500 text-sm mt-1">{errors.minimumPrice}</p>}
          </motion.div>
        </div>
        <div>
          <Label htmlFor="expireDate">Expiration Date</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur" animate="blur">
            <Input
              id="expireDate"
              name="expireDate"
              type="date"
              value={formData.expireDate}
              onChange={handleChange}
              required
              className={`w-full ${errors.expireDate ? 'border-red-500' : ''}`}
              icon={<Calendar className="text-gray-400" />}
            />
            {errors.expireDate && <p className="text-red-500 text-sm mt-1">{errors.expireDate}</p>}
          </motion.div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button type="submit" className="w-full">
            Create Coupon
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default CouponCreationForm;
