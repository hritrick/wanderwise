"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { CloudSunIcon } from './Icons';

export const WeatherDisplay = ({ destination, apiKey }: { destination: string, apiKey: string }) => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        if (!destination || !apiKey || apiKey === "YOUR_OPENWEATHERMAP_API_KEY_HERE") {
            setError("OpenWeatherMap API key is not configured.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${destination}&limit=1&appid=${apiKey}`);
            if(!geoResponse.ok) throw new Error("Failed to fetch location data.");
            const geoData = await geoResponse.json();

            if (geoData.length > 0) {
                const { lat, lon } = geoData[0];
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                if(!weatherResponse.ok) throw new Error("Failed to fetch weather data.");
                const weatherData = await weatherResponse.json();
                setWeather(weatherData);
            } else {
                setError("Could not find location.");
            }
        } catch (e: any) {
            setError(e.message);
        }
        setLoading(false);
    }, [destination, apiKey]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchWeather();
        }, 500);
        return () => clearTimeout(handler);
    }, [fetchWeather]);

    if (!destination) return null;

    return (
        <div className="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg mt-8 border border-red-100 dark:border-gray-700 animate-fade-in">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <CloudSunIcon /> Current Weather in {destination}
            </h3>
            {loading && <p className="text-gray-600 dark:text-gray-400">Loading weather...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {weather && (
                <div className="flex flex-row justify-between space-y-0 md:space-x-8">
                    <div className="flex items-center space-x-0">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                            className="w-16 h-16 sm:w-20 sm:h-20"
                        />
                        <div>
                            <p className="text-4xl sm:text-5xl font-extrabold text-red-700 dark:text-red-400">{weather.main.temp.toFixed(0)}°C</p>
                            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 capitalize">{weather.weather[0].description}</p>
                        </div>
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-1 text-center md:text-left">
                        <p>Feels like: <span className="font-semibold">{weather.main.feels_like.toFixed(0)}°C</span></p>
                        <p>Humidity: <span className="font-semibold">{weather.main.humidity}%</span></p>
                        <p>Wind: <span className="font-semibold">{weather.wind.speed} m/s</span></p>
                    </div>
                </div>
            )}
        </div>
    );
};