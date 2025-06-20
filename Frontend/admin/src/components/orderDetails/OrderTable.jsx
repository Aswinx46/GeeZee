import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import axios from '../../../axios/adminAxios';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SpecificOrderDetails from './SpecificOrderDetail'
import Pagination from '../Pagination/Pagination';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"





const OrderTable = () => {

  const [allOrderItems, setAllOrderItems] = useState([])
  const [neededItems, setNeededItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [orderID, setOrderId] = useState()
  const [orderDetails, setOrderDetails] = useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("this is the current page")
        const response = await axios.get(`/showOrders/${currentPage}`)
        setAllOrderItems(response.data.orders)
        setTotalPage(response.data.totalPages)
        const neededDetails = response.data.orders.map((order) => {
          return {
            name: order.orderItems[0]?.productId?.title || 'N/A',
            productImg: order.orderItems[0]?.productId?.productImg || '',
            orderId: order.orderId || 'N/A',
            orderDate: order.invoiceDate || 'N/A',
            finalAmount: order.finalAmount || 0,
            status: order.status || 'Pending',
            id: order._id
          };
        });
        setNeededItems(neededDetails)
      } catch (error) {
        console.log('error while fetching order details', error)

      }
    }
    fetchData()
  }, [isOpen,currentPage])


  const statusColors = {
    Pending: 'bg-yellow-500',
    Processing: 'bg-blue-500',
    Shipped: 'bg-purple-500',
    Delivered: 'bg-green-500',
    Cancelled: 'bg-red-500',
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

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleViewDetails = (orderId) => {
    setOrderId(orderId)
    const orderDetail = allOrderItems.find((order) => order._id == orderId)
    setOrderDetails(orderDetail)

    setIsOpen(true)

  };

  const onPageChange=(page)=>{
    setCurrentPage(page)
  }

  return (
    <motion.div
      className="container mx-auto p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold mb-6">Order List</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {neededItems.map((order) => (
              <motion.tr key={order.id} variants={rowVariants}>
                <TableCell className="font-medium">{order.name}</TableCell>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>{order.orderDate.split('T')[0]}</TableCell>
                <TableCell>₹{order.finalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusColors[order.status]} text-white`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        <Pagination onPageChange={onPageChange} currentPage={currentPage} totalPages={totalPage}/>
      </div>
      {isOpen && <SpecificOrderDetails isOpen={isOpen} setIsOpen={setIsOpen} orderID={orderID} orderDetails={orderDetails} />}
    </motion.div>
  );
};

export default OrderTable;

