// should be able to carry both attribute & function
import React, {useState, useContext, ReactNode, useEffect} from 'react';
import Cookies from 'js-cookie';
import { User } from './components/types';

interface UserContextType {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = React.createContext<UserContextType | null>(null);

export function useUser() {
    return useContext(UserContext);
}

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // read cookie and update context
    useEffect(() => {
        const cookieValue = Cookies.get('currentUser');
        if (cookieValue) {
            setCurrentUser(JSON.parse(cookieValue));
        }
    }, []);
    
    const value: UserContextType = {
        currentUser,
        setCurrentUser
    };

    return (
        <UserContext.Provider value = {value}>
            {children}
        </UserContext.Provider>
    );
}

