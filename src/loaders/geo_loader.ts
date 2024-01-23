import {AuthType, extractTokenOrThrow} from "../auth/Auth.tsx";
import {parseErrorReason} from "./query_client.ts";
import {serverBaseUrl} from "./env.ts";

export interface GeoResponse {
    name: string;
    country: string;
    state: string;
}

export async function geoLoader(auth: AuthType, locationFilter: string): Promise<Array<GeoResponse>> {
    const token = extractTokenOrThrow(auth);

    const baseUrl: string = serverBaseUrl;
    const response = await fetch(`${baseUrl}/api/v1/geo?location=${locationFilter.trimStart()}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const reason = await parseErrorReason(response);
        console.log(`Error fetching geo data: ${reason}`)
        throw new Error(reason);
    }

    const geo: Array<GeoResponse> = await response.json();
    console.log(`Geo: ${JSON.stringify(geo)}`);
    return geo;
}
