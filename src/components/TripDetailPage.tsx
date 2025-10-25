"use client";
import React from 'react';
import Image from 'next/image';
import { ArrowLeftIcon } from './Icons';

// Define type for trip
interface Trip {
  destination: string;
  highlights: string;
  bestTime: string;
  image: string;
}

interface TripDetailPageProps {
  trip: Trip;
  onBack: () => void;
}

export const TripDetailPage: React.FC<TripDetailPageProps> = ({ trip, onBack }) => (
  <div className="animate-fade-in">
    <button
      onClick={onBack}
      className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
    >
      <ArrowLeftIcon />
      Back to Home
    </button>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <Image
        src={trip.image}
        alt={trip.destination}
        width={1200}
        height={600}
        className="w-full h-64 md:h-96 object-cover object-center"
      />
      <div className="p-6 md:p-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-red-700 dark:text-red-400 mb-4">
          {trip.destination}
        </h1>
        <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
          <p>
            <strong>Highlights:</strong> {trip.highlights}
          </p>
          <p>
            <strong>Best Time to Visit:</strong> {trip.bestTime}
          </p>
        </div>
      </div>
    </div>
  </div>
);
