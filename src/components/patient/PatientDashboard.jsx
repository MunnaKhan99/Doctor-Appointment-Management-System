import useAuthStore from '../stores/useAuthStore';
import DoctorList from './DoctorList';

const PatientDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Patient Dashboard</h2>
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
        <img
          src={user?.photo_url || 'https://placehold.co/100x100'}
          alt={user?.name || 'User'}
          className="w-24 h-24 rounded-full mb-4"
        />
        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
      </div>
      <DoctorList />
    </div>
  );
};

export default PatientDashboard;