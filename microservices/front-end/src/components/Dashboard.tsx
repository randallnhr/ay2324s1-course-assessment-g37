import React, { MouseEvent } from 'react';
import { useAuth } from './AuthContext';

const Dashboard: React.FC = () => {
    const auth = useAuth();

    if (!auth) {
        return;
    }

    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = auth;

    const logIn = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoggedIn(true);
        setAuthUser({
        Name: 'John Doe'
        });
    };

    const logOut = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoggedIn(false);
        setAuthUser(null);
    };

    return (
        <>
        <span>User is currently: 
            {isLoggedIn ? 'Logged In' : 'Logged Out'}
        </span>
        {isLoggedIn && authUser ? (<span>User name: {authUser.Name} </span>) : null}
        {isLoggedIn 
        ? <button onClick={logOut}>Log Out</button>
        : <button onClick={logIn}>Log In</button>
        }           
        </>
    );
}

export default Dashboard;