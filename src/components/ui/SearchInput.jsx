import React from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-2 sm:p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${className}`}
        />
    );
};

export default SearchInput;


