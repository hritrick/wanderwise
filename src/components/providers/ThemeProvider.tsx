"use client";
import React, { useState, useEffect } from 'react';
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext'; // Ensure path is correct

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

  // Default to 'light' for initial server render AND client render before effect runs
  const [theme, setTheme] = useState<string>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Runs ONLY on the client, AFTER initial render/hydration
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialClientTheme = 'light'; // Default assumption

    if (storedTheme) {
      initialClientTheme = storedTheme; // Use stored preference if available
    } else {
      initialClientTheme = systemPrefersDark ? 'dark' : 'light'; // Fallback to system preference
    }

    // Set the theme state based on client-side check
    setTheme(initialClientTheme); 
    setIsInitialized(true);

  }, []); // Empty dependency array ensures this runs only once on mount

  // Runs whenever 'theme' state changes (initially and on toggle)
  useEffect(() => {
    if (!isInitialized) return; // Don't apply theme until initialized
    
    // Apply/remove the 'dark' class to the root <html> element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, isInitialized]); // Run this effect when the theme state changes

  // Function passed down via context to toggle the theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); // Update React state
    localStorage.setItem('theme', newTheme); // Persist preference
  };

  // Value provided to consuming components via context
  const value: ThemeContextType = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};