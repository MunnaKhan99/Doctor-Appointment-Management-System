// 1. Navigation Header - components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (role === 'PATIENT') {
      return [
        { name: 'Dashboard', path: '/patient/dashboard', icon: '🏠' },
        { name: 'My Appointments', path: '/patient/appointments', icon: '📅' },
      ];
    } else if (role === 'DOCTOR') {
      return [
        { name: 'Dashboard', path: '/doctor/dashboard', icon: '🏥' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Responsive sizing */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to={role === 'PATIENT' ? '/patient/dashboard' : '/doctor/dashboard'}
              className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xl sm:text-2xl">🏥</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900">MediCare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu - Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.photo_url || '/api/placeholder/32/32'}
                  alt={user?.name || 'User'}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                />
                <div className="text-xs sm:text-sm hidden md:block">
                  <p className="font-medium text-gray-900 truncate max-w-20">{user?.name || 'User'}</p>
                  <p className="text-gray-500 capitalize">{role?.toLowerCase()}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout} className="text-xs sm:text-sm">
                Logout
              </Button>
            </div>

            {/* Mobile menu button - Always visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced for mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Mobile User Info - Compact design */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <img
                    src={user?.photo_url || '/api/placeholder/40/40'}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{role?.toLowerCase()}</p>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <Button variant="secondary" size="sm" onClick={handleLogout} className="w-full text-sm">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;