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
        // e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/login", {
                username,
                password
            });
            
            if (response.status === 200) {
                const userData: User = response.data;
                setCurrentUser(userData);

                navigate("/another");
            }
            
        } catch (error: unknown) {
            console.error(error);
        }
    }

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
                <span>User Name: {currentUser?.username} </span>
        </div>      
    );
};

export default LoginPage;
