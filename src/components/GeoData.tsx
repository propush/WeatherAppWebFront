import {GeoResponse} from "../loaders/geo_loader.ts";
import {List, ListItem, Typography} from "@material-ui/core";
import {Stack} from "@mui/material";
import classes from "./GeoData.module.css";

function GeoDataElement(props: {
    geoData: GeoResponse,
    addLocation: (geoData: GeoResponse) => void
}) {
    const geoData = props.geoData;
    return (
        <ListItem
            button
            onClick={() => props.addLocation(geoData)}
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

export function GeoData(props: {
    data: GeoResponse[],
    addLocation: (geoData: GeoResponse) => void
}) {
    const data = props.data;


    if (data.length === 0) {
        return <Typography>No locations found.</Typography>;
    }

    return (
        <Stack direction="column" className={classes.geoDataContainer} justifyContent="space-between">
            <Typography align="center" variant="subtitle2">Found {data.length} location(s):</Typography>
            <List>
                {data.map(
                    (geoData, index) =>
                        <GeoDataElement key={index} geoData={geoData} addLocation={props.addLocation}/>
                )}
            </List>
        </Stack>
    );
}
