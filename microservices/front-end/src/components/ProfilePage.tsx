import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const ProfilePage: React.FC = () => {
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
        <div className='login-container'>
            <h1 className='login-header'>Personal Profile</h1>

            <div className="profile-detail">
                <span>Username: {currentUser?.username}</span>
            </div>
            <div className="profile-detail">
                <span>Display Name: {currentUser?.displayName}</span>
            </div>
            <div className="profile-detail">
                <span>Role: {currentUser?.role}</span>
            </div>
        </div>
    )

};

export default ProfilePage;