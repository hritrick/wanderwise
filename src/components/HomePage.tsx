"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './Navbar';
import { ItineraryBuilder } from './ItineraryBuilder';
import { WeatherDisplay } from './WeatherDisplay';
import { SuggestedTrips } from './SuggestedTrips';
import { TripDetailPage } from './TripDetailPage';

export const HomePage = () => {
    const GEMINI_API_KEY = "YOUR_GEMINI_KEY_HERE";
    const WEATHER_API_KEY = "YOUR_WEATHER_KEY_HERE";

    // App state
    const [itinerary, setItinerary] = useState<string | null>(null); // State to hold itinerary text
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [destinationForWeather, setDestinationForWeather] = useState("");
    const [visibleSection, setVisibleSection] = useState('builder');
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedTrip, setSelectedTrip] = useState<any>(null);

    const builderRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Effect for loading marked.js script (needed again for display)
    useEffect(() => {
        const scriptId = 'marked-script';
        if (!document.getElementById(scriptId)) { // Load script only once
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
            script.async = true;
            document.body.appendChild(script);

            // Cleanup function to remove script if component unmounts
            return () => {
                const existingScript = document.getElementById(scriptId);
                if (existingScript) {
                    document.body.removeChild(existingScript);
                }
            };
        }
    }, []); // Run only once on mount

    // Effect for scroll handling
    useEffect(() => {
        const handleScroll = () => {
            if (currentPage !== 'home') return;
            const suggestionsTop = suggestionsRef.current?.offsetTop;
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            if (suggestionsTop && scrollPosition >= suggestionsTop) {
                setVisibleSection('suggestions');
            } else {
                setVisibleSection('builder');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage]);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleTripSelect = (trip: any) => {
        setSelectedTrip(trip);
        setCurrentPage('trip-details');
        window.scrollTo(0, 0);
    };

    const handleBackToHome = () => {
        setCurrentPage('home');
        setSelectedTrip(null);
    };

    // --- Function to safely render Markdown ---
    const renderMarkdown = (markdownText: string | null) => {
        if (!markdownText) return { __html: '' };
        // Check if marked is loaded on the window object
        if (typeof window !== 'undefined' && (window as any).marked) {
            try {
                // Ensure GFM tables are enabled (usually default, but explicit is safer)
                (window as any).marked.setOptions({
                    gfm: true, // Enable GitHub Flavored Markdown (includes tables)
                    breaks: true // Interpret line breaks as <br> tags
                });
                return { __html: (window as any).marked.parse(markdownText) };
            } catch (parseError) {
                console.error("Error parsing Markdown:", parseError);
                return { __html: '<p>Error displaying itinerary content.</p>' };
            }
        }
        // Fallback if marked is not loaded yet or in SSR
        return { __html: markdownText.replace(/\n/g, '<br />') }; // Simple line break conversion
    };
    // --- End renderMarkdown function ---

    const renderContent = () => {
        switch (currentPage) {
            case 'trip-details':
                return <TripDetailPage trip={selectedTrip} onBack={handleBackToHome} />;
            case 'home':
            default:
                return (
                    <>
                        {/* Itinerary Builder Section */}
                        <div ref={builderRef} className="pt-4">
                            <ItineraryBuilder
                                setItinerary={setItinerary} // Pass setter down
                                setLoading={setLoading}
                                loading={loading} // Pass state down
                                setError={setError}
                                setDestinationForWeather={setDestinationForWeather}
                                openAiApiKey={GEMINI_API_KEY}
                            />
                        </div>

                        {/* Error Message Display */}
                        {error && (
                            <div className="mt-8 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative shadow-md animate-fade-in" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="mt-8 text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-red-100 dark:border-gray-700 animate-fade-in">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-t-4 border-b-4 border-red-600 dark:border-red-400"></div>
                                <p className="mt-4 text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300">Crafting your personalized journey...</p>
                            </div>
                        )}

                        {/* Weather Display */}
                        {destinationForWeather && !loading && (
                            <WeatherDisplay destination={destinationForWeather} apiKey={WEATHER_API_KEY} />
                        )}

                        {/* *** ADDED BACK: Itinerary Display Section *** */}
                        {itinerary && !loading && ( // Show only when itinerary exists and not loading
                            <div className="mt-8 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-red-200/50 dark:shadow-red-900/50 shadow-2xl animate-fade-in-up line-height-1.8">
                                {/* --- ADDED COLOR CLASSES HERE --- */}
                                <h2 className="text-3xl md:text-4xl font-extrabold text-red-700 dark:text-red-400 mb-6 text-center">Your Custom Travel Itinerary</h2>
                                {/* --- END ADDED CLASSES --- */}
                                <div className="overflow-x-auto">
                                    <div
                                        className="prose max-w-none dark:prose-invert" // Apply Tailwind Prose & dark mode styles
                                        dangerouslySetInnerHTML={renderMarkdown(itinerary)}
                                    ></div>
                                </div>
                            </div>
                        )}
                        {/* *** END Itinerary Display Section *** */}

                        {/* Suggested Trips Section */}
                        <div ref={suggestionsRef} className="pt-16">
                            <SuggestedTrips onTripSelect={handleTripSelect} />
                        </div>
                    </>
                );
        }
    };

    return (
        // Main container with sticky footer setup
        <div className="flex flex-col flex-1 bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">

            {/* Navbar */}
            <Navbar
                currentPage={currentPage}
                visibleSection={visibleSection}
                builderRef={builderRef}
                suggestionsRef={suggestionsRef}
                scrollToRef={scrollToRef}
                handleBackToHome={handleBackToHome}
            />

            {/* Main Content Area Wrapper */}
            <div className="flex-grow">
                <main className="container mx-auto p-4 sm:p-6 lg:p-12">
                    {renderContent()}
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-red-700 mt-auto py-4 text-white">
                <div className="container mx-auto text-center text-red-100 px-4">
                    <p>&copy; {new Date().getFullYear()} Wanderwise. All rights reserved.</p>
                </div>
            </footer>

            {/* *** ADDED BACK: Scoped CSS for Prose/Table Styling *** */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
                /* Base prose styles */
                :global(.prose) { color: #374151; }
                :global(.dark .prose) { color: #d1d5db; }
                :global(.dark .dark\:prose-invert) { /* Tailwind dark mode prose styles */
                    --tw-prose-body: theme(colors.gray.300);
                    --tw-prose-headings: theme(colors.red.400); /* Adjusted for theme */
                    /* ... Keep the rest of the prose-invert variables ... */
                    --tw-prose-invert-th-borders: theme(colors.gray.600);
                    --tw-prose-invert-td-borders: theme(colors.gray.700);
                }

                /* General Prose Elements */
                .prose h1 { /* Style for the main itinerary title if present */
                    font-size: 1.875rem; /* 30px */
                    font-weight: 800; /* Extra-bold */
                    color: #991b1b; /* Dark red */
                    margin-bottom: 0.75em;
                    text-align: center; /* Center the main title */
                 }
                 :global(.dark .prose h1) { color: #fca5a5; } /* Lighter red for dark mode */

                :global(.prose h2),
:global(.prose h3) {
    color: #b91c1c; /* darker red for light mode */
    font-weight: 800;
    text-transform: uppercase;
    margin-top: 1.5em;
    padding-top: 1.5em;
    border-top: 2px solid #fee2e2; /* light mode border */
    margin-bottom: 1em;
    padding-bottom: 0;
    letter-spacing: 0.05em;
    font-size: 1.25rem;
}

:global(.dark .prose h2),
:global(.dark .prose h3) {
    color: #f87171; /* lighter red for dark mode */
    border-top-color: #374151;
}


                /* --- MODIFIED Paragraphs --- */
                .prose p {
                    margin-bottom: 1.5em;
                    line-height: 2; /* INCREASED line spacing */
                }
                /* --- END MODIFIED Paragraphs --- */

                .prose ul, .prose ol { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
                .prose li { margin-bottom: 0.5em; line-height: 1.85; /* Apply increased line spacing here too */}

                /* --- Table Styles (Keep the border-collapse version) --- */
                .prose table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1.5em;
                    margin-bottom: 1.5em;
                    table-layout: fixed;
                    font-size: 0.95rem;
                }
                .prose th, .prose td {
                    padding: 0.875rem 1rem;
                    text-align: left;
                    border: 1px solid var(--tw-prose-td-borders, #e5e7eb);
                    vertical-align: top;
                    box-sizing: border-box;
                    line-height: 2; /* Slightly increased table line-height */
                    letter-spacing: 0.01em;
                    word-wrap: break-word;
                }
                 :global(.dark .prose th), :global(.dark .prose td) {
                     border-color: var(--tw-prose-invert-td-borders, #4b5563);
                 }
                .prose th {
                    background-color: var(--tw-prose-invert-pre-code, #f9fafb);
                    font-weight: 600;
                    color: var(--tw-prose-headings, #991b1b);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-size: 0.8rem;
                }
                 :global(.dark .prose th) {
                     background-color: var(--tw-prose-invert-pre-bg, #1f2937);
                     color: var(--tw-prose-invert-headings, #fca5a5);
                 }
                .prose td:first-child { font-weight: 600; color: var(--tw-prose-headings, #b91c1c); width: 18%; white-space: normal; }
                 :global(.dark .prose td:first-child) { color: var(--tw-prose-invert-headings, #fca5a5); }
                 .prose td:last-child { width: 52%; }
                .prose tr:nth-child(even) td { background-color: var(--tw-prose-pre-code, #f9fafb); }
                 :global(.dark .prose tr:nth-child(even)) td { background-color: var(--tw-prose-invert-pre-bg, #1f2937); }
                .prose td ul, .prose td ol { margin-top: 0.5em; margin-bottom: 0.5em; padding-left: 1.25em; }
                .prose td li { margin-bottom: 0.25em; line-height: 1.7; } /* Apply table line spacing here too */

                /* ... Keep Animations ... */
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

        </div>
    );
};