import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, Package } from 'lucide-react';

const OrderDetails = () => {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 ">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full mb-20 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-2xl font-bold mb-6" variants={itemVariants}>
          Order Details {order.id}
        </motion.h1>

        <motion.div className="mb-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          {order.items.map((item) => (
            <motion.div 
              key={item.id} 
              className="flex items-center justify-between border-b border-gray-200 py-4"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">${item.price.toFixed(2)}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" variants={itemVariants}>
          <div>
            <h2 className="text-lg font-semibold mb-2">Order Status</h2>
            <div className="flex items-center">
              <Package className="mr-2 text-green-500" />
              <span>{order.status}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Order Date: {order.date}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Delivery</h2>
            <div className="flex items-center">
              <Truck className="mr-2 text-blue-500" />
              <span>{order.shipping.method}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{order.shipping.address}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Payment</h2>
            <div className="flex items-center">
              <CreditCard className="mr-2 text-purple-500" />
              <span>{order.payment.method} ending in {order.payment.last4}</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="border-t border-gray-200 pt-4" variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>$9.99</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 9.99).toFixed(2)}</span>
          </div>
        </motion.div>

        <motion.button
          className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Track Order
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OrderDetails;

