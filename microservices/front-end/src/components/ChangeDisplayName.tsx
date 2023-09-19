import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ChangeDisplayName.css'

// Similarly, should only allow change of display name if passes authentication
const ChangeDisplayName: React.FC = () => {
    const [userkey, setUserkey] = useState<string>("");
    const [password, setPassword] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');

    const navigate = useNavigate();

    const handleChangeDisplayName = async () => {
        if (!userkey || !password) {
            alert("User credentials required to change display name");
            return;
        }

        if (!displayName) {
            alert("New display name cannot be empty");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3001/login/${userkey}`, {
                userkey,
                password,
                displayName
            });
            if (response.status === 200) {
                alert("Password changed successfully");

                setUserkey('');
                setPassword('');
                setDisplayName('');

                navigate('/login');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Change password failed:', error);
                if (error.response && error.response.status === 401) {
                    alert("User credential is incorrect");
                }
            } else {
                console.error('An unknown error occurred:', error);
            }
        }
    };

    const handleCancel = () => {
        setUserkey('');
        setPassword('');
        setDisplayName('');
        navigate('/login');
    }

    return (
        <div className='login-container'>
            <h1 className='login-header'>Change Display Name</h1>

            <div className='input-field'>
                <label htmlFor="userkey">Username</label>
                <input id="userkey" type="text" 
                value={userkey} 
                onChange={(e) => setUserkey(e.target.value)} />
            </div>
            <div className='input-field'>
                <label htmlFor="password">Password</label>
                <input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                />
            </div>               
                    
            <div className='input-field'>
                <label htmlFor="displayName">New Display Name</label>
                <input id="displayName" type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} />
            </div>

            <button className='action-button' onClick={handleChangeDisplayName}>Save</button>
            <button className='action-button' onClick={handleCancel}>Cancel</button>
        </div>
    )
};

export default ChangeDisplayName;