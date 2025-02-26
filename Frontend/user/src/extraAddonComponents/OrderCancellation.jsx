import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button"
import axios from '../axios/userAxios'
import { Textarea } from "@/components/ui/textarea"
import { useSelector } from 'react-redux';
const OrderCancellationModal = ({ isOpen, onClose, onConfirm, paymentMethod, orderId, isReturn, orderItemId, isCancel, setIsOpen,productPrice }) => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [returnReason, setReturnReason] = useState('')
  const user = useSelector(state => state.user.user)
  // const[returnOrCancel,setReturnOrCancel]=useState()
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    }
  };

  const handleConfirm = async () => {

    if (isCancel) {

      const response = await axios.patch(`/cancelOrder/${orderId}/${user?._id}`, { reason: cancellationReason, paymentMethod })

    } else {

      const response = await axios.patch(`returnProduct/${orderId}/${orderItemId}`, { returnReason,productPrice })

    }
    setIsCancelled(true);

  };

  const handleClose = () => {

    setTimeout(() => setIsCancelled(false), 300);
  };

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
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <AnimatePresence mode="wait">
              {!isCancelled ? (
                <motion.div
                  key="confirmation"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="min-h-[16rem] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-yellow-100 rounded-full p-3">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    {isCancel ? <h2 className="text-2xl font-bold text-center mb-4">Cancel Order?</h2> : <h2 className="text-2xl font-bold text-center mb-4">Return Order?</h2>}


                    {isCancel ? <p className="text-center text-gray-600 mb-6">
                      Are you sure you want to cancel order #{orderId}? This action cannot be undone.
                    </p> : <p className="text-center text-gray-600 mb-6">
                      Are you sure you want to Return order #{orderId}? This action cannot be undone.
                    </p>}
                  </div>
                  <Textarea
                    placeholder="Please provide a reason for cancellation"
                    value={cancellationReason || returnReason}
                    onChange={(e) => isCancel ? setCancellationReason(e.target.value) : setReturnReason(e.target.value)}
                    className="mb-4"
                  />

                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="w-full"
                    >
                      {isCancel ? '  No, Keep Order' : 'No Keep Product'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleConfirm}
                      className="w-full"
                    >
                      {isCancel ? 'Yes, Cancel Order' : 'Yes return Product'}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="cancelled"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="min-h-[16rem] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-green-100 rounded-full p-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>



                    {isCancel ? <h2 className="text-2xl font-bold text-center mb-4">Order Cancelled</h2> : <h2 className="text-2xl font-bold text-center mb-4">Return Request Sended</h2>
                    }

                    {isCancel ? <p className="text-center text-gray-600 mb-6">
                      Your order #{orderId} has been successfully cancelled.

                    </p> : <p className="text-center text-gray-600 mb-6">
                      Your order #{orderId} has been successfully cancelled.

                    </p>}

                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderCancellationModal;
