// 3. Sidebar Layout (Optional) - components/layout/SidebarLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const SidebarLayout = ({ children }) => {
  const location = useLocation();
  const { role } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getSidebarItems = () => {
    if (role === 'PATIENT') {
      return [
        { name: 'Dashboard', path: '/patient/dashboard', icon: '🏠' },
        { name: 'Find Doctors', path: '/patient/dashboard', icon: '👨‍⚕️' },
        { name: 'My Appointments', path: '/patient/appointments', icon: '📅' },
        { name: 'Medical History', path: '/patient/history', icon: '📋' },
      ];
    } else if (role === 'DOCTOR') {
      return [
        { name: 'Dashboard', path: '/doctor/dashboard', icon: '🏥' },
        { name: 'Appointments', path: '/doctor/appointments', icon: '📅' },
        { name: 'Patients', path: '/doctor/patients', icon: '👥' },
        { name: 'Schedule', path: '/doctor/schedule', icon: '🕒' },
      ];
    }
    return [];
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'
        }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className={`flex items-center space-x-3 ${isSidebarOpen ? '' : 'hidden'}`}>
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold text-gray-900">MediCare</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d={isSidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-6">
          <div className="px-3">
            {sidebarItems.map((item) => (
              <Link
                key={`${item.path}-${item.name}`}
                to={item.path}
                className={`flex items-center px-3 py-2 mb-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                title={!isSidebarOpen ? item.name : ''}
              >
                <span className="text-lg">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {role?.charAt(0) || 'U'}
              </span>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {role?.toLowerCase() || 'User'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;