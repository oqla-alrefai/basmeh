import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../features/slices/userSlice";
import { updateUser } from "../features/Actios/authActions";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFD700",
    },
    secondary: {
      main: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
  },
});

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser());
    navigate("/admin");
  };

  let user = localStorage.getItem("userToken");
  user = jwtDecode(user);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState({
    userId:user.userId,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
  });

  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };



  const handleUpdateUser = () => {
    dispatch(updateUser(editedUser))
      .unwrap()
      .then(() => {
        setOpenEditDialog(false);
        dispatch(logoutUser())
        navigate("/")
      })
      .catch((error) => {
        console.error("Failed to update user: ", error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 400, margin: "auto", mt: 5, p: 2, boxShadow: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            sx={{ width: 100, height: 100 }}
            src="https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png"
            alt={user.full_name}
          />
        </Box>
        <CardContent>
          <Typography variant="h5" component="div" align="center" gutterBottom>
            {user.full_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            {user.role}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" component="div" align="center">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1" component="div" align="center">
            <strong>Phone:</strong> {user.phone}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              onClick={handleEditClick}
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
            >
              Edit Profile
            </Button>
            <Button
              onClick={logoutHandler}
              variant="outlined"
              color="secondary"
              sx={{ mr: 1 }}
            >
              Log Out
            </Button>
            <Button component={Link} to="/" variant="contained" color="primary">
              Home
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            name="full_name"
            value={editedUser.full_name}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={editedUser.email}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            name="phone"
            value={editedUser.phone}
            onChange={handleEditChange}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Profile;
