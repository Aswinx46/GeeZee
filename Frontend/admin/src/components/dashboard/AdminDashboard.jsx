import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className={`bg-gray-900 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <nav>
        <h1 className="text-3xl font-medium text-white ">GeeZee</h1>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 hover:text-white">
            Dashboard
          </a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 hover:text-white">
            Products
          </a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 hover:text-white">
            Orders
          </a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 hover:text-white">
            Customers
          </a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 hover:text-white">
            Categories
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center py-4 px-6 bg-gray-900">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none focus:text-white md:hidden">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <button className="flex items-center text-white hover:text-green-500">
              <span className="text-sm">Admin User</span>
              <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-3xl font-medium text-white">Dashboard</h3>
            <div className="mt-4">
              <div className="flex flex-wrap -mx-6">
                <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                  <div className="flex items-center px-5 py-6 bg-gray-900 rounded-md shadow-sm">
                    <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
                      <svg className="h-8 w-8 text-white" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z" fill="currentColor"/>
                        <path d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z" fill="currentColor"/>
                        <path d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z" fill="currentColor"/>
                        <path d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z" fill="currentColor"/>
                        <path d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z" fill="currentColor"/>
                        <path d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-white">8,282</h4>
                      <div className="text-gray-400">New Customers</div>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                  <div className="flex items-center px-5 py-6 bg-gray-900 rounded-md shadow-sm">
                    <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
                      <svg className="h-8 w-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z" fill="currentColor"/>
                        <path d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z" fill="currentColor"/>
                        <path d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-white">200,521</h4>
                      <div className="text-gray-400">Total Orders</div>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                  <div className="flex items-center px-5 py-6 bg-gray-900 rounded-md shadow-sm">
                    <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
                      <svg className="h-8 w-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        <path d="M9.79999 8.4C9.79999 6.08041 11.6804 4.2 14 4.2C16.3196 4.2 18.2 6.08041 18.2 8.4V12.6C18.2 14.9197 16.3196 16.8 14 16.8C11.6804 16.8 9.79999 14.9197 9.79999 12.6V8.4Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-white">215,542</h4>
                      <div className="text-gray-400">Available Products</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-xl font-semibold text-white mb-4">Sales Overview</h4>
              <div className="bg-gray-900 p-4 rounded-md shadow">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', border: 'none' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

