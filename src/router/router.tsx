import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import App from "../App";
import Main from "../pages/Main.tsx";
import NotFound from "../pages/NotFound.tsx";
import {weatherLoader} from "../loaders/weather_loader.ts"; // import your 404 page

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route path="" element={<Main/>} loader={weatherLoader}/>
            <Route path="*" element={<NotFound/>}/> {/* This will be your 404 page */}
        </Route>
    )
);

export default router;
