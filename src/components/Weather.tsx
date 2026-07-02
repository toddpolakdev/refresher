"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

import useLocalStorage from "../hooks/useLocalStorage";

type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const [location, setLocation] = useLocalStorage("weather-location", {
    city: "",
    stateCode: "",
  });

  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (city: string, stateCode: string) => {
    const params = new URLSearchParams({ city });
    if (stateCode) params.set("state", stateCode);

    try {
      const response = await fetch(`/api/weather?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "City not found.");
      }

      setWeather(data);
      setError(null);
    } catch (err) {
      setWeather(null);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }, []);

  const handleSearch = async () => {
    if (!location.city) return;

    setLocation({ city: location.city, stateCode: location.stateCode });
    fetchWeather(location.city, location.stateCode);
  };

  const convertToFahrenheit = useMemo(() => {
    return weather ? Math.round((weather.main.temp * 9) / 5 + 32) : null;
  }, [weather]);

  useEffect(() => {
    if (location?.city) {
      try {
        fetchWeather(location?.city, location?.stateCode);
      } catch (e) {
        if (e instanceof Error)
          console.error("Invalid location in localStorage", e.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="weather">
      <h3 className="weather-title">🌦️ Weather</h3>

      <input
        className="weather-input"
        type="text"
        placeholder="Enter city…"
        value={location?.city}
        onChange={(e) => setLocation({ ...location, city: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <input
        className="weather-input"
        type="text"
        placeholder="State (optional)"
        value={location?.stateCode}
        onChange={(e) =>
          setLocation({ ...location, stateCode: e.target.value })
        }
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <button className="weather-btn" onClick={handleSearch}>
        Get Weather
      </button>

      {error && <p className="weather-error">{error}</p>}

      {weather && (
        <div className="weather-result">
          <div className="weather-place">{weather.name}</div>
          {convertToFahrenheit !== null && (
            <div className="weather-temp">{convertToFahrenheit}°F</div>
          )}
          <div className="weather-desc">{weather.weather[0].description}</div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@2x.png`}
            alt={weather.weather[0]?.description}
          />
        </div>
      )}
    </div>
  );
};

export default Weather;
