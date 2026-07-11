"use client";

import { useCallback, useEffect, useState } from "react";

import useLocalStorage from "../hooks/useLocalStorage";
import {
  DEFAULT_LOCATION,
  WEATHER_LOCATION_KEY,
  groupForecastByDay,
  iconUrl,
  toFahrenheit,
  type ForecastDay,
  type ForecastResponse,
  type WeatherData,
} from "../lib/weather";

/**
 * Expanded weather view shown in a floating window. Reads the same
 * "weather-location" as the sidebar widget (via useLocalStorage), so searching
 * here updates the widget too, and vice versa. Fetches both current conditions
 * and the 5-day forecast.
 */
const WeatherPage = () => {
  const [location, setLocation] = useLocalStorage(
    WEATHER_LOCATION_KEY,
    DEFAULT_LOCATION
  );

  const [current, setCurrent] = useState<WeatherData | null>(null);
  const [days, setDays] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (city: string, stateCode: string) => {
    if (!city) return;

    const params = new URLSearchParams({ city });
    if (stateCode) params.set("state", stateCode);
    const qs = params.toString();

    setLoading(true);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?${qs}`),
        fetch(`/api/weather/forecast?${qs}`),
      ]);

      const currentData = await currentRes.json();
      if (!currentRes.ok) {
        throw new Error(currentData?.error || "City not found.");
      }
      setCurrent(currentData);

      const forecastData: ForecastResponse = await forecastRes.json();
      setDays(forecastRes.ok ? groupForecastByDay(forecastData.list) : []);

      setError(null);
    } catch (err) {
      setCurrent(null);
      setDays([]);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    if (!location.city) return;
    setLocation({ city: location.city, stateCode: location.stateCode });
    load(location.city, location.stateCode);
  };

  useEffect(() => {
    if (location?.city) load(location.city, location.stateCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="weather-page">
      <div className="weather-page-search">
        <input
          className="weather-page-input"
          type="text"
          placeholder="Enter city…"
          value={location?.city}
          onChange={(e) => setLocation({ ...location, city: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <input
          className="weather-page-input weather-page-input--state"
          type="text"
          placeholder="State"
          value={location?.stateCode}
          onChange={(e) =>
            setLocation({ ...location, stateCode: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="weather-page-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <p className="weather-error">{error}</p>}

      {loading && !current && <p className="weather-page-muted">Loading…</p>}

      {current && (
        <div className="weather-current">
          <img
            className="weather-current-icon"
            src={iconUrl(current.weather[0]?.icon, "4x")}
            alt={current.weather[0]?.description}
          />
          <div className="weather-current-info">
            <div className="weather-current-place">{current.name}</div>
            <div className="weather-current-temp">
              {toFahrenheit(current.main.temp)}°F
            </div>
            <div className="weather-current-desc">
              {current.weather[0]?.description}
            </div>
          </div>
        </div>
      )}

      {days.length > 0 && (
        <div className="weather-forecast">
          <h4 className="weather-forecast-title">5-Day Forecast</h4>
          <div className="weather-forecast-row">
            {days.map((day) => (
              <div key={day.date} className="forecast-day">
                <div className="forecast-day-label">{day.label}</div>
                <img
                  className="forecast-day-icon"
                  src={iconUrl(day.icon)}
                  alt={day.description}
                />
                <div className="forecast-day-temps">
                  <span className="forecast-day-max">
                    {toFahrenheit(day.max)}°
                  </span>
                  <span className="forecast-day-min">
                    {toFahrenheit(day.min)}°
                  </span>
                </div>
                <div className="forecast-day-desc">{day.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!current && !loading && !error && (
        <p className="weather-page-muted">
          Search for a city to see current conditions and the forecast.
        </p>
      )}
    </div>
  );
};

export default WeatherPage;
