import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function BreadCrumps() {
  const location = useLocation(); // Access the current location object

  // Split the path into segments and filter out empty ones
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  // Do not render breadcrumbs if there are no segments (i.e., on the root path '/')
  if (pathSegments.length === 0) {
    return null;
  }

  // Initialize an empty string to build cumulative paths
  let pathName = "";

  // Filter out segments that contain numbers and create breadcrumbs
  const crumbs = pathSegments
    .filter((segment) => !/\d/.test(segment)) // Exclude segments containing numbers
    .map((crumb, index) => {
      // Build the cumulative path for each segment
      pathName += `/${crumb}`;
      return (
        <motion.span
          key={index}
          className="breadcrumb-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            to={pathName}
            className="text-gray-600 hover:text-purple-600 transition-all duration-300 capitalize font-medium"
          >
            {crumb.replace(/-/g, " ")}
          </Link>
          {index < pathSegments.filter((c) => !/\d/.test(c)).length - 1 && (
            <motion.span 
              className="mx-2 text-gray-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 + 0.1 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 inline-block" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </motion.span>
          )}
        </motion.span>
      );
    });

  // Render breadcrumbs including a "Home" link
  return (
    <motion.div 
      className="breadcrumbs-container py-3 px-4 bg-white/80 backdrop-blur-sm shadow-sm border-b"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        <motion.div className="flex items-center flex-wrap gap-1">
          <motion.span
            className="breadcrumb-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              to="/" 
              className="text-gray-600 hover:text-purple-600 transition-all duration-300 font-medium"
            >
              Home
            </Link>
            {crumbs.length > 0 && (
              <motion.span 
                className="mx-2 text-gray-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 inline-block" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </motion.span>
            )}
          </motion.span>
          {crumbs}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default BreadCrumps;
