import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import App from "../App";
import Main from "../pages/Main.tsx";
import NotFound from "../pages/NotFound.tsx";
import {Logout} from "../pages/Logout.tsx";
import {Signup} from "../pages/Signup.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route path="" element={<Main/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Route>
    )
);

export default router;
