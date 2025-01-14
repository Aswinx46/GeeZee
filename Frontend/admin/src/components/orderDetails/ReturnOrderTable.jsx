import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from '../../../axios/adminAxios'
import { toast } from 'react-toastify';
const ReturnedOrdersTable = () => {
    const [returnedOrders, setReturnedOrders] = useState([])
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const[index,setIndex]=useState()
    const[variantId,setVariantId]=useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/getReturnProducts')

                const neededItems = response.data.orders.flatMap((order) =>
                    order.orderItems.map((item) => ({
                        ...item, date: order.invoiceDate, orderId: order.orderId, address: order.address, user: order.userId,_id:order._id
                    })))
                   
                setReturnedOrders(response.data.orders)
            } catch (error) {
                console.log('error while fetching data', error)
            }
        }
        fetchData()
    }, [])

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

  

    const tableVariants = {
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

    const handleViewDetails=(order,variant,i)=>{
        setSelectedOrder(order)
        console.log(order)
        console.log(variant._id)
        setVariantId(variant._id)
        console.log(i)
        setIndex(i)
     
    }
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Returned Orders</h1>
            <motion.div
                variants={tableVariants}
                initial="hidden"
                animate="visible"
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            {['Product', 'Order ID', 'Date', 'Total', 'Discount', 'Status', 'Actions'].map((header) => (
                                <TableHead key={header} onClick={() => handleSort(header.toLowerCase())}>
                                    <div className="flex items-center cursor-pointer">
                                        {header}
                                        {sortColumn === header.toLowerCase() && (
                                            sortDirection === 'asc' ? <ChevronUp className="ml-1" /> : <ChevronDown className="ml-1" />
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {returnedOrders.map((order, i) => {
                               return order.orderItems.map((item,i)=>(

                                    <motion.tr
                                        key={item._id}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        layout
                                    >
                                     
                                        <TableCell className="flex items-center gap-4">
                                            <img 
                                                className='h-16 w-16 rounded-lg object-cover shadow-md hover:scale-105 transition-transform duration-200' 
                                                src={item?.productId.productImg[0]}
                                                alt={item.productId?.title}
                                            />
                                            <span>{item.productId?.title}</span>
                                        </TableCell>
    
                                        <TableCell>{order.orderId}</TableCell>
                                        <TableCell>{order.invoiceDate.split('T')[0]}</TableCell>
                                        <TableCell>₹{item.price * item.quantity}</TableCell>
                                        <TableCell>₹{order.discount}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${item.variant.returnOrder === 'Pending'
                                                        ? 'bg-red-200 text-red-800' // Red for Pending
                                                        : 'bg-blue-200 text-blue-800' // Blue for Not Pending
                                                    }`}
                                            >
                                                {item.variant.returnOrder}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetails(order,item.variant,i)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            })
                            }
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </motion.div>
            {selectedOrder && (
                <OrderDetailsModal order={selectedOrder} variantId={variantId} index={index} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

const OrderDetailsModal = ({ order, onClose,index ,variantId}) => {
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

    const handleConfirmReturn = async () => {
        try {
            console.log(order)
            const response = await axios.patch(`/confirmReturn/${order._id}/${variantId}`);
        
            toast.success(response.data.message)
            // window.location.reload();
        } catch (error) {
            console.log('Error confirming return:', error);
            toast.error(error.response.data.message)
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-lg p-6 w-full max-w-md"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                <p><strong>Product:</strong> {order.orderItems[0].productId.title}</p>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Date:</strong> {order.invoiceDate.split("T")[0]}</p>
                <p><strong>Discount:</strong> ₹{order.discount}</p>
                <p><strong>shippingCost:</strong> ₹{order.shippingCost}</p>
                <p><strong>Total:</strong> ₹{order.finalAmount}</p>
                <p><strong>Status:</strong> {order.orderItems[0].variant.returnOrder}</p>
                <div className="flex justify-between items-center mt-4">
                    <Button onClick={onClose} variant="outline">Close</Button>
                    {order.orderItems[0].variant.returnOrder === 'Pending' && (
                        <Button 
                            onClick={()=>handleConfirmReturn(order)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Confirm Return
                        </Button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ReturnedOrdersTable;
