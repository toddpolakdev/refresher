// Shared weather types + helpers used by the sidebar widget (Weather.tsx) and
// the expanded weather window (WeatherPage.tsx). Both read the same location
// from localStorage so a search in one stays in sync with the other.

export const WEATHER_LOCATION_KEY = "weather-location";

export type WeatherLocation = { city: string; stateCode: string };

// Stable module-level constant: useLocalStorage needs a referentially stable
// initialValue (see hooks/useLocalStorage.ts).
export const DEFAULT_LOCATION: WeatherLocation = { city: "", stateCode: "" };

export type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

// Shape returned by OpenWeatherMap's 5-day / 3-hour forecast endpoint (subset).
export type ForecastEntry = {
  dt: number;
  dt_txt: string;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: { description: string; icon: string }[];
};

export type ForecastResponse = {
  city: { name: string };
  list: ForecastEntry[];
};

// One aggregated day derived from the 3-hour entries.
export type ForecastDay = {
  date: string; // YYYY-MM-DD
  label: string; // e.g. "Mon"
  min: number; // Celsius
  max: number; // Celsius
  icon: string;
  description: string;
};

export function toFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function iconUrl(icon: string, size: "2x" | "4x" = "2x"): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}

/**
 * Collapse the 3-hour forecast entries into one summary per day: min/max temp
 * across the day, with the icon/description taken from the entry closest to
 * midday (most representative of "what the day looks like"). Skips today so the
 * list shows the upcoming days.
 */
export function groupForecastByDay(entries: ForecastEntry[]): ForecastDay[] {
  const today = new Date().toISOString().slice(0, 10);
  const byDate = new Map<string, ForecastEntry[]>();

  for (const entry of entries) {
    const date = entry.dt_txt.slice(0, 10);
    if (date === today) continue;
    const group = byDate.get(date) ?? [];
    group.push(entry);
    byDate.set(date, group);
  }

  const days: ForecastDay[] = [];
  for (const [date, group] of byDate) {
    let min = Infinity;
    let max = -Infinity;
    for (const entry of group) {
      min = Math.min(min, entry.main.temp_min);
      max = Math.max(max, entry.main.temp_max);
    }

    // Entry nearest 12:00 for the icon/description.
    const midday = group.reduce((best, entry) => {
      const hour = Number(entry.dt_txt.slice(11, 13));
      const bestHour = Number(best.dt_txt.slice(11, 13));
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? entry : best;
    }, group[0]);

    days.push({
      date,
      label: new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
        weekday: "short",
      }),
      min,
      max,
      icon: midday.weather[0]?.icon ?? "",
      description: midday.weather[0]?.description ?? "",
    });
  }

  return days.slice(0, 5);
}
