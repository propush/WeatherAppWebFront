import {ChangeEvent, FormEvent, useContext, useEffect, useState} from "react";
import {AuthContext} from "../auth/Auth.tsx";
import {signupRequest, UserCredentials} from "../loaders/token_loader.ts";
import {Link, Navigate} from "react-router-dom";
import classes from "./Signup.module.css";
import {Box, Button, Container, TextField, Typography} from "@material-ui/core";
import {Grid} from "@mui/material";
import {GoogleLoginButton} from "../components/GoogleLoginButton.tsx";

export function Signup() {
    const auth = useContext(AuthContext)!;
    const [credentials, setCredentials] = useState<UserCredentials>({username: "", password: ""});
    const [canSubmit, setCanSubmit] = useState<boolean>(true);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        console.log("Signing up");
        setIsPending(true);
        setError(null);
        signupRequest(credentials)
            .catch((error) => {
                console.error(`Error: ${error}`);
                setError(error);
            })
            .then((result) => {
                console.log(`Got token`);
                auth.setToken(result ?? null);
            })
            .finally(() => {
                setCredentials({username: "", password: ""});
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

    if (auth.token != null) {
        return <Navigate to="/"/>;
    }

    return <>
        <Container>
            <Box>
                <Typography variant="h4" align="center">New user registration:</Typography>
                <Box component="form" className={classes.signupForm}>
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
                            Signup
                        </Button>
                        <Box display="flex" justifyContent="center">
                            <GoogleLoginButton setError={setError}/>
                        </Box>
                    </Grid>
                </Box>
            </Box>
            <Box>
                <Typography align="center">Already have an account? <Link to="/">Login</Link>.</Typography>
            </Box>
        </Container>
    </>;
}
