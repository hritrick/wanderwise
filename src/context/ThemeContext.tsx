"use client";
import { createContext, useContext } from 'react';

export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Create the context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};