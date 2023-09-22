import React, { FC, ReactNode } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';

import CustomTextField from '../forms/theme-elements/CustomTextField';

interface AuthLoginProps {
    title?:string;
    subtitle?: ReactNode;
    subtext?: ReactNode;
    onUsernameChange: (username: string) => void;
    onPasswordChange: (password: string) => void;
    onSubmit: () => void;
    username: string;
    password: string;
}


const AuthLogin: FC<AuthLoginProps> = ({ 
    title, subtitle, subtext,
    onUsernameChange, onPasswordChange, onSubmit,
    username, password
}) => (
    <>
        {title ? (
            <Typography fontWeight="700" variant="h2" mb={1}>
                {title}
            </Typography>
        ) : null}

        {subtext}

        <Stack>
            <Box>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" 
                    htmlFor='username' mb="5px">Username</Typography>
                <CustomTextField 
                id="username" variant="outlined" fullWidth 
                value = {username}
                onChange={(e) => onUsernameChange(e.target.value)}
                />
            </Box>
            <Box mt="25px">
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" 
                    htmlFor='password' mb="5px" >Password</Typography>
                <CustomTextField 
                id="password" type="password" variant="outlined" fullWidth
                value = {password}
                onChange={(e) => onPasswordChange(e.target.value)} 
                />
            </Box>
            <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Remeber this Device"
                    />
                </FormGroup>
                {/* <Typography
                    component={Link}
                    to="/"
                    fontWeight="500"
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                    }}
                >
                    Forgot Password ?
                </Typography> */}
            </Stack>
        </Stack>
        <Box>
            <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                onClick={onSubmit}
                type="button"
            >
                Sign In
            </Button>
        </Box>
        {subtitle}
    </>
);

export default AuthLogin;
