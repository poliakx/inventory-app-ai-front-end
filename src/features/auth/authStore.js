import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist((set) => ({
  isAuthLoading: true,
  setAuthLoading: (value) => set({
  isAuthLoading: value
  }),
  token: null,
  setToken: (token ) => set({ token }),
  logout: () => set({ token: null }),
  }), {name: "auth-storage"}
));



