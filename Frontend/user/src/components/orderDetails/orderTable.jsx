import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from '../../axios/userAxios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Package } from 'lucide-react'
import { useSelector } from 'react-redux'
import OrderDetailsModal from '../accountDetails/OrderDetails'

const OrderDetails = () => {
    const[selectedItem,setSelectedItem]=useState({})
    const[isOpen,setIsOpen]=useState(false)
    const[orderDetails,setOrderDetails]=useState([])
    const [allOrderItems,setAllOrderItems]=useState([])
  
    const[particularOrderDetails,setParticularOrderDetails]=useState({})
    const user=useSelector((state)=>state.user.user)
const userId=user._id
useEffect(()=>{
    const fetchData=async()=>{
        const orderDetails=await axios.get(`/orderDetails/${userId}`)
        console.log('this is the full order details',orderDetails.data.orderDetails)
        setOrderDetails(orderDetails.data.orderDetails)
        const combinedItems=orderDetails.data.orderDetails.flatMap((order)=>
            order.orderItems.map((item)=>({
                ...item,status:order.status,invoiceDate:order.invoiceDate,address:order.address,paymentMethod:order.paymentMethod,
                totalPrice:order.totalPrice,shippingCost:order.shippingCost,finalAmount:order.finalAmount,orderId:order.orderId,orderObjectId:order._id,
                variants:order.orderItems[0].variant.selectedAttributes,orderItemId:item._id
            })))
            setParticularOrderDetails(combinedItems[0])
        console.log('this is the combined items',combinedItems)
        setAllOrderItems(combinedItems)
    }
    fetchData()
},[isOpen])


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const  items= [
    { id: 1, name: 'Wireless Mouse', quantity: 1, price: 29.99 },
    { id: 2, name: 'Mechanical Keyboard', quantity: 1, price: 69.99 },
    { id: 3, name: 'USB-C Hub', quantity: 2, price: 14.99 },
  ]


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const handleProductDetail=(item)=>{
    setSelectedItem({...item})
    console.log('this is the clicked item',item)
    const particularOrderDetail=orderDetails.find((ite)=>{
    return    ite.orderItems.find((single)=>single._id == item._id)
    })
    console.log('this is the particulart', particularOrderDetail)
    setIsOpen(true)
    console.log('this is the item from the state',selectedItem)
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-black flex items-center">
          <Package className="mr-2" /> Order Details
        </h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Order #</p>
   
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead >Item</TableHead>
              <TableHead className="text-right"></TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">orderId</TableHead>
             { orderDetails[0]?.orderItems[0]?.variant.returnOrder ? <TableHead className="text-right">Return Order status</TableHead> : '' }  
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOrderItems.map((item) => (
              <TableRow key={item._id} className={`${item.status === 'Cancelled' ? 'bg-red-50 opacity-70' : ''}`}>
                <TableCell onClick={()=>handleProductDetail(item)} className={`font-medium ${item.status === 'Cancelled' ? 'line-through text-gray-500' : ''}`}>{item.productId.title}<br/> {Object.entries(item.variant.selectedAttributes).map((key)=><h1>{key.join(' : ')}</h1>)}  </TableCell>
                <TableCell onClick={()=>handleProductDetail(item)} className="font-medium"><img className={`h-15 w-20 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-200 ${item.status === 'Cancelled' ? 'grayscale' : ''}`} src={item.productId.productImg[0]} alt={item.productId.title}/></TableCell>
                <TableCell onClick={()=>handleProductDetail(item)} className={`text-right ${item.status === 'Cancelled' ? 'line-through text-gray-500' : ''}`}>{item.quantity}</TableCell>
                <TableCell onClick={()=>handleProductDetail(item)} className={`text-right ${item.status === 'Cancelled' ? 'line-through text-gray-500' : ''}`}>₹{item.price}</TableCell>
                <TableCell onClick={()=>handleProductDetail(item)} className={`text-right ${item.status === 'Cancelled' ? 'line-through text-gray-500' : ''}`}>₹{(item.quantity * item.price)}</TableCell>
                <TableCell onClick={()=>handleProductDetail(item)} className={`text-right ${item.status === 'Cancelled' ? 'text-red-500 font-medium' : ''}`}>{item.status}</TableCell>
                <TableCell onClick={()=>handleProductDetail(item)} className={`text-right ${item.status === 'Cancelled' ? 'text-gray-500' : ''}`}>{item.orderId}</TableCell>
                <TableCell onClick={()=>handleProductDetail(item)} className={`text-right ${item.variant.returnOrder === 'Pending' ? 'text-red-500' : ''}`}>{item.variant.returnOrder}</TableCell>
              </TableRow>
            ))}
        
          </TableBody>
        </Table>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-6 text-sm text-gray-600 text-center"
      >
        Thank you for your purchase. If you have any questions, please contact our support.
      </motion.div>
      {isOpen && <OrderDetailsModal isOpen={isOpen} setIsOpen={setIsOpen} item={particularOrderDetails} orderDetails ={selectedItem}/>}
    </motion.div>
  )
}

export default OrderDetails
