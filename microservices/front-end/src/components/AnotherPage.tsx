import React, { useState, useContext, MouseEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useUser } from '../UserContext';

const AnotherPage: React.FC = () => {
    const context = useUser();
    const navigate = useNavigate();

    if (!context) {
        console.log("Context not available");
        return <div>Error: Context not available</div>;
    } 

    const {
        currentUser,
        setCurrentUser
    } = context;

    return (
        <>
            <span>User Name: {currentUser?.username} </span>
        </>
    );
};

export default AnotherPage;