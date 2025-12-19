import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'dark',

      setTheme: async (theme: Theme) => {
        let resolvedTheme: 'light' | 'dark' = 'dark';

        if (theme === 'system') {
          // Get system preference
          try {
            const result = await window.api.settings.getTheme();
            resolvedTheme = result === 'dark' ? 'dark' : 'light';
          } catch {
            resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
          }
        } else {
          resolvedTheme = theme;
        }

        // Update Electron native theme
        try {
          await window.api.settings.setTheme(theme);
        } catch (error) {
          console.error('Failed to set theme:', error);
        }

        set({ theme, resolvedTheme });
      },

      initTheme: async () => {
        const { theme } = get();
        let resolvedTheme: 'light' | 'dark' = 'dark';

        if (theme === 'system') {
          try {
            const result = await window.api.settings.getTheme();
            resolvedTheme = result === 'dark' ? 'dark' : 'light';
          } catch {
            resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
          }
        } else {
          resolvedTheme = theme;
        }

        set({ resolvedTheme });
      },
    }),
    {
      name: 'smartlink-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
