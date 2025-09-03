import Button from "./Button";

// 7. Card Components - components/ui/Card.jsx
export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''
      } ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg ${className}`}>
      {children}
    </div>
  );
};

// Doctor Card Component - Mobile First Design
export const DoctorCard = ({ doctor, onBookAppointment }) => {
  return (
    <Card hover className="h-full transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-3 sm:p-4">
        {/* Mobile-first layout: Stack on small screens, side by side on larger */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img
              src={doctor.photo_url || '/api/placeholder/60/60'}
              alt={doctor.name}
              className="w-12 h-12 sm:w-15 sm:h-15 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">{doctor.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{doctor.specialization}</p>
            </div>
          </div>
        </div>

        {/* Doctor details - Responsive text */}
        <div className="space-y-2 mb-4">
          <p className="text-xs sm:text-sm text-gray-700">
            <span className="font-medium">Email:</span>
            <span className="block sm:inline sm:ml-1 truncate">{doctor.email}</span>
          </p>
          {/* Additional info for larger screens */}
          <div className="hidden sm:flex justify-between text-xs text-gray-500">
            <span>⭐ {doctor.rating || '4.8'}</span>
            <span>🗓️ {doctor.experience_years || '5+'} yrs</span>
          </div>
        </div>

        {/* Book button - Full width, responsive text */}
        <Button
          onClick={() => onBookAppointment(doctor)}
          className="w-full text-xs sm:text-sm"
          variant="primary"
          size="sm"
        >
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

// Status Badge Component
export const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    COMPLETED: 'bg-green-100 text-green-800 border-green-300',
    CANCELLED: 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
};