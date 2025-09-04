// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchPatientAppointments, cancelAppointment } from '../../lib/api';
// import { StatusBadge } from '../../components/ui/Card';
// import Modal from '../../components/ui/Modal';
// import Button from '../../components/ui/Button';
// import { toast } from '../../components/ui/Toast';

// const Appointments = () => {
//   const [statusFilter, setStatusFilter] = useState('');
//   const [page, setPage] = useState(1);
//   const [selectedToCancel, setSelectedToCancel] = useState(null);
//   const queryClient = useQueryClient();

//   // রোগীর অ্যাপয়েন্টমেন্ট লিস্ট ফেচ করার জন্য useQuery হুক
//   const { data, isLoading, isError } = useQuery(
//     ['appointments', { status: statusFilter, page }],
//     () => fetchPatientAppointments({ status: statusFilter, page }),
//     { keepPreviousData: true }
//   );

//   // ক্যানসেল অ্যাপয়েন্টমেন্টের জন্য useMutation হুক
//   const mutation = useMutation({
//     mutationFn: ({ appointment_id, status }) => cancelAppointment({ appointment_id, status }),
//     onSuccess: () => {
//       toast.success('Appointment cancelled');
//       queryClient.invalidateQueries(['appointments']);
//       setSelectedToCancel(null);
//     },
//     onError: () => toast.error('Failed to cancel appointment'),
//   });

//   // ক্যানসেল কনফার্ম করলে এই ফাংশনটি চালু হবে, যা মিউটেশন ট্রিগার করবে
//   const handleCancel = () => {
//     if (!selectedToCancel) return;
//     mutation.mutate({ appointment_id: selectedToCancel.id, status: 'CANCELLED' });
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

//       {/* স্ট্যাটাস ফিল্টার */}
//       <div className="mb-6">
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border rounded px-3 py-2"
//         >
//           <option value="">All</option>
//           <option value="PENDING">Pending</option>
//           <option value="COMPLETED">Completed</option>
//           <option value="CANCELLED">Cancelled</option>
//         </select>
//       </div>

//       {/* অ্যাপয়েন্টমেন্ট তালিকা */}
//       {isLoading && <p>Loading appointments...</p>}
//       {isError && <p>Error loading appointments</p>}
//       {data && data.appointments.length === 0 && <p>No appointments found</p>}

//       <div className="space-y-4">
//         {data && data.appointments.map((appt) => (
//           <div key={appt.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
//             <div>
//               <p><strong>Doctor:</strong> {appt.doctor.name}</p>
//               <p><strong>Date:</strong> {new Date(appt.date).toLocaleString()}</p>
//               <StatusBadge status={appt.status} />
//             </div>
//             {appt.status === 'PENDING' && (
//               <Button variant="danger" onClick={() => setSelectedToCancel(appt)}>
//                 Cancel
//               </Button>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       {data && data.totalPages > 1 && (
//         <div className="mt-6 flex justify-center space-x-2">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage(old => Math.max(old - 1, 1))}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <button
//             disabled={page === data.totalPages}
//             onClick={() => setPage(old => Math.min(old + 1, data.totalPages))}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* ক্যানসেল কনফার্মেশন মডাল */}
//       <Modal
//         isOpen={!!selectedToCancel}
//         onClose={() => setSelectedToCancel(null)}
//         title="Confirm Cancellation"
//       >
//         <p>Are you sure you want to cancel this appointment?</p>
//         <div className="mt-4 flex justify-end space-x-2">
//           <Button variant="secondary" onClick={() => setSelectedToCancel(null)}>No</Button>
//           <Button variant="danger" onClick={handleCancel} disabled={mutation.isLoading}>
//             {mutation.isLoading ? 'Cancelling...' : 'Yes, Cancel'}
//           </Button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Appointments;
