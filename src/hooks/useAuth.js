// src/hooks/useAuth.js
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    const { user, token, role, isAuthenticated, login, logout, updateUser, initializeAuth } = useAuthStore();
    return { user, token, role, isAuthenticated, login, logout, updateUser, initializeAuth };
};


