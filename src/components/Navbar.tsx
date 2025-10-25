"use client";
import React, { useState } from 'react';
import Image from 'next/image'; // Import next/image
import { useTheme } from '../context/ThemeContext'; // Ensure this path is correct
import { MoonIcon, SunIcon, MenuIcon } from './Icons'; // Ensure this path is correct

// Define the props the Navbar will accept
interface NavbarProps {
  currentPage: string;
  visibleSection: string;
  builderRef: React.RefObject<HTMLDivElement | null>;
  suggestionsRef: React.RefObject<HTMLDivElement | null>;
  scrollToRef: (ref: React.RefObject<HTMLDivElement | null>) => void;
  handleBackToHome: () => void;
}

export const Navbar = ({
  currentPage,
  visibleSection,
  builderRef,
  suggestionsRef,
  scrollToRef,
  handleBackToHome
}: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu when scrolling
  const handleScrollAndCloseMenu = (ref: React.RefObject<HTMLDivElement | null>) => {
    scrollToRef(ref);
    setIsMenuOpen(false); // Close menu after clicking a link
  };

  return (
    <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-2 sm:py-4 flex justify-between items-center">

        {/* --- MODIFIED Logo/Title Section --- */}
        {/* Wrap in a flex container and make clickable */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleBackToHome}
          title="Go to Home" // Add title attribute for better accessibility
        >
          {/* Logo Image */}
          <Image
            src="/logo1.png" // Path relative to the public folder
            alt="Wanderwise Logo"
            width={32} // Set desired width (adjust as needed)
            height={32} // Set desired height (adjust as needed)
            className="h-8 w-8 sm:h-9 sm:w-9" // Control size responsively if needed
          />
          {/* Text Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Wanderwise
          </h1>
        </div>
        {/* --- END MODIFIED Logo/Title Section --- */}


        {/* Navigation Links & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop Navigation Links (only on home page) */}
          {currentPage === 'home' && (
            <div className="hidden md:flex space-x-2">
              <button
                onClick={() => scrollToRef(builderRef)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${visibleSection === 'builder' ? 'bg-white text-red-700 shadow-md' : 'text-white hover:bg-red-600'}`}
              >
                Itinerary Builder
              </button>
              <button
                onClick={() => scrollToRef(suggestionsRef)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${visibleSection === 'suggestions' ? 'bg-white text-red-700 shadow-md' : 'text-white hover:bg-red-600'}`}
              >
                Suggested Trips
              </button>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-red-600 focus:outline-none"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Mobile Menu Button (only on home page) */}
          {currentPage === 'home' && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="Open navigation menu"
              >
                <MenuIcon />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Dropdown (only on home page) */}
      {isMenuOpen && currentPage === 'home' && (
        <div className="md:hidden bg-red-700 border-t border-red-600">
          <button
            onClick={() => handleScrollAndCloseMenu(builderRef)}
            className={`block w-full text-left px-4 sm:px-6 py-3 font-semibold transition-all duration-300 ${visibleSection === 'builder' ? 'bg-red-800' : ''} hover:bg-red-600`}
          >
            Itinerary Builder
          </button>
          <button
            onClick={() => handleScrollAndCloseMenu(suggestionsRef)}
            className={`block w-full text-left px-4 sm:px-6 py-3 font-semibold transition-all duration-300 ${visibleSection === 'suggestions' ? 'bg-red-800' : ''} hover:bg-red-600`}
          >
            Suggested Trips
          </button>
        </div>
      )}
    </header>
  );
};