

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3 } from 'lucide-react';
import axios from '../../../axios/adminAxios'

const TopTenSection = () => {
    const[topProducts,setTopProducts]=useState([])
    const[topBrands,setTopBrands]=useState([])
    const[topCategories,setTopCategories]=useState([])

    useEffect(()=>{
        const fetchData=async () => {
            const response=await axios.get('/trending')
            console.log(response)
            setTopProducts(response.data.topTenProduct)
            setTopBrands(response.data.topTenBrand)
            setTopCategories(response.data.topTenCategory)
        }
        fetchData()
    },[])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const renderTopTenList = (items, icon, title, nameKey, countKey) => (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      variants={itemVariants}
    >
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-2">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <motion.li
            key={item._id}
            className="flex justify-between items-center"
            variants={itemVariants}
          >
            <span>{index + 1}. {item[nameKey]}</span>
            <span className="font-semibold">{item[countKey]}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          Top 10 Lists
        </motion.h2>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {renderTopTenList(topProducts, <TrendingUp className="w-6 h-6 text-blue-500" />, "Top 10 Products", "title", "salesCount")}
          {renderTopTenList(topBrands, <Award className="w-6 h-6 text-yellow-500" />, "Top 10 Brands", "name", "salesCount")}
          {renderTopTenList(topCategories, <BarChart3 className="w-6 h-6 text-green-500" />, "Top 10 Categories", "categoryName", "salesCount")}
        </motion.div>
      </div>
    </section>
  );
};

export default TopTenSection;
