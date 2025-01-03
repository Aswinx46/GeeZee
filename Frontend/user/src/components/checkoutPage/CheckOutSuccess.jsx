// 'use client'

// import { motion } from 'framer-motion'
// import { Package, ArrowRight } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { useNavigate } from 'react-router-dom'
// import { useState,useEffect } from 'react'
// import axios from '../../axios/userAxios'
// import { useSelector } from 'react-redux'
// import OrderDetailsModal from '../accountDetails/OrderDetails'
// export default function OrderSuccess() {
//   const [orderDetails,setOrderDetails]=useState([])
//   const [allOrderItems,setAllOrderItems]=useState([])
//   const [lastOrder,setLastOrder]=useState({})
//   const user=useSelector(state=>state.user.user)
//   const userId=user._id
//   useEffect(() => {
//     const fetchData = async () => {
//       const details = await axios.get(`/orderDetails/${userId}`)
//       console.log('this is the full order details', details.data.orderDetails)
//       setOrderDetails(details.data.orderDetails)
//       const lastOrder = details.data.orderDetails[details.data.orderDetails.length - 1];

//       if (lastOrder && Array.isArray(lastOrder.orderItems)) {
//         // Transform the orderItems of the last order
//         const combinedItems = lastOrder.orderItems.map((item) => ({
//           ...item,
//           status: lastOrder.status,
//           invoiceDate: lastOrder.invoiceDate,
//           address: lastOrder.address,
//           paymentMethod: lastOrder.paymentMethod,
//           totalPrice: lastOrder.totalPrice,
//           shippingCost: lastOrder.shippingCost,
//           finalAmount: lastOrder.finalAmount,
//           orderId: lastOrder.orderId,
//           orderObjectId: lastOrder._id,
//           variants: item.variant?.selectedAttributes, // Optional chaining for safety
//           orderItemId: item._id,
//         }));
//         console.log('this is the combined items', combinedItems[0])
//         setLastOrder(combinedItems[0])
//       }
//       // setParticularOrderDetails(combinedItems[0])
//     }
//     fetchData()
//   }, [])

//     const navigate=useNavigate()
//     const handleGoToMyAccount=()=>{
//         navigate('/sideBar')
//     }
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white p-4">
//       <div className="text-center space-y-6 max-w-md">
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{
//             type: "spring",
//             stiffness: 260,
//             damping: 20,
//             delay: 0.2
//           }}
//           className="flex justify-center"
//         >
//           <div className="relative">
//             <Package className="w-16 h-16 text-black" strokeWidth={1.5} />
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.6 }}
//               className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-black flex items-center justify-center"
//             >
//               <motion.svg
//                 initial={{ pathLength: 0 }}
//                 animate={{ pathLength: 1 }}
//                 transition={{ duration: 0.5, delay: 0.8 }}
//                 className="w-4 h-4 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <motion.path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 13l4 4L19 7"
//                 />
//               </motion.svg>
//             </motion.div>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 1 }}
//         >
//           <h1 className="text-2xl font-semibold text-black mb-2">
//             Thank you for shopping
//           </h1>
//           <p className="text-gray-600 text-sm">
//             Your order has been successfully placed and is now being processed.
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 1.2 }}
//         >
//           <Button
//             className="bg-black text-white hover:bg-black/90 transition-colors"
//             onClick={handleGoToMyAccount}
//           >
           
//               Go to my account
//               <ArrowRight className="ml-2 h-4 w-4" />
            
//           </Button>
//         </motion.div>
//       </div>
     
//     </div>
//   )
// }


'use client'

import { motion } from 'framer-motion'
import { Package, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from '../../axios/userAxios'
import { useSelector } from 'react-redux'
import OrderDetailsModal from '../accountDetails/OrderDetails'
import OrderDetailsSuccess from './OrderDetailsSuccess'

export default function OrderSuccess() {
  const [orderDetails, setOrderDetails] = useState([])
  const [allOrderItems, setAllOrderItems] = useState([])
  const [lastOrder, setLastOrder] = useState({})
  const user = useSelector(state => state.user.user)
  const userId = user._id

  useEffect(() => {
    const fetchData = async () => {
      const details = await axios.get(`/orderDetails/${userId}`)
      console.log('this is the full order details', details.data.orderDetails)
      setOrderDetails(details.data.orderDetails)
      const lastOrder = details.data.orderDetails[details.data.orderDetails.length - 1];
      console.log('this is the last order',lastOrder)

      if (lastOrder && Array.isArray(lastOrder.orderItems)) {
        // Transform the orderItems of the last order
        const combinedItems = lastOrder.orderItems.map((item) => ({
          ...item,
          status: lastOrder.status,
          invoiceDate: lastOrder.invoiceDate,
          address: lastOrder.address,
          paymentMethod: lastOrder.paymentMethod,
          totalPrice: lastOrder.totalPrice,
          shippingCost: lastOrder.shippingCost,
          finalAmount: lastOrder.finalAmount,
          orderId: lastOrder.orderId,
          orderObjectId: lastOrder._id,
          variants: item.variant?.selectedAttributes, // Optional chaining for safety
          orderItemId: item._id,
        }));
        console.log('this is the combined items', combinedItems[0])
        setLastOrder(combinedItems[0])
      }
      // setParticularOrderDetails(combinedItems[0])
    }
    fetchData()
  }, [])

  const navigate = useNavigate()
  const handleGoToMyAccount = () => {
    navigate('/sideBar')
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="text-center space-y-6 max-w-md mx-auto mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="flex justify-center"
        >
          <div className="relative">
            <Package className="w-16 h-16 text-black" strokeWidth={1.5} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-black flex items-center justify-center"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h1 className="text-2xl font-semibold text-black mb-2">
            Thank you for shopping
          </h1>
          <p className="text-gray-600 text-sm">
            Your order has been successfully placed and is now being processed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Button
            className="bg-black text-white hover:bg-black/90 transition-colors"
            onClick={handleGoToMyAccount}
          >
            Go to my account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {lastOrder && Object.keys(lastOrder).length > 0 && (
        <OrderDetailsSuccess orderDetails={lastOrder} />
      )}
    </div>
  )
}


