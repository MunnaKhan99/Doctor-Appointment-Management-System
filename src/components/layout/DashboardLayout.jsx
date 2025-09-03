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
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {actions && (
              <div className="flex items-center gap-3">{actions}</div>
            )}
          </div>
          {children}
        </div>
      </SidebarLayout>
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;