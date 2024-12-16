
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CreditCard, User, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

const statusOptions = [
  'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Request', 'Returned'
];

const statusColors = {
  Pending: 'bg-yellow-500',
  Processing: 'bg-blue-500',
  Shipped: 'bg-purple-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
  'Return Request': 'bg-orange-500',
  Returned: 'bg-gray-500',
};

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(dummyOrder);

  const handleStatusChange = (newStatus) => {
    setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Badge variant="outline" className={`${statusColors[order.status]} text-white px-3 py-1 rounded-full`}>
          {order.status}
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
              <span>Order ID: {order.id}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 text-gray-500" />
              <span>Date: {order.date}</span>
            </div>
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
              <span>{order.customer.name}</span>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 text-gray-500" />
              <span>{order.customer.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 text-gray-500" />
              <span>{order.customer.phone}</span>
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
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>${order.payment.total.toFixed(2)}</span>
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
              <span>{order.shipping.address}</span>
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
              <span>{order.payment.method} ending in {order.payment.last4}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleStatusChange} defaultValue={order.status}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
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
        <Button className="w-full bg-black text-white hover:bg-gray-800">
          Save Changes
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailsPage;


