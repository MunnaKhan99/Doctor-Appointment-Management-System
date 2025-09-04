import axios from 'axios';

const BASE_URL = 'https://appointment-manager-node.onrender.com/api/v1';

const api = {
  getSpecializations: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/specializations`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Error fetching specializations:', err.response?.data || err.message);
      return [];
    }
  },

  getDoctors: async ({ search = '', specialization = '', page = 1, limit = 10 }) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      if (specialization) params.append('specialization', specialization);
      const res = await axios.get(`${BASE_URL}/doctors?${params.toString()}`);
      return {
        doctors: res.data.doctors || [],
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || page,
      };
    } catch (err) {
      console.error('Error fetching doctors:', err.response?.data || err.message);
      return { doctors: [], totalPages: 1, currentPage: page };
    }
  },

  getDoctorAppointments: async ({ status = '', date = '', page = 1 }, token) => {
    try {
      const params = new URLSearchParams({ page });
      if (status) params.append('status', status);
      if (date) params.append('date', date);
      const res = await axios.get(`${BASE_URL}/appointments/doctor?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        appointments: res.data.appointments || [],
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || page,
      };
    } catch (err) {
      console.error('Error fetching doctor appointments:', err.response?.data || err.message);
      return { appointments: [], totalPages: 1, currentPage: page };
    }
  },

  getPatientAppointments: async ({ status = '', page = 1 }, token) => {
    try {
      const params = new URLSearchParams({ page });
      if (status) params.append('status', status);
      const res = await axios.get(`${BASE_URL}/appointments/patient?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        appointments: res.data.appointments || [],
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || page,
      };
    } catch (err) {
      console.error('Error fetching patient appointments:', err.response?.data || err.message);
      return { appointments: [], totalPages: 1, currentPage: page };
    }
  },

  createAppointment: async (data, token) => {
    try {
      console.log('Creating appointment with data:', data, 'and token:', token);
      const res = await axios.post(`${BASE_URL}/appointments`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      console.log('Appointment creation response:', res.data);
      return res.data;
    } catch (err) {
      console.error('Error creating appointment:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      throw err.response?.data || err;
    }
  },

  updateAppointmentStatus: async ({ status, appointment_id }, token) => {
    try {
      const res = await axios.patch(`${BASE_URL}/appointments/update-status`, { status, appointment_id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error('Error updating appointment status:', err.response?.data || err.message);
      throw err.response?.data || err;
    }
  },

  cancelAppointment: async (appointmentId, token) => {
    try {
      const res = await axios.delete(`${BASE_URL}/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error('Error canceling appointment:', err.response?.data || err.message);
      throw err.response?.data || err;
    }
  },

  login: async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, data);
      console.log('Full login response:', res.data);
      return res.data;
    } catch (err) {
      console.error('Error during login:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      throw err.response?.data || err;
    }
  },

  register: async (data, role) => {
    try {
      const url = role === 'PATIENT' ? `${BASE_URL}/auth/register/patient` : `${BASE_URL}/auth/register/doctor`;
      const res = await axios.post(url, data);
      console.log('Registration response:', res.data);
      return res.data;
    } catch (err) {
      console.error('Error during registration:', err.response?.data || err.message);
      throw err.response?.data || err;
    }
  },
};

export default api;