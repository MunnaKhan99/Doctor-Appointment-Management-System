import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useSpecializations = () => {
  return useQuery('specializations', api.getSpecializations, {
    onError: (err) => console.error('Error fetching specializations:', err),
  });
};