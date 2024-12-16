import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import axios  from '../../../axios/adminAxios';
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

const dummyOrders = [
  { product:'sample',  id: 'ORD001', date: '2023-06-20', total: 329.98, status: 'Processing' },
  { product:'sample',  id: 'ORD002', date: '2023-06-21', total: 159.99, status: 'Shipped' },
  { product:'sample',  id: 'ORD003', date: '2023-06-22', total: 499.99, status: 'Delivered' },
  { product:'sample',  id: 'ORD004', date: '2023-06-23', total: 79.99, status: 'Pending' },
  { product:'sample',  id: 'ORD005', date: '2023-06-24', total: 249.99, status: 'Cancelled' },
];




const OrderTable = () => {
 
const[allOrderItems,setAllOrderItems]=useState([])

    useEffect(()=>{
        const fetchData=async () => {
            try {
                const response=await axios.get('/showOrders')
                console.log(response.data.orders)
                setAllOrderItems(response.data.order)
            } catch (error) {
                console.log('error while fetching order details',error)

            }
        }
        fetchData()
    },[])


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
    
  };

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
            {dummyOrders.map((order) => (
              <motion.tr key={order.id} variants={rowVariants}>
                 <TableCell className="font-medium">{order.product}</TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
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
      </div>
    </motion.div>
  );
};

export default OrderTable;
