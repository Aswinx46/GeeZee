import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaGamepad, FaDesktop, FaHeadphones, FaKeyboard, FaMouse, FaChair, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from '../../axios/userAxios'
import Banner from '../../assets/banner.jpg'
const ProductPage = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const carouselRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const productsResponse = await axios.get('/products')
                setProducts(productsResponse.data.products)
                console.log(productsResponse.data.products)
                const categoryResponse = await axios.get('/category')
                setCategory(categoryResponse.data.category)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchDetails()
    }, [])

    const handleDeal=async(index)=>{
                const selectedProduct=products.filter((_,i)=>i==index)
                console.log(selectedProduct)
               
                localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
                navigate('/productDetails')
            }

    const nextSlide = () => {
        if (carouselRef.current) {
            const scrollWidth = carouselRef.current.scrollWidth;
            const itemWidth = scrollWidth / products.length;
            const newScrollPosition = (carouselRef.current.scrollLeft + itemWidth) % scrollWidth;
            carouselRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const prevSlide = () => {
        if (carouselRef.current) {
            const scrollWidth = carouselRef.current.scrollWidth;
            const itemWidth = scrollWidth / products.length;
            const newScrollPosition = (carouselRef.current.scrollLeft - itemWidth + scrollWidth) % scrollWidth;
            carouselRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 2000);

        return () => clearInterval(timer);
    }, [products]);

    return (
        <div className="min-h-screen bg-[#000000]">
            {/* Hero Banner Section */}
            <div className="relative w-full h-[600px] overflow-hidden">
                <div className="flex w-full h-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full relative"
                    >
                        {/* <img
                            src={Banner}
                            alt="Gaming Accessories"
                            className="w-full h-full object-cover"
                        /> */}
                        <video
                            className="absolute inset-0 w-full h-full object-cover"
                            src="/keyboard video.mp4" // Replace with your video file path
                            autoPlay
                            loop
                            muted
                        ></video>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent">
                            <div className="container mx-auto px-4 h-full flex items-center">
                                <div className="max-w-xl">
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                                    >
                                        Gaming Accessories Store
                                    </motion.h1>
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-lg text-gray-200 mb-6"
                                    >
                                        One-stop shop for all gaming enthusiasts' needs
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Hot Deals Section */}
            <section className="py-12 bg-[#000000]">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="text-3xl font-bold mb-8 text-center text-white"
                    >
                        HOT DEALS
                    </motion.h2>
                    <div className="relative overflow-hidden">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                            <button onClick={prevSlide} className="bg-[#1b1b1b] p-2 rounded-full shadow-md hover:bg-[#2d2d2d]">
                                <FaChevronLeft className="text-[#8b5cf6]" />
                            </button>
                        </div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                            <button onClick={nextSlide} className="bg-[#1b1b1b] p-2 rounded-full shadow-md hover:bg-[#2d2d2d]">
                                <FaChevronRight className="text-[#8b5cf6]" />
                            </button>
                        </div>
                        <div 
                            ref={carouselRef}
                            className="flex overflow-x-hidden"
                            style={{ scrollSnapType: 'x mandatory' }}
                        >
                            {[...products].map((product, index) => (
                                <motion.div
                                    key={index}
                                    className="w-full md:w-[280px] flex-shrink-0 px-2"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    <div className="bg-[#1b1b1b] rounded-md shadow-md overflow-hidden h-full max-w-[280px] border border-[#3d3d3d]">
                                        <div className="relative pt-[60%]">
                                            <img
                                                src={product.productImg[0]}
                                                alt={product.title}
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-sm font-semibold mb-2 line-clamp-2 text-white">{product.title}</h3>
                                            <p className="text-lg font-bold text-[#8b5cf6] mb-2">₹{product.variants[0].price}</p>
                                            <button onClick={() => handleDeal(index)} className="w-full bg-[#8b5cf6] text-white px-3 py-1.5 rounded-full hover:bg-[#7c3aed] transition-all text-sm font-semibold">
                                                View Deal
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Department Section */}
            <section className="py-12 bg-[#1b1b1b]">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="text-3xl font-bold mb-8 text-center text-white"
                    >
                        Popular Department
                    </motion.h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {[
                            { icon: FaHeadphones, name: 'Headsets' },
                            { icon: FaMouse, name: 'Mouse' },
                            { icon: FaChair, name: 'Chairs' },
                            { icon: FaKeyboard, name: 'Keyboards' },
                            { icon: FaDesktop, name: 'PC Cases' },
                            { icon: FaGamepad, name: 'Controllers' }
                        ].map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                onHoverStart={() => setHoveredCategory(index)}
                                onHoverEnd={() => setHoveredCategory(null)}
                                className="bg-[#000000] border border-[#3d3d3d] rounded-lg shadow-md p-4 text-center cursor-pointer hover:border-[#8b5cf6]"
                            >
                                <category.icon
                                    className={`text-4xl mx-auto mb-2 transition-colors duration-200 ${hoveredCategory === index ? 'text-[#8b5cf6]' : 'text-gray-400'
                                        }`}
                                />
                                <h3 className="text-sm font-medium text-white">{category.name}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Build PC Section */}
            <section className="py-12 bg-[#000000]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8"
                        >
                            <h2 className="text-3xl font-bold mb-4">BUILD YOUR DREAM PC</h2>
                            <p className="mb-6">Customize your perfect gaming rig with our PC builder</p>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                                Start Building
                            </button>
                        </motion.div>
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-8"
                        >
                            <h2 className="text-3xl font-bold mb-4">CRAFT YOUR CUSTOM PC</h2>
                            <p className="mb-6">Let our experts help you build your dream gaming PC</p>
                            <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                                Learn More
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What We Serve Section */}
            <section className="py-12 bg-[#000000]">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="text-3xl font-bold mb-12 text-center text-white"
                    >
                        What We Serve
                    </motion.h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { title: 'Fast Delivery', description: 'Quick shipping worldwide' },
                            { title: 'Secure Payment', description: 'Multiple payment options' },
                            { title: '24/7 Support', description: 'Round the clock assistance' },
                            { title: 'Best Quality', description: 'Premium products guaranteed' }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-[#1b1b1b] rounded-full flex items-center justify-center">
                                    <FaShoppingCart className="text-2xl text-[#8b5cf6]" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-white">{service.title}</h3>
                                <p className="text-gray-400">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductPage;
