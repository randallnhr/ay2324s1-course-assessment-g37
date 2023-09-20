import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './ProfilePage.css';
import { AppBar } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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

    const handleQuestion = () => {
        navigate('/question-bank');
    }

    const handleSignout = () => {
        navigate('/login');
    }

    return (
        <div>
            <div>
            <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                HOME
                </Typography>
                <Button color="inherit" onClick={handleQuestion}>
                Profile
                </Button>
                <Button color="inherit" onClick={handleSignout}>
                Sign Out
                </Button>
            </Toolbar>
            </AppBar>
            </div>
        <div className='header-container'>
            <h1>Question Bank</h1>
        </div>
        <div className='profile-container'>
            <h1 className='profile-header'>Personal Profile</h1>

            <div className="profile-detail">
                <label>Username: </label>
                <span>{currentUser?.username}</span>
            </div>
            <div className="profile-detail">
                <label>Display Name: </label>
                <span>{currentUser?.displayName}</span>
            </div>
            <div className="profile-detail">
                <label>Role: </label>
                <span>{currentUser?.role}</span>
            </div>
        </div>
        </div>
    )

};

export default ProfilePage;