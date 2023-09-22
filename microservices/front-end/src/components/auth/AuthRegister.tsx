import React, { FC, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import CustomTextField from '../forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';

interface AuthRegisterProps {
    title?:string;
    subtitle?: ReactNode;
    subtext?: ReactNode;
    onUsernameChange: (username: string) => void;
    onDisplayNameChange: (displayName: string) => void;
    onPasswordChange: (password: string) => void;
    onConfirmPasswordChange: (confirmPassword: string) => void;
    onSignup: () => void;
    username: string;
    displayName: string;
    password: string;
    confirmPassword: string;

}

const AuthRegister: FC<AuthRegisterProps> = ({ 
    title, subtitle, subtext ,
    onUsernameChange, onDisplayNameChange, onPasswordChange,
    onConfirmPasswordChange, onSignup,
    username, displayName, password, confirmPassword
}) => (
    <>
        {title ? (
            <Typography fontWeight="700" variant="h2" mb={1}>
                {title}
            </Typography>
        ) : null}

        {subtext}

        <Box>
            <Stack mb={3}>
                {/* mb=3 just control margin-bottom of Stack component! */}
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" 
                    htmlFor='username' mb="5px">Username</Typography>
                <CustomTextField id="username" variant="outlined" fullWidth
                value = {username}
                onChange={(e) => onUsernameChange(e.target.value)} 
                />

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" 
                    htmlFor='displayName' mb="5px" mt="25px">Display Name
                </Typography>
                <CustomTextField id="displayName" variant="outlined" fullWidth 
                value = {displayName}
                onChange={(e) => onDisplayNameChange(e.target.value)}
                />

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" 
                    htmlFor='password' mb="5px" mt="25px">Password
                </Typography>
                <CustomTextField id="password" type = "password" variant="outlined" fullWidth 
                value = {password}
                onChange={(e) => onPasswordChange(e.target.value)}
                />

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" 
                    htmlFor='confirmPassword' mb="5px" mt="25px">Confirm Password
                </Typography>
                <CustomTextField id="confirmPassword" type = "password" variant="outlined" fullWidth 
                value = {confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                />
            </Stack>
            <Button 
            color="primary" variant="contained" size="large" fullWidth 
            onClick={onSignup}
            type = "button"
            >
                Sign Up
            </Button>
        </Box>
        {subtitle}
    </>
);

export default AuthRegister;
