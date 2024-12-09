"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Razer Basilisk V3 Pro - Black",
      price: 159.99,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
      protection: false,
      protectionPrice: 29.99
    },
    {
      id: 2,
      name: "Razer Wolverine V3 Pro",
      price: 199.99,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
      protection: false,
      protectionPrice: 29.99
    }
  ]);

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

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const protectionTotal = item.protection ? item.protectionPrice : 0;
      return total + itemTotal + protectionTotal;
    }, 0);
  };

  const shipping = 0; // Free shipping
  const tax = calculateSubtotal() * 0.1; // 10% tax
  const total = calculateSubtotal() + shipping + tax;

  return (
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
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800 mb-4 text-white"> {/* Ensure card text is white */}
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <motion.img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 text-white">{item.name}</h3> {/* Ensure item name text is white */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-8 w-8 rounded-md border border-zinc-700 flex items-center justify-center text-white"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>
                              <span className="w-8 text-center text-white">{item.quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-8 w-8 rounded-md border border-zinc-700 flex items-center justify-center text-white"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right text-white">
                          <p className="text-lg font-bold">
                            US${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        className="mt-4 p-4 bg-zinc-800 rounded-lg cursor-pointer text-white" // Ensure protection section text is white
                        whileHover={{ scale: 1.02 }}
                        onClick={() => toggleProtection(item.id)}
                      >
                        <div className="flex items-center gap-4">
                          <Shield className={`h-6 w-6 ${item.protection ? 'text-green-500' : 'text-gray-400'}`} />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">Add RazerCare for {item.name}</h4>
                            <p className="text-sm text-gray-400">Protect your new device for up to 3 years</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white">US${item.protectionPrice}</p>
                            {item.protection && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-green-500"
                              >
                                Added
                              </motion.span>
                            )}
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
                  <div className="flex justify-between text-white">
                    <span>Tax</span>
                    <span>US${tax.toFixed(2)}</span>
                  </div>
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

  );
};

export default Cart;
