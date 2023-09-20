import React from 'react';

export interface User {
    username: string;
    displayName: string;
    password: string;
    role: "basic" | "admin";
}

const UserContext = React.createContext<User | null>(null);

export default UserContext;

