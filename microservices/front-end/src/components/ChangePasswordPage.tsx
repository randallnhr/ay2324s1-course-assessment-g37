import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ChangePasswordPage.module.css";
import { User } from "./types";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// Should only allow change of password if old password matches!
const ChangePasswordPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      axios
        .get("/api/auth/current-user")
        .then((response) => {
          console.log(response.data);
          const userData: User = response.data;
          setUser(userData);
        })
        .catch((error) => {
          console.error("Error fetching current user", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setIsFetching(false);
    }
  }, [user]);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
      alert("Please fill in credentials, and ensure new passwords match.");
      return;
    }

    try {
      const response = await axios.put(`/api/users/${user?.username}`, {
        oldPassword,
        newPassword,
      });
      if (response.status === 200) {
        alert("Password changed successfully");

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // no update of localStorage, do not store password locally

        navigate("/profile");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Change password failed:", error);
        alert("User credential is incorrect");
      } else {
        alert("Changing password failed. Try again later.");
        console.error("An unknown error occurred:", error);
      }
    }
  };

  const handleQuestion = () => {
    setNewPassword("");
    setConfirmPassword("");
    navigate("/question-bank");
  };

  const handleSignout = () => {
    axios
      .delete("/api/auth/log-out")
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("user");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
        alert("Failed to sign out, please try again!");
      });
  };

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    navigate("/profile");
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              HOME
            </Typography>
            <Button color="inherit" onClick={handleQuestion}>
              Question
            </Button>
            <Button color="inherit" onClick={handleSignout}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <div className={styles.login_container}>
        <h1>Change Password</h1>

        <div className={styles.input_field}>
          <label className={styles.the_label} htmlFor="oldPassword">
            Old Password
          </label>
          <input
            className={styles.input_text}
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className={styles.input_field}>
          <label className={styles.the_label} htmlFor="newPassword">
            New Password
          </label>
          <input
            className={styles.input_text}
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className={styles.input_field}>
          <label className={styles.the_label} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className={styles.input_text}
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className={styles.action_button} onClick={handleChangePassword}>
          Save
        </button>
        <button className={styles.action_button} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
