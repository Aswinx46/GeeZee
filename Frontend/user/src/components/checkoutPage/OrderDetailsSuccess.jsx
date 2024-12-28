import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CreditCard, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const OrderDetailsSuccess = ({ orderDetails }) => {
  const {
    status,
    invoiceDate,
    address,
    paymentMethod,
    totalPrice,
    shippingCost,
    finalAmount,
    orderId,
    orderObjectId,
    variants,
    orderItemId,
    name,
    quantity,
    price,
  } = orderDetails;

  console.log(orderDetails.name)

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
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
      className="max-w-3xl mx-auto my-12 p-8 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h2>
        <p className="text-gray-600">Thank you for your purchase!</p>
      </motion.div>

      <motion.div className="grid gap-8 md:grid-cols-2" variants={itemVariants}>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-y-0 border-b pb-4">
            <Package className="w-5 h-5 mr-3 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <p className="flex justify-between"><span className="text-gray-600">Order ID:</span> <span className="font-medium">{orderId}</span></p>
            <p className="flex justify-between items-center"><span className="text-gray-600">Status:</span> <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge></p>
            <p className="flex justify-between"><span className="text-gray-600">Date:</span> <span className="font-medium">{new Date(invoiceDate).toLocaleDateString()}</span></p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-y-0 border-b pb-4">
            <MapPin className="w-5 h-5 mr-3 text-red-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {address && typeof address === 'object' ? (
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">{address.street}</p>
                <p>{address.city}, {address.state} {address.pinCode}</p>
                <p>{address.country}</p>
                <p className="flex items-center mt-2 text-gray-600"><span className="mr-2">📞</span>{address.phone}</p>
              </div>
            ) : (
              <p className="text-gray-700">{address}</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="mt-8" variants={itemVariants}>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-y-0 border-b pb-4">
            <Package className="w-5 h-5 mr-3 text-purple-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="flex justify-between mb-2"><span className="text-gray-600">Name:</span> <span className="font-medium text-gray-800">{name}</span></p>
              <p className="flex justify-between mb-2"><span className="text-gray-600">Quantity:</span> <span className="font-medium text-gray-800">{quantity}</span></p>
              <p className="flex justify-between"><span className="text-gray-600">Price:</span> <span className="font-medium text-green-600">₹{price.toFixed(2)}</span></p>
            </div>
            {variants && (
              <div className="mt-4">
                <strong className="text-gray-700 block mb-2">Variants:</strong>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(variants).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">{key}:</span> <span className="font-medium ml-1">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="mt-8 grid gap-8 md:grid-cols-2" variants={itemVariants}>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-y-0 border-b pb-4">
            <CreditCard className="w-5 h-5 mr-3 text-green-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <p className="flex justify-between"><span className="text-gray-600">Method:</span> <span className="font-medium">{paymentMethod}</span></p>
            <p className="flex justify-between"><span className="text-gray-600">Total Price:</span> <span className="font-medium">₹{totalPrice.toFixed(2)}</span></p>
            <p className="flex justify-between"><span className="text-gray-600">Shipping Cost:</span> <span className="font-medium">₹{shippingCost.toFixed(2)}</span></p>
            <div className="pt-2 mt-2 border-t">
              <p className="flex justify-between text-lg"><span className="font-semibold text-gray-800">Final Amount:</span> <span className="font-bold text-green-600">₹{finalAmount.toFixed(2)}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-y-0 border-b pb-4">
            <Truck className="w-5 h-5 mr-3 text-orange-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span> 
              <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Estimated Delivery</p>
              <p className="text-lg font-medium text-gray-800">3-5 Business Days</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailsSuccess;
