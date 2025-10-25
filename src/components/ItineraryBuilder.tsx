"use client";
import React, { useState } from "react";
import { formatDate } from "../lib/utils"; // Ensure path is correct
import { MapPinIcon, SparklesIcon, CalendarIcon, ArrowRightIcon } from "./Icons"; // Ensure path is correct

export const ItineraryBuilder = ({
  setItinerary,
  setLoading,
  loading,
  setError,
  setDestinationForWeather,
  openAiApiKey,
}: {
  setItinerary: (itinerary: string | null) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setError: (error: string | null) => void;
  setDestinationForWeather: (destination: string) => void;
  openAiApiKey: string;
}) => {
  // State for form inputs
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interests, setInterests] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Function to handle itinerary generation
  const handleGenerate = async () => {
    if (!destination || !startDate || !endDate || !interests) {
      setError("Please fill out all fields.");
      return;
    }
    if (new Date(startDate) < new Date(today)) {
      setError("Start date cannot be in the past.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before the start date.");
      return;
    }
    if (
      openAiApiKey === "YOUR_GEMINI_API_KEY_HERE" ||
      openAiApiKey === "PASTE_YOUR_GEMINI_API_KEY_HERE" ||
      !openAiApiKey
    ) {
      setError("Gemini API key is not configured. Please add your key in HomePage.tsx.");
      return;
    }

    // Update state before API call
    setLoading(true);
    setError(null);
    setItinerary(null);
    setDestinationForWeather(destination);

    const prompt = `
Generate a detailed travel itinerary for: ${destination}
Dates: ${formatDate(startDate)} to ${formatDate(endDate)}.
Interests: ${interests}.
Current User Location (for context, suggest local travel if relevant): Mumbai, Maharashtra, India.
Current Date & Time (for context): Saturday, October 25, 2025 at 2:08 PM IST.

**IMPORTANT:** Present the itinerary in a clearly structured format using Markdown — NOT in tables.

**Formatting Rules:**
1.  **Introduction:** Begin with a short overview (2–3 sentences).
2.  **For Each Day:**
Don't add a horizontal separator anywhere
    * **Heading:** Use \`## Day X: Title\`.
    * **Summary:** Follow with a 1-line summary.
    * **Activities:** List the day's activities in this exact format:
        🕒 **Time** — **Activity Name**
        Short paragraph describing what to do, highlights, duration, tips. Use **bold** for names, *italics* for small notes.
    * **Spacing:** Separate each activity block (time/name + description) with a single blank line.
    * **Tip:** End each day with a line like: \`_Tip of the Day: Something practical or cultural._\`
3.  **Style:** Use emojis moderately (🕒 ✈️ 🏞️ 🍽️ 🌇). Friendly, engaging tone.
4.  Keep formatting consistent throughout.

**Example Output Format:**
## DAY 1: DISCOVERING PARIS
Start your Paris adventure...

🕒 9:00 AM — **Eiffel Tower**
Enjoy panoramic city views...

🕒 12:30 PM — **Lunch at Café de Flore**
Classic Parisian bistro...

_Tip of the Day: Use a museum pass..._

--- 

## DAY 2: ARTISITC IMMERSION
Today focuses on art...

🕒 10:00 AM — **Louvre Museum**
Marvel at timeless masterpieces...

Generate the full itinerary in this clean structured format, including the horizontal rules between days.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${openAiApiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API error: ${response.statusText} - ${errorData.error?.message || "Unknown error"}`
        );
      }

      const data = await response.json();
      const itineraryText = data.candidates[0].content.parts[0].text;
      setItinerary(itineraryText);
    } catch (e: any) {
      setError(`Failed to generate itinerary: ${e.message}. Please check your Gemini API key.`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-red-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-8 md:p-10 rounded-2xl shadow-red-200/40 dark:shadow-red-900/40 shadow-xl space-y-8 animate-fade-in-up border border-red-100 dark:border-gray-700">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Plan Your Dream Trip
        </h2>
        <p className="text-md md:text-lg text-gray-600 dark:text-gray-400">
          Tell us your preferences and let AI craft your perfect adventure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {/* Destination */}
        <div className="space-y-2">
          <label
            htmlFor="destination"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Destination
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon />
            </div>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Paris, France"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label
            htmlFor="interests"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Interests
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SparklesIcon />
            </div>
            <input
              type="text"
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Art, History, Food"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label
            htmlFor="start-date"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Start Date
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon />
            </div>
            <input
              type="date"
              id="start-date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:[color-scheme:dark]"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label
            htmlFor="end-date"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            End Date
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon />
            </div>
            <input
              type="date"
              id="end-date"
              value={endDate}
              min={startDate || today}
              disabled={!startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-500 dark:[color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3.5 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <>
            Generate Itinerary
            <ArrowRightIcon />
          </>
        )}
      </button>
    </div>
  );
};