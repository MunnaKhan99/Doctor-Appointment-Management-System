// 4. Loading Spinners - components/ui/Loading.jsx
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg
        className={`animate-spin ${sizes[size]} text-blue-600`}
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle> */}
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

export const LoadingSkeleton = ({ height = '20px', width = '100%', className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      style={{ height, width }}
    ></div>
  );
};

export const LoadingCard = () => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow animate-pulse">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-2 sm:h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 space-y-2">
        <div className="h-2 sm:h-3 bg-gray-300 rounded"></div>
        <div className="h-2 sm:h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );
};