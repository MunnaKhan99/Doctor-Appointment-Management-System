import React from 'react';

const Select = ({ label, error, options = [], className = '', ...props }) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            )}
            <select
                {...props}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-400' : 'border-gray-300'
                    }`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
};

export default Select;


