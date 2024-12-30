import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CreditCard, Package, X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import axios from '../../axios/userAxios'
import OrderCancellationModal from '@/extraAddonComponents/OrderCancellation';
import { useNavigate } from 'react-router-dom';
import { RAZORPAY_KEY_ID } from '@/config/razorPayKey';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import InvoicePDF from '@/extraAddonComponents/Invoice';
const OrderDetailsModal = ({ isOpen, onClose,item,setIsOpen,orderDetails }) => {
  console.log('this is the sended item',item)
  const user=useSelector(state=>state.user.user)
  const userId=user._id
  const[orderCancelPop,setOrderCancelPop]=useState(false)
  const[cancel,setCancel]=useState(false)
  const[isReturn,setIsReturn]=useState(false)
  const[orderItemId,setOrderItemId]=useState()
  console.log('this  is the order details from the parent',orderDetails)
  const[orderId,setOrderId]=useState()
  const navigate=useNavigate()
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
      setOrderId(orderDetails._id)
      setOrderItemId(orderDetails.orderItemId)
      setCancel(true)
      setOrderCancelPop(true)
      console.log('this is the orderDetails',orderDetails)
      console.log(orderDetails._id,'asidfhksajdhfjkaosdfasfisadjh')
      // console.log('this is the order id',orderDetails.orderObjectId)
      // console.log('this is the orderItem id',orderDetails.orderItemId)
  
     
    } catch (error) {
      console.log('error while canceling the order',error)
    }
  }

  const handleReturnOrder=async()=>{
    setIsReturn(true)
    setOrderCancelPop(true)
    console.log(orderDetails)
    setOrderId(orderDetails._id)
      setOrderItemId(item._id)
     
  }

  const pdfRef=useRef()

  const handleGenaratePdf=()=>{
    if(pdfRef.current)
    {
      pdfRef.current.generatePDF();
    }
  }

  const handleRepayment=()=>{
    // const { razorpayOrderId, amount, currency } = response.data;
    const razorpayOrderId=orderDetails.razorpayOrderId
    const amount=orderDetails.finalAmount
    const currency='INR'
    console.log('this is the razorpayOrderId',razorpayOrderId)
    console.log('this is the currency',currency)
    console.log("this si the amount",amount)

    console.log('this is the orderDetails inside the repayment',orderDetails)

    if(orderDetails.paymentStatus=='Awaiting Payment')
    {
      const options = {
        key: RAZORPAY_KEY_ID, // Replace with your Razorpay key
        amount,
        currency,
        name: 'GeeZee',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async (response) => {
          console.log('Payment Success:', response);
          toast.success('Payment Successful');
          navigate("/checkoutSuccess");
          // Optionally send payment confirmation to the backend
  
          await axios.post(`/confirmPayment/${userId}`, {
            paymentId: response.razorpay_payment_id,
            orderId: razorpayOrderId,
            signature: response.razorpay_signature
          });
          // toast.success("Payment Successful");
          console.log('this is after the confirm payment route ')
  
        },
        prefill: {
          name: orderDetails.address.name,
          email: orderDetails.address.email,
          contact: orderDetails.address.phone,
        },
        theme: {
          color: '#3399cc',
        }, method: {
          netbanking: true,
          card: true,
          upi: true, // Enables UPI
          wallet: true,
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
  
      razorpay.on('payment.failed', (response) => {
        console.error('Payment Failed:', response);
        toast.error('Payment Failed. Please try again.');
      });
     
    }else{
      navigate('/checkoutSuccess')
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
                    <img src={orderDetails.orderItem.productId.productImg[0]} alt={orderDetails.orderItem.productId.title} className="w-20 h-20 object-cover rounded-md mr-4" />
                    <div>
                      <h3 className="font-medium">{orderDetails.orderItem.productId.title}</h3>
                      <h3 className="font-medium">{Object.entries(item?.variant?.selectedAttributes).map((key)=><h1>{key.join(' : ')}</h1>)}</h3>
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

            {orderDetails.paymentStatus=='Awaiting Payment' ?
                  <Button
                  className="mt-6 w-full bg-black text-white hover:bg-gray-800"
                  onClick={handleRepayment}
                  >
                    Retry Payment
            </Button>
            : ''}

            {orderDetails.status=='Cancelled' ||  orderDetails.status=='Delivered'? '' : 
                  <Button
                  className="mt-6 w-full bg-black text-white hover:bg-gray-800"
                  onClick={handleCancelOrder}
                  >
              Cancel Order
            </Button>
            }
               {orderDetails.status=='Delivered' &&  orderDetails.orderItem.variant?.returnOrder!=='Pending' &&  orderDetails.orderItem.variant?.returnOrder!=='Accepted'?
                  <Button
                  className="mt-6 w-full bg-black text-white hover:bg-gray-800"
                  onClick={handleReturnOrder}
                  >
              Return Product
            </Button>
            :''
              }
               <Button
                  className="mt-6 w-full bg-black text-white hover:bg-gray-800"
                  onClick={handleGenaratePdf}
                  >
              Invoice Download
            </Button>

            <InvoicePDF ref={pdfRef} orderDetails={orderDetails} />

            <Button
              className="mt-6 w-full bg-black text-white hover:bg-gray-800"
              onClick={()=>setIsOpen(false)}
            >
              Close
            </Button>
          </motion.div>
          {orderCancelPop && <OrderCancellationModal isOpen={orderCancelPop}  isCancel={cancel} paymentMethod={orderDetails.paymentMethod} isReturnreturn={isReturn} orderItemId={orderItemId}  orderId={orderId} setIsOpen={setOrderCancelPop}/>}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsModal;

