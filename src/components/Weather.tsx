import {useLoaderData} from "react-router-dom";
import classes from "./Weather.module.css";
import {WeatherData, WeatherDataList} from "../loaders/weather_loader.ts";

function WeatherComponent(props: { weatherData: WeatherData }) {
    console.log("Rendering weather component", props);
    const weatherData = props.weatherData;
    return <>
        <div className={classes.weatherLocation}>
            <div>Weather data for {weatherData.name}:</div>
            <div>Temperature: {weatherData.main.temp} degrees Celsius</div>
            <div>Feels like: {weatherData.main.feels_like} degrees Celsius</div>
            <div>Weather: {weatherData.weather[0].main}</div>
        </div>
    </>;
}

export function Weather() {
    const weatherDatalist = useLoaderData() as WeatherDataList;
    if (weatherDatalist.length === 0) {
        return <div>No weather data available.</div>;
    }
    return weatherDatalist
        .map((weatherData, index) => <WeatherComponent key={index} weatherData={weatherData}/>);
}
