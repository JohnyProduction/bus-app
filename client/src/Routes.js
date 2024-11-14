import React from "react";
import {Routes, Route,useLocation} from 'react-router-dom';

import RegisterForm from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
export default function Routers(){
    const location = useLocation();
    
    return (
        <Routes location={location} key={location.pathname}>
            <Route exact path="/" Component={Home}/>
            <Route exact path="/login" Component={Login}/>
            <Route exact path="/register" Component={RegisterForm}/>
        </Routes>
    );
}