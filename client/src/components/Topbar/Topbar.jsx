import React, { useEffect, useState } from "react";
import './Topbar.css'
import { Link } from 'react-router-dom';
import { isLoggedIn, getUser, deleteSession, setSession, getToken } from "../../session";

export default function Topbar() {
    const [refresh, setRefresh] = useState(false);

    const onLogout = async () => {
        try {
            const response = await fetch('http://localhost:3003/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: getToken() }),
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            const data = await response.json();
            deleteSession();
            console.log('Logout successful:', data);
            window.location.pathname = '/login';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        setRefresh(!refresh);
    }, [localStorage.getItem('session')]);
  

    return(
        <div className="topbar">
        <div className="topbar-logo">BUS APP</div>
            <div className="topbar-buttons">
            {isLoggedIn() ? (
                    <>
                        {getUser().role === "admin" && (
                            <>
                            <Link to="/admin-view" className="topbar-button">Admin Panel</Link>
                            <Link to="/favourite" className="topbar-button">Ulubione</Link>
                            </>
                        )}
                        <button onClick={onLogout} className="topbar-button">Wyloguj</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="topbar-button">Login</Link>
                        <Link to="/register" className="topbar-button">Register</Link>
                    </>
                )}
                 <Link to="/" className="topbar-button">Home</Link>
                
            </div>
        </div>
    );
}