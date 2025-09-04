// 1. Create Zustand Auth Store - store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      login: (userData) => {
        const { token, user, role } = userData;
        try { localStorage.setItem('token', token); } catch { /* ignore storage errors */ }
        set({
          user,
          token,
          role,
          isAuthenticated: true
        });
  
      },

      logout: () => {
        try { localStorage.removeItem('token'); } catch { /* ignore storage errors */ }
    
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user || {};
        set({ user: { ...currentUser, ...updates } });
      },

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          // You might want to verify token with API
          set({
            token,
            isAuthenticated: true
          });
        
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);