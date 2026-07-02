import { NextResponse } from "next/server";

// Server-side proxy for OpenWeatherMap so the API key stays off the client.
// The key lives in OPENWEATHER_API_KEY (see .env.example).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const state = searchParams.get("state");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather API key not configured" },
      { status: 500 }
    );
  }

  const query = state ? `${city},${state},US` : city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    query
  )}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "City not found" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to reach weather service" },
      { status: 502 }
    );
  }
}
