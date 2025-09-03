// 2. Input Components - components/ui/Input.jsx
import React, { useState } from 'react';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  required = false,
  validation = null,
  ...props 
}) => {
  const [isValid, setIsValid] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    
    // Run validation if provided
    if (validation && touched) {
      const valid = validation(value);
      setIsValid(valid);
    }
    
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    
    if (validation) {
      const valid = validation(e.target.value);
      setIsValid(valid);
    }
    
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const getInputStyles = () => {
    let styles = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ';
    
    if (error || (touched && isValid === false)) {
      styles += 'border-red-300 focus:ring-red-500 focus:border-red-500';
    } else if (touched && isValid === true) {
      styles += 'border-green-300 focus:ring-green-500 focus:border-green-500';
    } else {
      styles += 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    }
    
    return styles;
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        className={getInputStyles()}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      {(error || (touched && isValid === false)) && (
        <p className="text-red-500 text-xs">{error || 'Invalid input'}</p>
      )}
      {touched && isValid === true && (
        <p className="text-green-500 text-xs">✓ Valid</p>
      )}
    </div>
  );
};

// Select Component
const Select = ({ label, error, options = [], className = '', required = false, ...props }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        }`}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export { Input, Select };
