import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserProvider, useUserContext } from "../UserContext";
import { User } from "./types";

// components
import PageContainer from "./container/PageContainer";
import AuthLogin from "./auth/AuthLogin";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginFailed, setLoginFailed] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const { currentUser, setCurrentUser } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/question-bank");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "/api/auth/log-in",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // REQUIREMENT: Backend returns user data

        const userData: User = response.data;
        setUser(userData);
        setCurrentUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        navigate("/question-bank");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert("Incorrect user credentials!");
        setLoginFailed(true);
      } else {
        alert("An unknown error occured. Try again later.");
        console.error("An unknown error occured: ", error);
      }
    }
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12} // how many grids the item should take, when the screen is extra small
            sm={12}
            lg={6}
            xl={5}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{
                p: 4,
                zIndex: 1,
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                {/* <Logo /> */}
              </Box>
              <AuthLogin
                subtext={
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    color="textSecondary"
                    mb={1}
                  >
                    Your Technical Interview Prep Platform
                  </Typography>
                }
                subtitle={
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    mt={3}
                  >
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="500"
                    >
                      New to PeerPrep?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/signup"
                      fontWeight="500"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                      }}
                    >
                      Create an account
                    </Typography>
                  </Stack>
                }
                onUsernameChange={(username) => setUsername(username)}
                onPasswordChange={(password) => setPassword(password)}
                onSubmit={handleLogin}
                username={username}
                password={password}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login;
