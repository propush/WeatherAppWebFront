import {FormEvent, useContext, useEffect, useState} from "react";
import classes from "./AddWeatherPanel.module.css";
import {AuthContext} from "../auth/Auth.tsx";
import {useQuery} from "@tanstack/react-query";
import {geoLoader, GeoResponse} from "../loaders/geo_loader.ts";
import {saveLocation} from "../loaders/weather_loader.ts";
import {Box, Button, TextField, Typography} from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import {Grid, Stack} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import {GeoData} from "./GeoData.tsx";

type LocationSearchState = "initial" | "entering" | "searching" | "adding" | "error";

function AddWeatherButton(props: {
    setLocationSearchState: (locationSearchState: LocationSearchState) => void,
    setLocationFilter: (locationFilter: string) => void
}) {
    useEffect(() => {
        props.setLocationFilter("");
    }, []);
    return <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon/>}
        onClick={() => props.setLocationSearchState("entering")}
    />;
}

function CancelButton(props: { setLocationSearchState: (locationSearchState: LocationSearchState) => void }) {
    return <Button
        variant="contained"
        color="secondary"
        startIcon={<CancelIcon/>}
        onClick={() => props.setLocationSearchState("initial")}
    />;
}

function LocationForm(props: {
    locationFilter: string,
    setLocationFilter: (locationFilter: string) => void,
    setLocationSearchState: (locationSearchState: LocationSearchState) => void
}) {

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        props.setLocationSearchState("searching");
    }

    return <Stack component="form" flexGrow={3} direction="row" onSubmit={handleSubmit}>
        <TextField type="text" placeholder="Location filter..." value={props.locationFilter} onChange={
            (event) => props.setLocationFilter(event.target.value)
        } autoFocus={true}/>
        <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon/>}
            disabled={props.locationFilter.trim().length === 0}
            type="submit"
        />
    </Stack>;
}

function LocationSearchList(props: {
    locationFilter: string,
    setLocationSearchState: (locationSearchState: LocationSearchState) => void,
    setError: (error: string | null) => void,
    onLocationChanged: () => void
}) {
    const auth = useContext(AuthContext)!;
    const {isPending, error, data} = useQuery({
        queryKey: ['geo', props.locationFilter],
        queryFn: () => geoLoader(auth, props.locationFilter)
    });

    function addLocation(geoData: GeoResponse) {
        console.log("Adding location", geoData);
        props.setLocationSearchState("adding");
        saveLocation(auth, geoData.name, geoData.country)
            .catch((error) => {
                console.log("Caught error while adding location", error);
                props.setLocationSearchState("error");
                props.setError(error.message);
                return Promise.reject(error);
            })
            .then(() => {
                console.log("Added location", geoData);
                props.setLocationSearchState("initial");
                props.setError(null);
                props.onLocationChanged();
            });
    }


    return <Box>
        {isPending && <Typography>Loading...</Typography>}
        {error && <Typography className={classes.error}>{error.message}</Typography>}
        {data && <GeoData data={data} addLocation={addLocation}/>}
    </Box>;
}

export function AddWeatherPanel(props: { onLocationChanged: () => void }) {
    const [locationSearchState, setLocationSearchState] = useState<LocationSearchState>("initial");
    const [locationFilter, setLocationFilter] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="top"
        >
            <Grid item>
                <Stack direction="row" alignItems="start" spacing={2}>
                    {locationSearchState == "initial" &&
                        <AddWeatherButton setLocationSearchState={setLocationSearchState}
                                          setLocationFilter={setLocationFilter}/>}
                    {locationSearchState == "entering" &&
                        <LocationForm locationFilter={locationFilter} setLocationFilter={setLocationFilter}
                                      setLocationSearchState={setLocationSearchState}/>}
                    {locationSearchState == "searching" &&
                        <LocationSearchList locationFilter={locationFilter}
                                            setLocationSearchState={setLocationSearchState}
                                            setError={setError}
                                            onLocationChanged={props.onLocationChanged}/>}
                    {locationSearchState == "adding" && <Typography>Adding location...</Typography>}
                    {locationSearchState == "error" && <Typography className={classes.error}>{error}</Typography>}
                </Stack>
            </Grid>
            {locationSearchState != "initial" &&
                <Grid item marginLeft="10px"><CancelButton setLocationSearchState={setLocationSearchState}/></Grid>}
        </Grid>
    );
}
