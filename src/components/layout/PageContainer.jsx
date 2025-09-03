// 4. Page Container - components/layout/PageContainer.jsx
import React from 'react';

const PageContainer = ({ 
  title, 
  subtitle, 
  actions, 
  children, 
  className = '',
  maxWidth = '7xl'
}) => {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-2 text-gray-600">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex flex-col sm:flex-row gap-3">
                {Array.isArray(actions) ? actions.map((action, index) => (
                  <div key={index}>{action}</div>
                )) : actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page Content */}
      {children}
    </div>
  );
};

export default PageContainer;