import Button from "./Button";

// 7. Card Components - components/ui/Card.jsx
export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${
      hover ? 'hover:shadow-lg transition-shadow duration-200' : ''
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

// Doctor Card Component (специально для вашего проекта)
export const DoctorCard = ({ doctor, onBookAppointment }) => {
  return (
    <Card hover className="h-full">
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={doctor.photo_url || '/api/placeholder/60/60'}
            alt={doctor.name}
            className="w-15 h-15 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-sm text-gray-600">{doctor.specialization}</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Email:</span> {doctor.email}
          </p>
        </div>
        
        <Button
          onClick={() => onBookAppointment(doctor)}
          className="w-full"
          variant="primary"
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