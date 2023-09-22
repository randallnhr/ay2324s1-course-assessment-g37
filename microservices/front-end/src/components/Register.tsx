import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Card, Typography, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

import PageContainer from './container/PageContainer';
// import Logo from '../layouts/full/shared/logo/Logo';
import AuthRegister from './auth/AuthRegister';

const Register2: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");   
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<"basic" | "admin">("basic");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !displayName || !password) {
      alert("Required fields not filled up");
      return;
    }

    if (password != confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      console.log(username, displayName, password, role);
      const response = await axios.post("/api/auth/sign-up", {
        username,
        displayName,
        password,
        role
      });

      if (response.status == 200) {
        navigate('/login');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Signup failed:', error);
        if (error.response && error.response.status === 401) {
          alert("Failed to create account")
        }
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  const handleCancel = () => {
    setUsername('');
    setDisplayName('');
    setPassword('');
    setConfirmPassword('');
    setRole('basic');
    navigate('/login');
  };

  return (
  <PageContainer title="Register" description="this is Register page">
    <Box
      sx={{
        position: 'relative',
        '&:before': {
          content: '""',
          background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'absolute',
          height: '100%',
          width: '100%',
          opacity: '0.3',
        },
      }}
    >
      <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              {/* <Logo /> */}
            </Box>
            <AuthRegister
              subtext={
                <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                  Your Technical Interview Prep Platform
                </Typography>
              }
              subtitle={
                <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                    Already have an Account?
                  </Typography>
                  <Typography 
                    component={Link}
                    to="/login2"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Sign In
                  </Typography>
                </Stack>
              }
              onUsernameChange={(username) => setUsername(username)}
              onDisplayNameChange={(displayName) => setDisplayName(displayName)}
              onPasswordChange={(password) => setPassword(password)}
              onConfirmPasswordChange={(confirmPassword) => setConfirmPassword(confirmPassword)}
              onSignup={handleSignup}
              username={username}
              displayName={displayName}
              password={password}
              confirmPassword={confirmPassword}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
  );
};

export default Register2;
