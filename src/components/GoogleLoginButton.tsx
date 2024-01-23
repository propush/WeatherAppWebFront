import {useContext} from "react";
import {AuthContext} from "../auth/Auth.tsx";
import {GoogleLogin} from "@react-oauth/google";
import {exchangeExternalToken} from "../loaders/token_loader.ts";

export function GoogleLoginButton(props: { setError: (error: Error) => void }) {
    const auth = useContext(AuthContext)!;

    return <GoogleLogin
        onSuccess={credentialResponse => {
            console.log('Successful Google login');
            exchangeExternalToken(credentialResponse.credential, "google")
                .catch((error) => {
                    console.error(`Error exchanging external token: ${error}`);
                    props.setError(error);
                    return Promise.reject(error);
                })
                .then((token) => {
                    auth.setToken(token);
                    console.log(`Successfully logged in with external token`);
                });
        }}
        onError={() => {
            console.log('Google login failed');
            props.setError(new Error("Google login failed"));
        }}/>;
}
