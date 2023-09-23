import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { User } from "./types";
import styles from "./ProfilePage.module.css";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  // local state to hold user data
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get("/api/auth/current-user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        alert("Failed to fetch user profile");
        console.error("Error fetching current user", error);
      });
  }, []);

  //   Need to send request to backend to really sign out
  const handleSignout = () => {
    axios
      .delete("/api/auth/log-out")
      .then((response) => {
        if (response.status === 200) {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
        alert("Failed to sign out, please try again!");
      });
  };

  const handleQuestion = () => {
    navigate("/question-bank");
  };

  const handleDelete = () => {
    if (!user || !user.username) {
      console.error("User data not available");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account This cannot be undone. "
    );
    if (!isConfirmed) return;

    axios
      // Should use `` instead of ""! "" will take ${user.username} literally, while `` will parse it
      .delete(`/api/users/${user.username}`)
      .then((response) => {
        if (response.status === 200) {
          alert("Account deleted successfully");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error deleting account", error);
        if (axios.isAxiosError(error) && error.response) {
          alert(`Failed to delete account: ${error.response.data}`);
        } else {
          alert("Failed to delete account due to an unknown error");
        }
      });
  };

  return (
    <div>
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
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <div className={styles.header_container}>
        <h1>Personal Profile</h1>
      </div>

      <div className={styles.profile_container}>
        <div className={styles.profile_detail}>
          <span className={styles.label_name}>Username: </span>
          <span className={styles.user_info}> {user?.username} </span>
        </div>
        <div className={styles.profile_detail}>
          <span className={styles.label_name}>Display Name: </span>
          <span className={styles.user_info}>{user?.displayName}</span>
        </div>
        <div className={styles.profile_detail}>
          <span className={styles.label_name}>Role: </span>
          <span className={styles.user_info}>{user?.role}</span>
        </div>

        <button
          className={styles.action_button}
          onClick={() => navigate("/change-password")}
        >
          Change Password
        </button>
        <button
          className={styles.action_button}
          onClick={() => navigate("/change-display-name")}
        >
          Change Display Name
        </button>
        <button className={styles.action_button} onClick={handleDelete}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
