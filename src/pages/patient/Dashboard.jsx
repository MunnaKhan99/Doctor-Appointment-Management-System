// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchDoctors, bookAppointment } from '../../lib/api';
// import { DoctorCard } from '../../components/ui/Card';
// import Modal from '../../components/ui/Modal';
// import { toast } from '../../components/ui/Toast';
// import { Input, Select } from '../../components/ui/Input';

// const Dashboard = () => {
//   const [search, setSearch] = useState('');
//   const [specialization, setSpecialization] = useState('');
//   const [page, setPage] = useState(1);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const queryClient = useQueryClient();

//   // ডাক্তারের তালিকা লোড করার জন্য useQuery হুক
//   const { data, isLoading, isError } = useQuery(
//     ['doctors', { search, specialization, page }],
//     () => fetchDoctors({ search, specialization, page }),
//     { keepPreviousData: true }
//   );

//   // অ্যাপয়েন্টমেন্ট বুক করার জন্য useMutation হুক
//   const mutation = useMutation({
//     mutationFn: ({ doctorId, date }) => bookAppointment({ doctorId, date }),
//     onSuccess: () => {
//       toast.success('Appointment booked successfully');
//       queryClient.invalidateQueries(['appointments']); // এখানে যতখন প্রয়োজন 'appointments' বা সংশ্লিষ্ট query key ব্যবহার করবেন
//       setSelectedDoctor(null);
//       setSelectedDate('');
//     },
//     onError: () => toast.error('Failed to book appointment'),
//   });

//   const specializations = ['Cardiologist', 'Dentist', 'Neurologist']; // API থেকে এরপর ফেচ করা যাবে

//   const handleBook = () => {
//     if (!selectedDate) {
//       toast.error('Please select an appointment date');
//       return;
//     }
//     mutation.mutate({ doctorId: selectedDoctor.id, date: selectedDate });
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Find a Doctor</h1>

//       {/* Search এবং ফিল্টার */}
//       <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
//         <Input
//           type="search"
//           placeholder="Search doctors by name..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="mb-4 sm:mb-0 flex-1"
//         />
//         <Select
//           value={specialization}
//           onChange={(e) => setSpecialization(e.target.value)}
//           options={['All', ...specializations]}
//           className="w-48"
//         />
//       </div>

//       {/* ডাক্তারের তালিকা */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {isLoading && <p>Loading doctors...</p>}
//         {isError && <p>Error loading doctors</p>}
//         {data && data.doctors.length === 0 && <p>No doctors found</p>}
//         {data && data.doctors.map((doctor) => (
//           <DoctorCard key={doctor.id} doctor={doctor} onBookAppointment={setSelectedDoctor} />
//         ))}
//       </div>

//       {/* Pagination */}
//       {data && data.totalPages > 1 && (
//         <div className="mt-6 flex justify-center">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage(old => Math.max(old - 1, 1))}
//             className="mr-2 px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <button
//             disabled={page === data.totalPages}
//             onClick={() => setPage(old => Math.min(old + 1, data.totalPages))}
//             className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* বুকিং Modal */}
//       <Modal
//         isOpen={!!selectedDoctor}
//         onClose={() => setSelectedDoctor(null)}
//         title={`Book Appointment with Dr. ${selectedDoctor?.name}`}
//       >
//         <div className="space-y-4">
//           <label className="block font-semibold">Select Date</label>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="border p-2 rounded w-full"
//           />
//           <button
//             onClick={handleBook}
//             className="w-full bg-blue-600 text-white py-2 rounded"
//             disabled={mutation.isLoading}
//           >
//             {mutation.isLoading ? 'Booking...' : 'Confirm Appointment'}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Dashboard;
