import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-opacity-75"></div>
    </div>
  );
};

export default Loader;
