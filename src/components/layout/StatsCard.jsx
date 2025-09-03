// 6. Stats Cards Layout - components/layout/StatsCards.jsx
export const StatsCard = ({ title, value, change, changeType, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              changeType === 'increase' 
                ? 'text-green-600' 
                : changeType === 'decrease' 
                  ? 'text-red-600' 
                  : 'text-gray-600'
            }`}>
              {changeType === 'increase' && '↗ '}
              {changeType === 'decrease' && '↘ '}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{icon}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};