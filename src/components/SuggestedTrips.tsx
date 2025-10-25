"use client";
import React from 'react';
import Image from 'next/image';
import { suggestedTrips } from '@/data/SuggestedTrips';

// Reuse the same Trip type
interface Trip {
  destination: string;
  highlights: string;
  bestTime: string;
  image: string;
}

interface SuggestedTripsProps {
  onTripSelect: (trip: Trip) => void;
}

export const SuggestedTrips: React.FC<SuggestedTripsProps> = ({ onTripSelect }) => (
  <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-red-200/50 dark:shadow-red-900/50 shadow-2xl mt-12 animate-fade-in-up">
    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
      Discover Your Next Adventure
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {suggestedTrips.map((trip: Trip) => (
        <div
          key={trip.destination}
          onClick={() => onTripSelect(trip)}
          className="cursor-pointer bg-red-50 dark:bg-gray-700/50 rounded-xl overflow-hidden shadow-md border border-red-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <Image
            src={trip.image}
            alt={trip.destination}
            width={600}
            height={400}
            className="w-full h-48 object-cover object-center"
          />
          <div className="p-5">
            <h3 className="font-bold text-lg md:text-xl text-red-800 dark:text-red-400 mb-2">
              {trip.destination}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {trip.highlights}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-red-100 dark:border-gray-600">
              <strong>Best time to visit:</strong>{' '}
              <span className="font-medium">{trip.bestTime}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
