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

  const [location, setLocation] = useLocalStorage();

  const fetchWeather = useCallback(async (city: string, stateCode: string) => {
    const locationQuery = stateCode ? `${city},${stateCode},US` : `${city}`;

    const apiKey = "f7dc1574a3d507a5522daaf41f37dac7";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${locationQuery}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("City not found.");
      }
      const data = await response.json();

      setWeather(data);
    } catch (error) {
      console.log(error);
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
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🌦️ Weather</h1>

      <input
        type="text"
        placeholder="Enter city..."
        value={location?.city}
        onChange={(e) => setLocation({ ...location, city: e.target.value })}
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />

      <input
        type="text"
        placeholder="State (optional)"
        value={location?.stateCode}
        onChange={(e) =>
          setLocation({ ...location, stateCode: e.target.value })
        }
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />

      <button onClick={handleSearch}>Get Weather</button>

      {weather && (
        <div style={{ marginTop: "2rem" }}>
          <h2>{weather.name}</h2>
          {convertToFahrenheit !== null && (
            <p>Temperature: {convertToFahrenheit}°F</p>
          )}

          <p>Condition: {weather.weather[0].description}</p>
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
