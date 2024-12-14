"use client"

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from '../../axios/userAxios'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { incrementCounter } from '@/redux/slices/CartCounter';
import EmptyCart from '@/extraAddonComponents/emptyCart';
const Cart = () => {
  
  const[quantity,setQuantity]=useState(0)
  const [cartItems, setCartItems]=useState([])
  const[newQuantity,setNewQuantity]=useState()
  const[count,setCount]=useState(0)
  const user=useSelector(state=>state.user.user)
 
  const userId=user?._id
  const[update,setUpdate]=useState(false)
useEffect(()=>{
  if (!userId) return; // Don't fetch cart items if there's no user

  const fetchCartItems=async () => {
    const cartItems=await axios.get(`/cartItems/${userId}`)
    const items=cartItems.data.result
    console.log('this is items',items.length)
    const count=items.length
    setCount(count)
    // console.log(cartItems.data.result)
    setCartItems(items)
    dispatch(incrementCounter(count))
  }
  fetchCartItems()
},[update,userId])

const dispatch=useDispatch()

  // const [cartItems, setCartItems] = useState([
  //   {
  //     id: 1,
  //     name: "Razer Basilisk V3 Pro - Black",
  //     price: 159.99,
  //     image: "/placeholder.svg?height=80&width=80",
  //     quantity: 1,
  //     protection: false,
  //     protectionPrice: 29.99
  //   },
  //   {
  //     id: 2,
  //     name: "Razer Wolverine V3 Pro",
  //     price: 199.99,
  //     image: "/placeholder.svg?height=80&width=80",
  //     quantity: 1,
  //     protection: false,
  //     protectionPrice: 29.99
  //   }
  // ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const toggleProtection = (id) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, protection: !item.protection }
          : item
      )
    );
  };

  const removeItem = async(item) => {
    const itemId=item.variants[0]._id
    const cartId=item.cartId
    setCartItems(items => items.filter(item => item.variants[0]._id !== itemId));
    const deleteItem =await axios.delete(`/deleteItem/${itemId}/${cartId}`)
    console.log('this is the item to be delted',item.cartId)
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.variants[0].price * item.quantity;
   
      // console.log('this is the item in the calculate sub total',itemTotal)
      return total + itemTotal ;
    }, 0);
  };


  const total = calculateSubtotal()

  const handleQuantity=async(i,count)=>{

    const itemToBeChanged=cartItems.find((_,index)=>index==i)
    console.log(itemToBeChanged)
    const productId=itemToBeChanged.id
    const itemId=itemToBeChanged.variants[0]._id
    const cartId=itemToBeChanged.cartId
    console.log('this is the cartId',cartId)
    console.log('this is the item id',itemId)
    console.log('this isthe product id',productId)
    console.log('this is the item',itemToBeChanged)
    const stock = itemToBeChanged.variants[0].stock;
    const currentQuantity = itemToBeChanged.quantity;
    const newQuantity = currentQuantity + count;

    if(count > 0)
    {
      if(currentQuantity >=stock)
      {
        toast.error('max stock exeeded')
        return 
      }
      if(newQuantity > 5)
      {
        toast.error('max quantity exeeded')
        return 
      }
    }
    const updateQuantity=await axios.patch(`/changeQuantity/${itemId}/${cartId}/${productId}`,{count})
    setUpdate(!update)

  }

  return (
    <>
    {count == 0 ? <EmptyCart/> : 
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-white" // Ensure heading text is white
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your cart total is US${total.toFixed(2)}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cartItems.map((item,i) => (
                <motion.div
                key={i}
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                exit={{ 
                  x: "100vw",
                  transition: {
                    duration: 0.3,
                    ease: "easeInOut"
                  }
                }}
                style={{ position: 'relative' }}
                >
                  <Card className="bg-zinc-900 border-zinc-800 mb-4 text-white"> {/* Ensure card text is white */}
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <motion.img
                          src={item.productImg[0]}
                          alt='item image'
                          className="w-20 h-20 object-cover rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3> {/* Ensure item name text is white */}
                          <p className="text-sm font-semibold mb-2 text-white">{item.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-8 w-8 rounded-md border border-zinc-700 flex items-center justify-center text-white"
                                onClick={() => handleQuantity(i, -1)}
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>
                              <span onClick={()=>handleQuantity(i)} className="w-8 text-center text-white">{item.quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-8 w-8 rounded-md border border-zinc-700 flex items-center justify-center text-white"
                                onClick={() => handleQuantity(i, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                            </div>
                            <motion.button
                              onClick={() => removeItem(item)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-red-500 hover:text-red-600"
                              initial={{ x: 0 }}
                              animate={{ x: 0 }}
                              exit={{ x: 1000, opacity: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </div>
                        <div className="text-right text-white">
                          <p className="text-lg font-bold">
                            US${item.variants[0].price}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        className="mt-4 p-4 bg-zinc-800 rounded-lg cursor-pointer text-white" // Ensure protection section text is white
                        whileHover={{ scale: 1.02 }}
                        onClick={() => toggleProtection(item.id)}
                        >
                        <div className="flex items-center gap-4">
                          {/* <Shield className={`h-6 w-6 ${item.protection ? 'text-green-500' : 'text-gray-400'}`} /> */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-500">Available Stock :  {item.variants[0].stock}</h4>
                            {/* <p className="text-sm text-gray-400">Protect your new device for up to 3 years</p> */}
                          </div>
                         
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-4 text-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-white">
                    <span>Subtotal</span>
                    <span>US${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  {/* <div className="flex justify-between text-white">
                    <span>Tax</span>
                    <span>US${tax.toFixed(2)}</span>
                    </div> */}
                  <Separator className="bg-zinc-800" />
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span>US${total.toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    CHECKOUT
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-black border-zinc-700"
                    size="lg"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
                  }
                    </>

  );
};

export default Cart;
