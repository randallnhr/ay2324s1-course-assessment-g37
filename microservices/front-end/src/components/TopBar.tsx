// Use a separate component in nested routing to save repetitive codes
import React from "react";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { Outlet } from "react-router-dom"; // allow render nested routes

const TopBar: React.FC = () => {};

export default TopBar;
