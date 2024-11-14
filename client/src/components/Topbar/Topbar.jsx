import React from "react";
import './Topbar.css'
import { Link } from 'react-router-dom';
export default function Topbar() {
    return( 
        <div className="topbar">
        <div className="topbar-logo">BUS APP</div>
            <div className="topbar-buttons">
            <Link to="/login" className="topbar-button">Login</Link>
            <Link to="/register" className="topbar-button">Register</Link>
            </div>
        </div>
    );
}