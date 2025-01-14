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
import { Package, ChevronDown, ChevronRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import OrderDetailsModal from '../accountDetails/OrderDetails'
import Pagination from '@/extraAddonComponents/Pagination'

const OrderDetails = () => {
  const [selectedItem, setSelectedItem] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [orderDetails, setOrderDetails] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})
  const [particularOrderDetails, setParticularOrderDetails] = useState({})
  const[totalPage,setTotalPage]=useState(1)
  const[changePage,setChangePage]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state) => state.user.user)
  const userId = user._id

  useEffect(() => {
    const fetchData = async () => {
      const orderDetails = await axios.get(`/orderDetails/${userId}/${currentPage}`)
      setOrderDetails(orderDetails.data.orderDetails)
      setTotalPage(orderDetails.data.totalPages)
      // if (orderDetails.data.orderDetails.length > 0) {
      //   setParticularOrderDetails(orderDetails.data.orderDetails[0].orderItems[0])
      // }
    }
    fetchData()
  }, [isOpen,currentPage])

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const handleProductDetail = (item, orderDetails) => {
   
    setSelectedItem({ ...orderDetails, orderItem: item })
    setParticularOrderDetails(item)
    setIsOpen(true)
  }
  const onPageChange=async(newPage)=>{
    setCurrentPage(newPage)
    setChangePage(!changePage)

    
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
      </motion.div>

      <motion.div variants={itemVariants}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Payment</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderDetails.map((order) => (
              <React.Fragment key={order._id}>
                <TableRow 
                  className={`cursor-pointer hover:bg-gray-50 ${order.status === 'Cancelled' ? 'bg-red-50 opacity-70' : ''}`}
                  onClick={() => toggleOrderExpansion(order._id)}
                >
                  <TableCell>
                    {expandedOrders[order._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </TableCell>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell className="text-right">{new Date(order.invoiceDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">₹{order.finalAmount}</TableCell>
                  <TableCell className="text-right">{order.status}</TableCell>
                  <TableCell className="text-right">{order.paymentStatus}</TableCell>
                </TableRow>
                {expandedOrders[order._id] && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <div className="bg-gray-50 p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Image</TableHead>
                              <TableHead className="text-right">Quantity</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">Total Price</TableHead>
                              {order.orderItems[0]?.variant.returnOrder ? <TableHead className="text-right">Return Status</TableHead> : null}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.orderItems.map((item, i) => (
                              <TableRow key={i} onClick={() => handleProductDetail(item, order)}>
                                <TableCell className={`font-medium ${item.variant.returnOrder === 'Accepted' ? 'line-through text-gray-500' : ''}`}>
                                  {item.productId.title}<br />
                                  {Object.entries(item.variant.selectedAttributes).map((key) => (
                                    <h1 key={key[0]}>{key.join(' : ')}</h1>
                                  ))}
                                </TableCell>
                                <TableCell>
                                  <img 
                                    className={`h-15 w-20 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-200 ${item.variant.returnOrder === 'Accepted' ? 'grayscale opacity-50' : ''}`}
                                    src={item.productId.productImg[0]} 
                                    alt={item.productId.title} 
                                  />
                                </TableCell>
                                <TableCell className={`text-right ${item.variant.returnOrder === 'Accepted' ? 'line-through text-gray-500' : ''}`}>{item.quantity}</TableCell>
                                <TableCell className={`text-right ${item.variant.returnOrder === 'Accepted' ? 'line-through text-gray-500' : ''}`}>₹{item.price}</TableCell>
                                <TableCell className={`text-right ${item.variant.returnOrder === 'Accepted' ? 'line-through text-gray-500' : ''}`}>₹{item.price * item.quantity}</TableCell>
                                {item.variant.returnOrder ? (
                                  <TableCell className={`text-right ${item.variant.returnOrder === 'Pending' ? 'text-red-500' : item.variant.returnOrder === 'Accepted' ? 'text-green-500 font-medium' : ''}`}>
                                    {item.variant.returnOrder === 'Accepted' ? 'Returned' : item.variant.returnOrder}
                                  </TableCell>
                                ) : null}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
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
      <Pagination onPageChange={onPageChange} currentPage={currentPage} totalPages={totalPage}/>
      {isOpen && <OrderDetailsModal isOpen={isOpen} setIsOpen={setIsOpen} item={particularOrderDetails} orderDetails={selectedItem} />}
    </motion.div>
  )
}

export default OrderDetails
