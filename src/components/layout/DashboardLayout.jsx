// 2. Dashboard Layout Wrapper - components/layout/DashboardLayout.jsx
import React from 'react';
import Navbar from './Navbar';
import SidebarLayout from './SidebarLayout';
import { ToastContainer } from '../ui/Toast';

const DashboardLayout = ({ title, subtitle, actions, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SidebarLayout>
        <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
          {/* Header - Mobile first responsive */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{title}</h1>
                {subtitle && <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>}
              </div>
              {actions && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {Array.isArray(actions) ? actions.map((action, index) => (
                    <div key={index} className="w-full sm:w-auto">
                      {action}
                    </div>
                  )) : actions}
                </div>
              )}
            </div>
          </div>
          {children}
        </div>
      </SidebarLayout>
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;