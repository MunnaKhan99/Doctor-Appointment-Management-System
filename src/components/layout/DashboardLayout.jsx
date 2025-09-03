// 2. Dashboard Layout Wrapper - components/layout/DashboardLayout.jsx
import React from 'react';
// import Navbar from './Navbar';
import { ToastContainer } from '../ui/Toast';

const DashboardLayout = ({ children, title, subtitle, actions }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        {(title || subtitle || actions) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  )}
                  {subtitle && (
                    <p className="text-gray-600 mt-1">{subtitle}</p>
                  )}
                </div>
                {actions && (
                  <div className="flex space-x-3">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;