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
    <Card hover className="h-full flex flex-col">
      <div className="h-48 w-full flex-shrink-0">
        {doctor.photo_url ? (
          <img
            src={doctor.photo_url}
            alt={doctor.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-500">Image not found</span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
        <div className="overflow-y-auto">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">{doctor.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{doctor.specialization}</p>
          <p className="text-xs sm:text-sm text-gray-700 mt-2">
            <span className="font-medium">Email:</span>
            <span className="block sm:inline sm:ml-1 truncate">{doctor.email}</span>
          </p>
          <div className="hidden sm:flex justify-between text-xs text-gray-500 mt-2">
            <span>⭐ {doctor.rating || '4.8'}</span>
            <span>🗓️ {doctor.experience_years || '5+'} yrs</span>
          </div>
        </div>
        <Button
          onClick={() => onBookAppointment(doctor)}
          className="w-full text-xs sm:text-sm mt-4 flex-shrink-0"
          variant="primary"
          size="sm"
        >
          Book Appointment
        </Button>
      </div>
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