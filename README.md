# Wanderwise AI ✈️

Wanderwise AI is a web application that generates personalized travel itineraries using generative AI. Users can input their destination, travel dates, and interests, and the app provides a suggested day-by-day plan.

## ✨ Features

* **Personalized Itinerary Generation:** Creates detailed day-by-day travel plans based on user preferences using the Google Gemini API.
* **Weather Information:** Displays current weather for the chosen destination using the OpenWeatherMap API.
* **Suggested Trips:** Offers inspiration with a curated list of popular travel destinations.
* **Responsive Design:** Optimized for various screen sizes.
* **Theme Toggle:** Switch between light and dark modes.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, TypeScript
* **Styling:** Tailwind CSS
* **APIs:**
    * Google Gemini API (for itinerary generation)
    * OpenWeatherMap API (for weather data)
* **Markdown Parsing:** `marked.js` (loaded via CDN)

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)<your-username>/Wanderwise-ai.git
    cd Wanderwise-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Add API Keys:**
    * You need API keys from both [Google AI Studio](https://aistudio.google.com/app/apikey) (for Gemini) and [OpenWeatherMap](https://openweathermap.org/api) (for Weather).
    * Open `src/components/HomePage.tsx`.
    * Replace the placeholder strings for `GEMINI_API_KEY` and `WEATHER_API_KEY` with your actual keys.
    * **(Recommended):** For better security, consider moving these keys to environment variables (`.env.local`). Create a `.env.local` file in the root directory:
        ```env
        const GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE
        const WEATHER_API_KEY=YOUR_WEATHER_KEY_HERE
        ```
        And update `HomePage.tsx` to use `process.env.NEXT_PUBLIC_GEMINI_API_KEY` and `process.env.NEXT_PUBLIC_WEATHER_API_KEY`. Remember to add `.env.local` to your `.gitignore` file!

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Future Enhancements (Potential)

* User accounts for saving itineraries.
* Option to export itineraries (e.g., PDF, Calendar).
* Map integration to visualize locations.
* More detailed customization options (budget, pace, travel style).
