import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; // Import Outlet
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-[280px] p-8">
        {children}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

