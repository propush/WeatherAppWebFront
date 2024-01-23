import {ChangeEvent, FormEvent, useContext, useEffect, useState} from "react";
import {AuthContext} from "../auth/Auth.tsx";
import classes from "./Login.module.css";
import {tokenLoader, UserCredentials} from "../loaders/token_loader.ts";
import {Link} from "react-router-dom";
import {Box, Button, TextField, Typography} from "@material-ui/core";
import {Grid} from "@mui/material";
import {GoogleLoginButton} from "./GoogleLoginButton.tsx";

export function Login() {
    const auth = useContext(AuthContext)!;
    const [credentials, setCredentials] = useState<UserCredentials>({username: "", password: ""});
    const [canSubmit, setCanSubmit] = useState<boolean>(true);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        console.log("Submitting credentials");
        setIsPending(true);
        setError(null);
        tokenLoader(credentials)
            .catch((error) => {
                console.error(`Error: ${error}`);
                setError(error);
            })
            .then((token) => {
                auth.setToken(token ?? null);
            })
            .finally(() => {
                setCredentials(credentials => ({...credentials, password: ""}));
                setIsPending(false);
            });
    }

    function credentialsChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        if (name === "username") {
            setCredentials(credentials => ({...credentials, username: value}));
        } else if (name === "password") {
            setCredentials(credentials => ({...credentials, password: value}));
        }
    }

    useEffect(() => {
        setCanSubmit(credentials.username !== "" && credentials.password !== "");
    }, [credentials, isPending]);

    return <>
        <Box>
            <Typography variant="h4" align="center">Login:</Typography>
            <Box component="form" className={classes.loginForm}>
                <Grid direction="column" container spacing={2}>
                    <div className={classes.error} hidden={error === null}>
                        {error !== null && <div>{error.message}</div>}
                    </div>
                    <TextField
                        label="Username"
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={credentialsChange}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={credentialsChange}
                    />
                    <Button type="button" value="Submit" onClick={handleSubmit} disabled={!canSubmit}>
                        Login
                    </Button>
                    <Box display="flex" justifyContent="center">
                        <GoogleLoginButton setError={setError}/>
                    </Box>
                </Grid>
            </Box>
        </Box>
        <Box>
            <Typography align="center">Don't have an account yet? <Link to="/signup">Signup</Link>.</Typography>
        </Box>
    </>;
}
