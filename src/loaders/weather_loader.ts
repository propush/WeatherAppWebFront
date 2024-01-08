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

export interface WeatherData {
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

export type WeatherDataList = (WeatherData)[];

export async function fetchWeatherData(location: string): Promise<WeatherData | null> {
    const baseUrl: string = "https://api.openweathermap.org";
    const limit: number = 10;
    //TODO: Move API key to .env file
    const apiKey: string = "7c31bd47fd676ab4174f91cfa4d3f30b";
    const response = await fetch(`${baseUrl}/data/2.5/weather?q=${location}&limit=${limit}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
        console.log(`Error fetching weather data: ${response.statusText}`)
        return null;
    }

    const weatherData = await response.json() as WeatherData;
    console.log(`Fetched weather data for ${weatherData.name}`)
    return weatherData;
}

export async function weatherLoader(): Promise<WeatherDataList> {
    const locations = ["Moscow", "Belgrade"];
    const weatherDataPromises = locations.map(location => fetchWeatherData(location));
    const weatherDataList = await Promise.all(weatherDataPromises);
    return weatherDataList.filter((weatherData) => weatherData != null) as WeatherDataList;
}
