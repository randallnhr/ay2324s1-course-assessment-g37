import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ChangeDisplayName.module.css";
import { User } from "./types";

// Similarly, should only allow change of display name if passes authentication
const ChangeDisplayName: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/auth/current-user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching current user", error);
      });
  }, []);

  const handleChangeDisplayName = async () => {
    if (!displayName) {
      alert("New display name cannot be empty");
      return;
    }

    try {
      const updatedUser = {
        ...user,
        displayName,
      };

      const response = await axios.put(
        `/api/users/${updatedUser.username}`,
        updatedUser
      );
      if (response.status === 200) {
        alert("Display name changed successfully");

        setDisplayName("");

        navigate("/profile");
      }
    } catch (error: unknown) {
      // display name can just allow update
      alert("Changing of display name failed");
      console.error("An unknown error occurred:", error);
    }
  };

  const handleCancel = () => {
    setDisplayName("");
    navigate("/profile");
  };

  return (
    <div className={styles.change_display_name_container}>
      <h1>Change Display Name</h1>

      <div className={styles.input_field}>
        <label className={styles.the_label} htmlFor="displayName">
          New Display Name
        </label>
        <input
          className={styles.input_text}
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <button
        className={styles.action_button}
        onClick={handleChangeDisplayName}
      >
        Save
      </button>
      <button className={styles.action_button} onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default ChangeDisplayName;
