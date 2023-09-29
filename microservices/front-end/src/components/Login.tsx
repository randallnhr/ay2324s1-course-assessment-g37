import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import { User } from "./types";
// components
import PageContainer from "./container/PageContainer";
import AuthLogin from "./auth/AuthLogin";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { currentUser, setCurrentUser } = useUserContext();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      currentUser &&
      Object.keys(currentUser).length != 0 &&
      currentUser.username
    ) {
      console.log("Shortcut to question bank");
      console.log(currentUser.username);
      navigate("/question-bank");
    }
  }, [currentUser, navigate]);

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
        console.log("Received user data");
        console.log(userData.username);
        setCurrentUser(userData);
        console.log("Current user set");
        console.log(currentUser.username);
        // navigate("/question-bank");

        setSuccess("Successfully logged in!");
      }
    } catch (error: unknown) {
      setSuccess(null);

      if (axios.isAxiosError(error)) {
        setError("Incorrect user credentials!");
      } else {
        setError("An unknown error occurred. Try again later.");
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
            background: "radial-gradient(#D2F1DF, #D3D7FA, #BAD8F4)",
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
                    fontSize="1.25rem"
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
                    alignItems="center"
                  >
                    <Typography
                      color="textSecondary"
                      fontWeight="500"
                      fontSize="1.25rem"
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
                error={error}
                onErrorChange={setError}
                success={success}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default Login;
