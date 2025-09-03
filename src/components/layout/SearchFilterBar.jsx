// 7. Search and Filter Bar - components/layout/SearchFilterBar.jsx
import React from 'react';
import { Input, Select } from '../ui/Input';
import Button from '../ui/Button';

const SearchFilterBar = ({ 
  searchValue = '', 
  onSearchChange, 
  searchPlaceholder = 'Search...', 
  filters = [], 
  onFilterChange,
  actions = [],
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 p-4 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        {filters.map((filter, index) => (
          <div key={index} className="w-full lg:w-48">
            <Select
              {...filter}
              onChange={(e) => onFilterChange(filter.name, e.target.value)}
            />
          </div>
        ))}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;