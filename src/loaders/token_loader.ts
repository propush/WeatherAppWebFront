import {parseErrorReason} from "./query_client.ts";
import {serverBaseUrl} from "./env.ts";

export interface UserCredentials {
    username: string;
    password: string;
}

export async function signupRequest(credentials: UserCredentials): Promise<string> {
    const baseUrl = serverBaseUrl;
    const response = await fetch(`${baseUrl}/signup/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: credentials.username,
            password: credentials.password
        })
    });

    if (!response.ok) {
        const reason = await parseErrorReason(response);
        console.log(`Error registering: ${reason}`)
        throw new Error(reason);
    }

    const json = await response.json() as { token: string };
    return json.token;

}

export async function tokenLoader(credentials: UserCredentials): Promise<string> {
    const baseUrl: string = serverBaseUrl;
    const response = await fetch(`${baseUrl}/signup/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: credentials.username,
            password: credentials.password
        })
    });

    if (!response.ok) {
        const reason = await parseErrorReason(response);
        console.log(`Error fetching token data: ${reason}`)
        throw new Error(reason);
    }

    const json = await response.json() as { token: string };
    return json.token;
}
