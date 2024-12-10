"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { InfoIcon } from 'lucide-react'

const GraphicsSelector = () => {
  const [selectedGraphics, setSelectedGraphics] = useState('4090')
  
  const graphics = [
    {
      id: '4080',
      name: 'GeForce RTX 4080',
      vram: '12 GB GDDR6 VRAM',
      price: 800.00
    },
    {
      id: '4090',
      name: 'GeForce RTX 4090',
      vram: '16 GB GDDR6 VRAM',
      price: 1599.99
    }
  ]

  return (
    <div className="bg-black p-6 rounded-lg max-w-3xl mx-auto">
      <h2 className="text-white text-xl mb-4">Choose Graphics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {graphics.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => setSelectedGraphics(card.id)}
            className={`
              relative cursor-pointer rounded-lg p-4
              ${selectedGraphics === card.id 
                ? 'bg-black border-2 border-[#39FF14]' 
                : 'bg-zinc-900 border border-zinc-800'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedGraphics === card.id && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
                  pointerEvents: 'none'
                }}
              />
            )}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-white font-medium">{card.name}</h3>
                <p className="text-gray-400 text-sm">{card.vram}</p>
              </div>
              <div className="flex items-center">
                {card.price && (
                  <span className="text-white text-sm">
                    - US${card.price.toFixed(2)}
                  </span>
                )}
                <button 
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle info click
                    console.log(`Show info for ${card.name}`)
                  }}
                >
                  <InfoIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default GraphicsSelector

