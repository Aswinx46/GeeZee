import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CreditCard, Package, X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import axios from '../../axios/userAxios'
import OrderCancellationModal from '@/extraAddonComponents/OrderCancellation';
const OrderDetailsModal = ({ isOpen, onClose,item,setIsOpen,orderDetails }) => {
  console.log('this is the sended item',item)
  const[orderCancelPop,setOrderCancelPop]=useState(false)
  console.log('this  is the order details from the parent',orderDetails)
  const[orderId,setOrderId]=useState()
  const order = {
    id: '#ORD12345',
    status: 'Shipped',
    date: '2023-06-15',
    items: [
      { id: 1, name: 'Wireless Headphones', price: 129.99, image: '/placeholder.svg?height=80&width=80', quantity: 1 },
      { id: 2, name: 'Smartwatch', price: 199.99, image: '/placeholder.svg?height=80&width=80', quantity: 1 },
    ],
    shipping: {
      address: '123 Main St, Anytown, AN 12345',
      method: 'Express Shipping',
    },
    payment: {
      method: 'Credit Card',
      last4: '1234',
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.8 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleCancelOrder=async () => {
    try {
      setOrderCancelPop(true)
      console.log(orderDetails.orderObjectId)
      setOrderId(orderDetails.orderObjectId)
     
    } catch (error) {
      console.log('error while canceling the order',error)
    }
  }


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={()=>setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <motion.h1 className="text-2xl font-bold mb-6" variants={itemVariants}>
              Order Details 
            </motion.h1>

            <motion.div className="mb-6" variants={itemVariants}>
              <h2 className="text-lg font-semibold mb-2">Items</h2>
             
                <motion.div 
                 
                  className="flex items-center justify-between border-b border-gray-200 py-4"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    <img src={orderDetails.productId.productImg[0]} alt={orderDetails.productId.title} className="w-20 h-20 object-cover rounded-md mr-4" />
                    <div>
                      <h3 className="font-medium">{orderDetails.productId.title}</h3>
                      <p className="text-gray-500">Quantity: {orderDetails.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{orderDetails.price}</p>
                </motion.div>
            
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" variants={itemVariants}>
              <div>
                <h2 className="text-lg font-semibold mb-2">Order Status</h2>
                <div className="flex items-center">
                  <Package className="mr-2 text-green-500" />
                  <span>{orderDetails.status}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Order Date: {orderDetails.invoiceDate.split('T')[0]}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Delivery</h2>
                <div className="flex items-center">
                  <Truck className="mr-2 text-blue-500" />
                  <span>{order.shipping.method}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{orderDetails.address.street} {orderDetails.address.city} <br></br>
                {orderDetails.address.state} {orderDetails.address.street} <br></br> pincode: {orderDetails.address.pinCode}<br></br>
                phone :{orderDetails.address.phone}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Payment</h2>
                <div className="flex items-center">
                  <CreditCard className="mr-2 text-purple-500" />
                  <span>{orderDetails.paymentMethod}</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="border-t border-gray-200 pt-4" variants={itemVariants}>
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{orderDetails.totalPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>₹{orderDetails.shippingCost}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{orderDetails.finalAmount}</span>
              </div>
            </motion.div>

            <Button
              className="mt-6 w-full bg-black text-white hover:bg-gray-800"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </Button>

            <Button
              className="mt-6 w-full bg-black text-white hover:bg-gray-800"
              onClick={()=>setIsOpen(false)}
            >
              Close
            </Button>
          </motion.div>
          {orderCancelPop && <OrderCancellationModal isOpen={orderCancelPop}  orderId={orderId} setIsOpen={setOrderCancelPop}/>}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsModal;

