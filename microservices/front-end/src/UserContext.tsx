// should be able to carry both attribute & function
import React from 'react';
import { User } from './components/types';

// store value and function together using a prop
export interface UserContextProps {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = React.createContext<UserContextProps | null>(null);

export default UserContext;

