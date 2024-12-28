import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="relative z-10 max-w-lg w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white shadow-[0_0_60px_rgba(0,0,0,0.1)] rounded-3xl p-8 md:p-12">
          <motion.div 
            className="flex flex-col items-center"
            variants={floatVariants}
            animate="animate"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-black/5 rounded-full blur-2xl transform scale-150"></div>
              <AlertCircle className="relative w-32 h-32 text-black" />
            </div>
          </motion.div>

          <motion.div 
            className="text-center mt-8 space-y-6"
            variants={itemVariants}
          >
            <h1 className="text-8xl font-bold text-black">
              404
            </h1>
            <p className="text-2xl text-gray-600 font-light">
              Oops! This page has wandered off into the void.
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 space-y-4"
            variants={itemVariants}
          >
            <Link
              to="/"
              className="group block w-full bg-black hover:bg-gray-900 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <Home className="mr-2" size={20} />
              <span className="font-semibold">Return to Homepage</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-4 rounded-xl border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-105"
            >
              <ArrowLeft className="mr-2" size={20} />
              Go Back
            </button>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
