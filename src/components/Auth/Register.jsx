import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const Register = () => {
  const [role, setRole] = useState('PATIENT');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="flex mb-6">
          <button
            onClick={() => setRole('PATIENT')}
            className={`flex-1 p-2 rounded-t-lg ${role === 'PATIENT' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Patient
          </button>
          <button
            onClick={() => setRole('DOCTOR')}
            className={`flex-1 p-2 rounded-t-lg ${role === 'DOCTOR' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Doctor
          </button>
        </div>
        <RegisterForm role={role} />
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 