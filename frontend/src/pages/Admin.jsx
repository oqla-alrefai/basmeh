import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { CssBaseline, Box, AppBar, Toolbar, Typography } from "@mui/material";

const AdminPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
          <Toolbar
            sx={{
              width: "20rem",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <NavLink
              to="/admin/products"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Products
            </NavLink>
            <NavLink
              to="/admin/carts"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Carts
            </NavLink>
            <NavLink
              to="/admin/users"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Users
            </NavLink>
            <Link to="/">Home</Link>
          </Toolbar>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminPage;
