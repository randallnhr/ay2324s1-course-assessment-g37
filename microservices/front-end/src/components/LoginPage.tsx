import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useUser } from '../UserContext';
import { User } from './types';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginFailed, setLoginFailed] = useState<boolean>(false);

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

    const handleLogin = async () => {
        try {
            const response = await axios.post("/api/auth/log-in", {
                username,
                password
            }, {
                withCredentials: true
            });
            
            if (response.status === 200) {
                // REQUIREMENT: Backend returns user data

                const userData: User = response.data;
                setCurrentUser(userData);

                // console.log("Updated User Context: ", context); 
                // console.log("Details: ", context?.currentUser?.username)
                // --> These will show null REGARDLESS of success or not, should check by currentUser?.username

                navigate("/question-bank");
            }
            
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Login failed: ", error);
                if (error.response && error.response.status === 401) {
                    setLoginFailed(true);
                }
            } else {
                console.error("An unknown error occured: ", error);
            }
        }
    };

    return (
        <div className='login-container'>
            <h1 className='login-header'>Login Page</h1>
            <div className='input-field'>
                <label htmlFor='username'>Username</label>
                <input
                id = "username"
                type = "text"
                value = {username}
                onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className='input-field'>
                <label htmlFor='password'>Password</label>
                <input
                id = "password"
                type = "password"
                value = {password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>


            <button className='action-button' onClick={handleLogin}>Login</button>
            <button className='action-button' onClick={() => navigate('/signup')}>Sign Up</button>
            {/* <span>User Name: {currentUser?.username} </span> */}
        {loginFailed && <h2 className='failed'>Login failed!</h2>}
        
        </div>      
    );
};

export default LoginPage;
