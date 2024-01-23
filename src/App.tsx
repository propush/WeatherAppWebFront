import {AppBar, Button, Toolbar, Typography} from '@material-ui/core';
import {Link, Outlet} from "react-router-dom";
import {AuthContext, useAuth} from "./auth/Auth.tsx";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./loaders/query_client.ts";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {googleClientId} from "./loaders/env.ts";

function App() {
    const auth = useAuth();

    function LogoutLink() {
        return <>
            {auth?.token != null &&
                <>
                    <Button color="inherit" component={Link} to="/logout">Logout</Button>
                </>
            }
        </>;
    }

    return (
        <>
            <AuthContext.Provider value={auth}>
                <QueryClientProvider client={queryClient}>
                    <GoogleOAuthProvider clientId={googleClientId}>

                        <AppBar position="static">
                            <Toolbar>
                                <Typography variant="h6" style={{flexGrow: 1}}>
                                    <Button color="inherit" component={Link} to="/">Main</Button>
                                </Typography>
                                <LogoutLink/>
                            </Toolbar>
                        </AppBar>

                        <div style={{display: 'flex', flexDirection: 'column', minHeight: '92vh'}}>
                            <div style={{flexGrow: 1}}>
                                <Outlet/>
                            </div>

                            <AppBar position="static" style={{
                                top: 'auto',
                                bottom: 0,
                                backgroundColor: '#c5cae9',
                                height: '1em',
                                margin: '5px 0px',
                                display: 'flex',
                                alignItems: 'end'
                            }}>
                                <Typography variant="caption" color="inherit">
                                    Copyright &copy; 2024, Sergey Poziturin.
                                </Typography>
                            </AppBar>
                        </div>

                    </GoogleOAuthProvider>
                </QueryClientProvider>
            </AuthContext.Provider>
        </>
    )
}

export default App;
