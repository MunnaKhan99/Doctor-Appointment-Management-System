import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['PATIENT', 'DOCTOR']),
});

export const patientRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  photo_url: z.string().url('Invalid URL').optional(),
});

export const doctorRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  specialization: z.string().min(1, 'Specialization is required'),
  photo_url: z.string().url('Invalid URL').optional(),
});

export const appointmentSchema = z.object({
  doctorId: z.number().int('Invalid doctor ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, 'Invalid date format'),
});