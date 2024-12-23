import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Eye, EyeOff, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios/adminAxios';
const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [update,setUpdate]=useState(false)
  useEffect(()=>{
    const fetchData=async () => {
      const response=await axios.get('/getCoupon')
      console.log(response.data.allCoupon)
      setCoupons(response.data.allCoupon)
    }
    fetchData()
  },[update])

  const navigate=useNavigate()

  const handleListUnlist = async(id) => {
    // setCoupons(coupons.map(coupon => 
    //   coupon._id === id ? { ...coupon, isList: !coupon.isList } : coupon
    // ));
    const response=await axios.patch(`/changeStatusOfCoupon/${id}`)
    // const coupon = coupons.find(c => c.id === id);
  setUpdate(!update)
    toast.success('changed status successfully');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const handleCreateCoupon=()=>{
    console.log('jakhkf')
    navigate('/addCoupon')
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="container mx-auto p-6 bg-white rounded-lg shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
        <Ticket className="mr-2" />
        Coupon List
      </h2>
      <div onClick={()=>handleCreateCoupon()} className="flex justify-end mb-4">
        <Button  className="bg-primary hover:bg-primary/90">
          <Ticket className="mr-2 h-4 w-4" />
          
          Create Coupon
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Description</TableHead>
   
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {coupons.map((coupon,i) => (
              <motion.tr
                key={coupon._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
              >
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{coupon.CouponType}</TableCell>
                <TableCell>
                  {coupon.couponType === 'percentage' ? `${coupon.offerPrice}%` : `₹${coupon.offerPrice}`}
                </TableCell>
                <TableCell>{coupon.description}</TableCell>
               
                <TableCell>{coupon.expireOn.split('T')[0]}</TableCell>
                <TableCell>
                  <Badge variant={coupon.isList ? "success" : "secondary"}>
                    {coupon.isList ? 'Listed' : 'Unlisted'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleListUnlist(coupon._id)}
                      >
                        {coupon.isList ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="outline" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default CouponList;
