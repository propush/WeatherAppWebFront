import classes from "./Weather.module.css";
import {useQuery} from "@tanstack/react-query";
import {deleteLocation, WeatherDataList, weatherLoader, WeatherResponse} from "../loaders/weather_loader.ts";
import {AuthContext} from "../auth/Auth.tsx";
import {Login} from "./Login.tsx";
import {useContext, useEffect, useState} from "react";
import {AddWeatherPanel} from "./AddWeatherPanel.tsx";
import {Button, Card, CardContent, Container, Typography} from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import {Box, Stack} from "@mui/material";


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
                <Box flexGrow={1}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{weatherData.name} ({weatherData.sys.country}):</Typography>
                            <Typography variant="body1">Temperature: {weatherData.main.temp} degrees
                                Celsius</Typography>
                            <Typography variant="body1">Feels like: {weatherData.main.feels_like} degrees
                                Celsius</Typography>
                            <Typography variant="body1">Weather: {weatherData.weather[0].main}</Typography>
                        </CardContent>
                    </Card>
                </Box>
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
        return auth.token === null || auth.authError !== null;
    }

    console.log(`Weather data: ${data}, error: ${error}, isPending: ${isPending}, token: ${auth.token}`);

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
