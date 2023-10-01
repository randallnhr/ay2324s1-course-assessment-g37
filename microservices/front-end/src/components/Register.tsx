import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Card, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";

import PageContainer from "./container/PageContainer";
// import Logo from '../layouts/full/shared/logo/Logo';
import AuthRegister from "./auth/AuthRegister";
import { useUserContext } from "../UserContext";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<"basic" | "admin">("basic");
  const { currentUser, setCurrentUser } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      currentUser &&
      Object.keys(currentUser).length != 0 &&
      currentUser.username
    ) {
      navigate("/question-bank");
    }
  }, [currentUser, navigate]);

  const handleSignup = async () => {
    const alphanumeric = /^[a-z0-9]+$/i; // only allow alphanumeric for username, displayName

    if (!username || !displayName || !password) {
      alert("Required fields not filled up");
      return;
    }

    if (!alphanumeric.test(username) || !alphanumeric.test(displayName)) {
      alert("Username and Display Name must be alphanumeric.");
      return;
    }

    if (password != confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      // console.log(username, displayName, password, role);
      const response = await axios.post("/api/auth/sign-up", {
        username,
        displayName,
        password,
        role,
      });

      if (response.status == 200) {
        navigate("/login");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          // Status code for repetitive account
          alert("Username is already being used. Please use another one.");
        } else {
          console.error("Signup failed:", error);
          alert(error.response?.data.message || "Failed to create account");
        }
      } else {
        alert("An unknown error occurred. Try again later.");
        console.error("An unknown error occurred:", error);
      }
    }
  };

  return (
    <PageContainer title="Register" description="this is Register page">
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
            xs={12}
            sm={12}
            lg={6}
            xl={5}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                {/* <Logo /> */}
              </Box>
              <AuthRegister
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
                    justifyContent="center"
                    spacing={1}
                    mt={3}
                    alignItems="center" // align them vertically
                  >
                    <Typography
                      color="textSecondary"
                      // variant="h6"
                      fontWeight="500" // for how bold the text is
                      fontSize="1.25rem" // for how large the text is
                    >
                      Already have an Account?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/login"
                      fontWeight="500"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                      }}
                    >
                      Sign In
                    </Typography>
                  </Stack>
                }
                onUsernameChange={(username) => setUsername(username)}
                onDisplayNameChange={(displayName) =>
                  setDisplayName(displayName)
                }
                onPasswordChange={(password) => setPassword(password)}
                onConfirmPasswordChange={(confirmPassword) =>
                  setConfirmPassword(confirmPassword)
                }
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

export default Register;
