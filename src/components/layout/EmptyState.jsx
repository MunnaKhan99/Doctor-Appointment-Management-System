
// 8. Empty State Component - components/layout/EmptyState.jsx
export const EmptyState = ({ 
  icon = '📭', 
  title = 'No data found', 
  description = 'There are no items to display at the moment.', 
  action 
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && action}
    </div>
  );
};
