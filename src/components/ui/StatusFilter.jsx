import React from 'react';

const StatusFilter = ({ value, onChange, options }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${value === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export default StatusFilter;


