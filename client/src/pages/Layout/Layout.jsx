import React from "react";
import { BrowserRouter} from "react-router-dom";
import Routers from "../../Routes";
import Topbar from "../../components/Topbar/Topbar";
export default function Layout() {
    return(<>
        <BrowserRouter>
            <Topbar/>
            <Routers/>  
        </BrowserRouter>
    </>
    );
}