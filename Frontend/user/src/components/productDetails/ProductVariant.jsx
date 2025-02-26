"use client"

import { useEffect, useState,useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { InfoIcon } from 'lucide-react'
import axios from '../../axios/userAxios'
const GraphicsSelector = ({sendVariant,receiveIndex,id,setProducts}) => {
  const [selectedGraphics, setSelectedGraphics] = useState(0)
  const[graphics,setgraphics]=useState([])
 
  useLayoutEffect(()=>{
   
    setgraphics(sendVariant)


  },[sendVariant])
  
  const handleVariantClick=async(index,e)=>{
    e.preventDefault()

    const Productid=id
    
     const variantId=graphics[index]._id
    try {
      const quantity=await axios.get(`/showProductVariantQuantity/${Productid}/?variantId=${variantId}`)
    
      
      setProducts((prev)=>({...prev, variants:prev.variants.map((variant, i)=>i===index?{...variant, stock:quantity.data}:variant)}))
      
    } catch (error) {
      console.log('error in fetching product list in productVariant',error)
    }
    setSelectedGraphics(index)
    
    receiveIndex(index)
  }

  
  
  return (
    <div className="bg-black p-6 rounded-lg max-w-3xl mx-auto">
      <h2 className="text-white text-xl mb-4">Choose Graphics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {graphics.map((card,index) => (
          <motion.div
            key={index}
            onClick={(e) =>handleVariantClick(index,e) }
            className={`
              relative cursor-pointer rounded-lg p-4
              ${selectedGraphics === index 
                ? 'bg-black border-2 border-[#39FF14]' 
                : 'bg-zinc-900 border border-zinc-800'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedGraphics === index && (
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
                {/* <h3 className="text-white font-medium">{card.selectedAttributes.RAM}</h3>
                <p className="text-gray-400 text-sm">{card.selectedAttributes.SSD}</p> */}
                {Object.entries(card.selectedAttributes).map((attribute, index)=> {
                   return <p className={index === 0 ? "text-white font-medium":"text-gray-400 text-sm"}>{attribute.join(" : ")}</p>
                })}
                <p className="text-green-400 text-sm"> Available stock {card.stock}</p>
              </div>
              <div className="flex items-center">
                {card.price && (
                  <span className="text-white text-sm">
                    Rs.{card.price}
                  </span>
                )}
                <button 
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle info click
                    console.log(`Show info for ${index}`)
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

