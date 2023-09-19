import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ChangePasswordPage.css';

// Should only allow change of password if old password matches!
const ChangePasswordPage: React.FC = () => {
    const [userkey, setUserkey] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const navigate = useNavigate();

    const handleChangePassword = async () => {
        if (!userkey || !oldPassword) {
            alert("User credentials required to change password");
            return;
        }

        if (!newPassword) {
            alert("New password cannot be empty");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response = await axios.put(`/api/users/${userkey}`, {
                userkey,
                oldPassword,
                newPassword
            });
            if (response.status === 200) {
                alert("Password changed successfully");

                setUserkey('');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');

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
        setNewPassword('');
        setConfirmPassword('');
        navigate('/login');
    };

    return (
        <div className='login-container'>
            <h1 className='login-header'>Change Password</h1>

            <div className='input-field'>
                <label htmlFor="userkey">Username</label>
                <input id="userkey" type="text" 
                value={userkey} 
                onChange={(e) => setUserkey(e.target.value)} />
            </div>
            <div className='input-field'>
                <label htmlFor="oldPassword">Old Password</label>
                <input id="oldPassword" type="password" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} />
            </div>                  
                    
            <div className='input-field'>
                <label htmlFor="newPassword">New Password</label>
                <input id="newPassword" type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className='input-field'>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button className='action-button' onClick={handleChangePassword}>Save</button>
            <button className='action-button' onClick={handleCancel}>Cancel</button>
        </div>
    )
};

export default ChangePasswordPage;