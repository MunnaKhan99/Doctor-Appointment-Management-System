// 5. Toast Notifications - components/ui/Toast.jsx
import React, { useState, useEffect } from 'react';
import { subscribeToToasts } from '../../lib/toast';

const Toast = ({ toast: toastData, onRemove }) => {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  return (
    <div className={`flex items-center p-4 border rounded-lg shadow-lg ${styles[toastData.type]} max-w-sm w-full`}>
      <span className="text-lg mr-2">{icons[toastData.type]}</span>
      <p className="flex-1 text-sm font-medium">{toastData.message}</p>
      <button
        onClick={() => onRemove(toastData.id)}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts(setToasts);
    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toastData => (
        <Toast key={toastData.id} toast={toastData} onRemove={removeToast} />
      ))}
    </div>
  );
};