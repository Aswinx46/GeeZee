import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import image1 from '../../assets/https___hybrismediaprod.blob.core.windows.net_sys-master-phoenix-images-container_h93_h9a_9834855137310_241101-viper-v3-pro-sentinels-1500x1000-1.jpg'
import image2 from '../../assets/pro-tips.jpeg'
import Asus from '../../assets/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fh48%2Fh42%2F9814447783966%2F240909-blackshark-v2-pro-white-2023-1.png'
import axios from '../../axios/userAxios'
const Home = () => {
  const [isHovered, setIsHovered] = useState(null);
  const [url,setUrl]=useState()

  useEffect(()=>{
    const fetchdata=async () => {
      const response=await axios.get('/showBanner/home')
      setUrl(response.data.allBanners.bannerUrl)
    }
    fetchdata()
  },[])

  const features = [
    { title: "Premium Quality", description: "High-end peripherals and accessories from top gaming brands" },
    { title: "Fast Delivery", description: "Express shipping for your gaming gear worldwide" },
    { title: "24/7 Support", description: "Expert technical assistance for all your accessories" },
    { title: "Secure Payment", description: "Safe transactions for your gaming equipment purchases" }
  ];
  const items=['https://www.google.com/url?q=http://www.flipkart.com/evofox-one-universal-wireless-bluetooth-gamepad/p/itmcaaf10284dd0b%3Fpid%3DACCGNCFY2C88ECRR%26lid%3DLSTACCGNCFY2C88ECRRF4QUHN%26marketplace%3DFLIPKART%26cmpid%3Dcontent_gamepad_8965229628_gmc&opi=95576897&sa=U&ved=0ahUKEwjz5qXCzomKAxUxhq8BHfRUKdcQrzwIpgM&usg=AOvVaw1FAO7RR7J-9SAb_P3J4CrC']

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="h-screen flex items-end justify-center relative overflow-hidden text-white pb-40"
        
      >
          <video
          className="absolute inset-0 w-full h-full object-cover"
          // src="/CORSAIR_Header_2024_WQHD_2.webm" // Replace with your video file path
           src={url ? url : '/CORSAIR_Header_2024_WQHD_2.webm'}
          autoPlay
          loop
          muted
        ></video>

        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          {/* <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-9xl  font-bold mb-32 text-transparent hover:text-white transition duration-700"
          >
            GeeZee
          </motion.h1> */}
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl md:text-3xl mb-4 max-w-2xl  mx-auto"
          >
            EVERYTHING YOU NEED
          </motion.p>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-7xl mb-8 max-w-4xl mx-auto font-bold"
          >
            TO PERFORM YOUR BEST
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link 
              to="/productPage" 
              className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16 text-black"
          >
            Why Choose Us
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-black text-white rounded-lg text-center cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Preview */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16 text-white"
          >
            Latest Collection
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: image1,
                title: "Gaming Peripherals"
              },
              {
                image: image2,
                title: "Gaming Laptops"
              },
              {
                image: Asus,
                title: "Premium Accessories"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                onHoverStart={() => setIsHovered(index)}
                onHoverEnd={() => setIsHovered(null)}
                className="relative overflow-hidden rounded-lg aspect-[3/4]"
              >
                <motion.div
                  animate={{
                    scale: isHovered === index ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-black bg-opacity-50 p-4 rounded-lg"
                  >
                    <Link to="/productPage" className="text-white font-semibold">
                      View {item.title}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-black">Stay Updated</h2>
            <p className="text-gray-600 mb-8">Subscribe to our newsletter for exclusive offers and updates</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-black"
              />
              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-900 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
