import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CreditCard, User, Calendar, MapPin, Mail, Phone, X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import axios from '../../../axios/adminAxios'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'react-toastify';

const dummyOrder = {
  id: 'ORD12345',
  date: '2023-06-20',
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567'
  },
  items: [
    { id: 1, name: 'Wireless Headphones', price: 129.99, quantity: 1 },
    { id: 2, name: 'Smartwatch', price: 199.99, quantity: 1 },
  ],
  shipping: {
    address: '123 Main St, Anytown, AN 12345',
    method: 'Express Shipping',
  },
  payment: {
    method: 'Credit Card',
    last4: '1234',
    total: 329.98,
  },
  status: 'Processing',
};

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Request', 'Returned']

const statusColors = {
  Pending: 'bg-yellow-500',
  Processing: 'bg-blue-500',
  Shipped: 'bg-purple-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
  'Return Request': 'bg-orange-500',
  Returned: 'bg-gray-500',
};

const SpecificOrderDetail = ({ isOpen, onClose, setIsOpen, order: initialOrder, orderDetails, }) => {
  const [order, setOrder] = useState(initialOrder || dummyOrder);
  const [orderItems, setOrderItems] = useState(orderDetails.orderItems)
  const [newStatus, setNewStatus] = useState()
  const handleStatusChange = (newStatus) => {
    setNewStatus(newStatus)
  };

  const currentOrderStatus = orderDetails.status

  const orderStatus = [currentOrderStatus, ...statusOptions.filter((status) => status !== currentOrderStatus)]


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

  const handleSave = async () => {

    const orderId = orderDetails._id
    try {

      const response = await axios.patch(`/changeOrderStatus/${orderId}`, { newStatus })
      toast.success(response.data.message)
      setIsOpen(false)
    } catch (error) {
      console.log('error while changing the status of the order', error)
      toast.error('error while changing the status of the order')
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-3xl font-bold">Order Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center">

            <Badge variant="outline" className={`${statusColors[orderDetails.status]} text-white px-3 py-1 rounded-full`}>
              {orderDetails.status}
            </Badge>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Package className="mr-2 text-gray-500" />
                  <span>Order ID: {orderDetails.orderId}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-500" />
                  <span>Date: {orderDetails.invoiceDate.split('T')[0]}</span>
                </div>
                <span>Cancellation reason: {orderDetails.CancellationReason}</span>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <User className="mr-2 text-gray-500" />
                  <span>{orderDetails.userId.firstName} {orderDetails.userId.lastName}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 text-gray-500" />
                  <span>{orderDetails.userId.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 text-gray-500" />
                  <span>{orderDetails.userId.phoneNo}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                {orderItems.map((item) => (
                  // <div key={item._id} className="flex justify-between items-center py-2">
                  //   <span>{item.productId.title} (x{item.quantity})</span>
                  //   <span><img className='w-20 h-20' src={item.productId.productImg[0]}></img></span>
                  //   <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  // </div>
                  <div key={item._id} className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center space-x-4">
                      <img src={item.productId.productImg[0]} alt={item.productId.title} className="w-20 h-20 object-cover rounded" />
                      <div>
                        <p className="font-medium">{item.productId.title}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>₹{orderDetails.totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Truck className="mr-2 text-gray-500" />
                  <span>{order.shipping.method}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 text-gray-500" />
                  <span>{orderDetails.address.street} {orderDetails.address.city} <br />Pincode: {orderDetails.address.pinCode} <br /> {orderDetails.address.state} {orderDetails.address.country}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <CreditCard className="mr-2 text-gray-500" />
                  <span>{orderDetails.paymentMethod}</span>
                </div>
                <span> shipping Charge : {orderDetails.shippingCost}</span>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleStatusChange} defaultValue={orderDetails.status}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatus.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleSave}>
              Save Changes
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecificOrderDetail;
