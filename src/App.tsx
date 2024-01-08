import './App.css'
import {Link, Outlet} from "react-router-dom";

function App() {

    return (
        <>
            <header>
                <Link to="/">Main</Link>
            </header>

            <Outlet/>

            <footer>Footer</footer>
        </>
    )
}

export default App
