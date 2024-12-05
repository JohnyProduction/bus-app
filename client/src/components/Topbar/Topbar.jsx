import React, { useEffect, useState } from "react";
import './Topbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getUser, deleteSession, getToken } from "../../session";

export default function Topbar() {
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();

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
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setRefresh(prev => !prev);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div className="topbar">
            <div className="topbar-logo">BUS APP</div>
            <div className="topbar-buttons">
                {isLoggedIn()
                    ? <>
                        {getUser().username}
                        <button onClick={onLogout}>Wyloguj</button>
                    </>
                    : <>
                        <Link to="/login" className="topbar-button">Login</Link>
                        <Link to="/register" className="topbar-button">Register</Link>
                    </>
                }
            </div>
        </div>
    );
}
