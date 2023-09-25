import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "./types";
import styles from "./ProfilePage.module.css";
import { UserProvider, useUserContext } from "../UserContext";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUserContext();

  // check if currentUser is authenticated, if not, direct back to login
  useEffect(() => {
    if (Object.keys(currentUser).length != 0 && !currentUser.username) {
      navigate("/login");
    }
  });

  // on windows reload, need to re-fetch user credential
  useEffect(() => {
    if (Object.keys(currentUser).length === 0) {
      // initially currentUser = {}
      axios
        .get("/api/auth/current-user")
        .then((response) => {
          console.log(response.data);
          const userData: User = response.data;
          setCurrentUser(userData);
          console.log(currentUser.username);
        })
        .catch((error) => {
          console.error("Error fetching current user", error);
        });
    }
  }, [currentUser, setCurrentUser]);

  const handleDelete = () => {
    if (
      !currentUser ||
      Object.keys(currentUser).length === 0 ||
      !currentUser.username
    ) {
      console.error("User data not available");
      return;
    }
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account This cannot be undone. "
    );
    if (!isConfirmed) return;

    axios
      // Should use `` instead of ""! "" will take ${user.username} literally, while `` will parse it
      .delete(`/api/users/${currentUser.username}`)
      .then((response) => {
        if (response.status === 200) {
          alert("Account deleted successfully");
          // reset UserContext
          setCurrentUser({} as User);
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
      <div className={styles.header_container}>
        <h1>Personal Profile</h1>
      </div>
      <div className={styles.profile_container}>
        <div className={styles.profile_detail}>
          <span className={styles.label_name}>Username: </span>
          <span className={styles.user_info}> {currentUser?.username} </span>
        </div>
        <div className={styles.profile_detail}>
          <span className={styles.label_name}>Display Name: </span>
          <span className={styles.user_info}>{currentUser?.displayName}</span>
        </div>
        <div className={styles.profile_detail}>
          <span className={styles.label_name}>Role: </span>
          <span className={styles.user_info}>{currentUser?.role}</span>
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
