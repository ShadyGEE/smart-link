import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  jobTitle?: string;
  department?: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER' | 'GUEST';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await window.api.auth.login(email, password);

          if (response.success && response.data) {
            set({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              expiresAt: response.data.expiresAt,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            set({
              error: response.error?.message || 'Login failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: 'An unexpected error occurred',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
        set({ isLoading: true, error: null });

        try {
          const response = await window.api.auth.register(data);

          if (response.success && response.data) {
            set({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              expiresAt: response.data.expiresAt,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            set({
              error: response.error?.message || 'Registration failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: 'An unexpected error occurred',
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await window.api.auth.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            isAuthenticated: false,
          });
        }
      },

      checkSession: async () => {
        const { accessToken, expiresAt } = get();

        // No token, not authenticated
        if (!accessToken) {
          set({ isAuthenticated: false });
          return;
        }

        // Check if token is expired
        if (expiresAt && Date.now() > expiresAt) {
          // Try to refresh
          try {
            const response = await window.api.auth.refresh();
            if (response.success && response.data) {
              set({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                expiresAt: response.data.expiresAt,
                isAuthenticated: true,
              });
              return;
            }
          } catch {
            // Refresh failed, logout
          }

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            isAuthenticated: false,
          });
          return;
        }

        // Token is valid
        set({ isAuthenticated: true });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'smartlink-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
