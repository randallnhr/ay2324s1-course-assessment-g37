import React, { useState, useContext, MouseEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useUser } from '../UserContext';

interface User {
    username: string;
    displayName: string;
    role: "basic" | "admin";
}

const defaultUser: User = {
    username: "Hihihi",
    displayName: "Mewo",
    role: "basic"
}

const LoginPage: React.FC = () => {

    const context = useUser();
    // const navigate = useNavigate();

    if (!context) {
        console.log("Context not available");
        return <div>Error: Context not available</div>;
    } 

    const {
        currentUser,
        setCurrentUser
    } = context;

    const handleLogin = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCurrentUser({
            username: "AAA",
            displayName: "BBB",
            role: "basic"
        });
    }

    return (
        <div className='login-container'>
            <h1 className='login-header'>Login Page</h1>
                <button className='action-button' onClick={handleLogin}>Login</button>
                <span>User Name: {currentUser?.username} </span>
        </div>      
    );
};

export default LoginPage;
