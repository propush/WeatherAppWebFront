import {parseErrorReason} from "./query_client.ts";
import {AuthType, extractTokenOrThrow} from "../auth/Auth.tsx";
import {serverBaseUrl} from "./env.ts";

interface Coord {
    lon: number;
    lat: number;
}

interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

interface Clouds {
    all: number;
}

interface Sys {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
}

export interface WeatherResponse {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export interface UserWeatherResponse {
    login: string;
    weatherResponseMap: WeatherDataList;
}

export type WeatherDataList = { [key: string]: WeatherResponse };

export async function fetchWeatherDataOwnBackend(auth: AuthType): Promise<UserWeatherResponse> {
    const token = auth?.token ?? null;
    if (token === null) {
        throw new Error("No token provided");
    }

    const baseUrl: string = serverBaseUrl;
    const response = await fetch(`${baseUrl}/api/v1/weather/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const reason = await parseErrorReason(response);
        console.log(`Error fetching weather data: ${reason}`)
        throw new Error(reason);
    }

    const weatherData = await response.json() as UserWeatherResponse;
    console.log(`Fetched weather data for ${weatherData.login}`);
    return weatherData;
}

export function toLocation(city: string, country: string): string {
    return `${city},${country}`;
}

export async function saveLocation(auth: AuthType, city: string, country: string): Promise<UserWeatherResponse> {
    const token = extractTokenOrThrow(auth);

    const baseUrl: string = serverBaseUrl;
    const response = await fetch(`${baseUrl}/api/v1/weather/user/location`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: toLocation(city, country)
        })
    });

    if (!response.ok) {
        const reason = await parseErrorReason(response);
        console.log(`Error adding location: ${reason}`)
        throw new Error(reason);
    }

    const weatherData = await response.json() as UserWeatherResponse;
    console.log(`Fetched weather data for ${weatherData.login}`);
    return weatherData;
}

export async function deleteLocation(auth: AuthType, location: string): Promise<UserWeatherResponse> {
    const token = extractTokenOrThrow(auth);

    const baseUrl: string = serverBaseUrl;
    const response = await fetch(`${baseUrl}/api/v1/weather/user/location`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: location
        })
    });

    if (!response.ok) {
        const reason = await parseErrorReason(response);
        console.log(`Error deleting location: ${reason}`)
        throw new Error(reason);
    }

    const weatherData = await response.json() as UserWeatherResponse;
    console.log(`Fetched weather data for ${weatherData.login}`);
    return weatherData;
}

export async function weatherLoader(auth: AuthType): Promise<WeatherDataList> {
    console.log("In weather loader");
    const weatherDataList = await fetchWeatherDataOwnBackend(auth);
    return weatherDataList.weatherResponseMap;
}
