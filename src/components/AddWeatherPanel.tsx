import {useContext, useEffect, useState} from "react";
import classes from "./AddWeatherPanel.module.css";
import {AuthContext} from "../auth/Auth.tsx";
import {useQuery} from "@tanstack/react-query";
import {geoLoader, GeoResponse} from "../loaders/geo_loader.ts";
import {saveLocation} from "../loaders/weather_loader.ts";
import {Box, Button, List, ListItem, TextField, Typography} from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import {Grid, Stack} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

type LocationSearchState = "initial" | "entering" | "searching" | "adding" | "error";

export function AddWeatherPanel(props: { onLocationChanged: () => void }) {
    const auth = useContext(AuthContext)!;
    const [locationSearchState, setLocationSearchState] = useState<LocationSearchState>("initial");
    const [locationFilter, setLocationFilter] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    function AddWeatherButton() {
        useEffect(() => {
            setLocationFilter("");
        }, []);
        return <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon/>}
            onClick={() => setLocationSearchState("entering")}
        />;
    }

    function CancelButton() {
        return <Button
            variant="contained"
            color="secondary"
            startIcon={<CancelIcon/>}
            onClick={() => setLocationSearchState("initial")}
        />;
    }

    function LocationForm() {
        return <Stack component="form" flexGrow={3} direction="row">
            <TextField type="text" placeholder="Location filter..." value={locationFilter} onChange={
                (event) => setLocationFilter(event.target.value)
            } autoFocus={true}/>
            <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon/>}
                disabled={locationFilter.trim().length === 0}
                onClick={() => setLocationSearchState("searching")}
            />
        </Stack>;
    }

    function addLocation(geoData: GeoResponse) {
        console.log("Adding location", geoData);
        setLocationSearchState("adding");
        saveLocation(auth, geoData.name, geoData.country)
            .catch((error) => {
                console.log("Caught error while adding location", error);
                setLocationSearchState("error");
                setError(error.message);
                return Promise.reject(error);
            })
            .then(() => {
                console.log("Added location", geoData);
                setLocationSearchState("initial");
                setError(null);
                props.onLocationChanged();
            });
    }

    function LocationSearchList() {
        const {isPending, error, data} = useQuery({
            queryKey: ['geo', locationFilter],
            queryFn: () => geoLoader(auth, locationFilter)
        });

        function DisplayGeoData(props: { data: GeoResponse[] }) {
            const data = props.data;

            function GeoDataElement(props: { geoData: GeoResponse }) {
                const geoData = props.geoData;
                return (
                    <ListItem
                        button
                        onClick={() => addLocation(geoData)}
                    >
                        <Typography variant="body1">
                            {geoData.name}
                        </Typography>&nbsp;
                        <Typography variant="body2" color="textSecondary">
                            {geoData.state}, {geoData.country}
                        </Typography>
                    </ListItem>
                );
            }

            if (data.length === 0) {
                return <Typography>No locations found.</Typography>;
            }

            return (
                <Stack direction="column" className={classes.geoDataContainer} justifyContent="space-between">
                    <Typography align="center" variant="subtitle2">Found {data.length} location(s):</Typography>
                    <List>
                        {data.map((geoData, index) => <GeoDataElement key={index} geoData={geoData}/>)}
                    </List>
                </Stack>
            );
        }

        return <Box>
            {isPending && <Typography>Loading...</Typography>}
            {error && <Typography className={classes.error}>{error.message}</Typography>}
            {data && <DisplayGeoData data={data}/>}
        </Box>;
    }

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="top"
        >
            <Grid item>
                <Stack direction="row" alignItems="start" spacing={2}>
                    {locationSearchState == "initial" && <AddWeatherButton/>}
                    {locationSearchState == "entering" && <LocationForm/>}
                    {locationSearchState == "searching" && <LocationSearchList/>}
                    {locationSearchState == "adding" && <Typography>Adding location...</Typography>}
                    {locationSearchState == "error" && <Typography className={classes.error}>{error}</Typography>}
                </Stack>
            </Grid>
            {locationSearchState != "initial" && <Grid item marginLeft="10px"><CancelButton/></Grid>}
        </Grid>
    );
}

