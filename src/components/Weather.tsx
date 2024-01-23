import classes from "./Weather.module.css";
import {useQuery} from "@tanstack/react-query";
import {deleteLocation, WeatherDataList, weatherLoader, WeatherResponse} from "../loaders/weather_loader.ts";
import {AuthContext} from "../auth/Auth.tsx";
import {Login} from "./Login.tsx";
import {useContext, useEffect, useState} from "react";
import {AddWeatherPanel} from "./AddWeatherPanel.tsx";
import {Button, Container, Typography} from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import {Box, Grid, Stack} from "@mui/material";
import {imageBaseUrl, imageExtension} from "../loaders/env.ts";


function WeatherImage(props: { icon: string }) {
    return <img src={`${imageBaseUrl}${props.icon}${imageExtension}`} style={{objectFit: 'contain'}}></img>;
}

function tempToString(temp: number) {
    let sign = "";
    if (temp > 0) {
        sign = "+"
    }
    return `${sign}${temp} C`;
}

function DrawWeatherComponents(props: { data?: WeatherDataList, onLocationChanged: () => void }) {
    const onLocationChanged = props.onLocationChanged;

    function WeatherComponent(props: { location: string, weatherData: WeatherResponse }) {
        const auth = useContext(AuthContext)!;

        console.log("Rendering weather component", props);
        const weatherData = props.weatherData;

        function DeleteButton() {
            const [pressedAgain, setPressedAgain] = useState<boolean>(false);
            const handleDelete = () => {
                if (!pressedAgain) {
                    setPressedAgain(true);
                    setTimeout(() => setPressedAgain(false), 2000);
                    return;
                }
                deleteLocation(auth, props.location)
                    .then(() => onLocationChanged());
                return;
            };

            return (
                <Button
                    className={classes.deleteButton}
                    onClick={handleDelete}
                    variant="text"
                    color={pressedAgain ? "secondary" : "primary"}
                    startIcon={<DeleteIcon/>}
                />
            );
        }

        return (
            <Stack direction="row" justifyContent="space-between" className={classes.weatherLocation}>
                <Box flexGrow={1} margin="10px">
                    <Grid container direction="column">
                        <Grid item>
                            <Typography variant="h6">{weatherData.name} ({weatherData.sys.country})</Typography>
                        </Grid>
                        <Grid container direction="row" spacing={1}>
                            <Grid item>
                                <Typography variant="h4">{tempToString(weatherData.main.temp)}</Typography>
                            </Grid>
                            <Grid item>
                                <Grid container direction="column">
                                    <Grid item>
                                        <Typography variant="body1">Feels
                                            like: {tempToString(weatherData.main.feels_like)}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">Wind: {weatherData.wind.speed} m/s</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">Gust: {weatherData.wind.gust} m/s</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                <WeatherImage icon={weatherData.weather[0].icon}/>
                <DeleteButton/>
            </Stack>
        );
    }

    return <Container maxWidth="sm">
        {Object.entries(props.data ?? {}).map(([location, weatherData]) =>
            <WeatherComponent key={location} location={location} weatherData={weatherData}/>)}
    </Container>
}

export function Weather() {
    const auth = useContext(AuthContext)!;
    const {isPending, error, data, refetch} = useQuery({
        queryKey: ['weather', auth.token],
        queryFn: () => weatherLoader(auth),
        enabled: auth.token !== null
    });

    function needLogin() {
        console.log(`error: ${error}, token: ${auth.token}`);
        return auth.token === null;
    }

    useEffect(() => {
        refetch().then(() => console.log("Refetched weather data"));
    }, [auth.token, refetch]);

    if (needLogin()) {
        return <Login/>;
    }
    if (error !== null) {
        return <div>Error occurred: {error.message}</div>;
    }
    if (isPending) {
        return <div>Loading...</div>;
    }
    if (data === undefined) {
        return <div>No weather data available.</div>;
    }

    return (
        <>
            <Typography variant="h4" align="center" className={classes.typographyMargin}>Weather widgets:</Typography>
            <DrawWeatherComponents data={data} onLocationChanged={refetch}/>
            <AddWeatherPanel onLocationChanged={refetch}/>
        </>
    );
}
