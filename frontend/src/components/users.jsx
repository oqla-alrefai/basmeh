import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, getUser, deleteUser, updateUser } from "../features/Actios/authActions";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Avatar,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: ""
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (searchQuery) {
      dispatch(getUser(searchQuery));
    }
  }, [searchQuery, dispatch]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditedUser(user);
    setOpenEditDialog(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
  };

  const handleRoleChange = (event) => {
    setEditedUser({
      ...editedUser,
      role: event.target.value
    });
  };

  const handleUpdateUser = () => {
    dispatch(updateUser(editedUser))
      .unwrap()
      .then(() => {
        setOpenEditDialog(false);
        dispatch(getUsers());
      })
      .catch((error) => {
        console.error("Failed to update user: ", error);
      });
  };

  const filteredUsers = users ? users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const CardContainer = styled(Card)({
    height: '250px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  });

  return (
    <Paper>
      <Typography variant="h5" gutterBottom padding={2}>
        Users
      </Typography>
      <Box padding={2}>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>
      <Box padding={2}>
        <Grid container spacing={2}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
              <CardContainer>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <Avatar sx={{ marginRight: 2 }}>
                      {user.full_name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" component="div">
                      {user.full_name}
                    </Typography>
                  </Box>
                  <Typography sx={{ display: "flex", justifyContent: "start", alignItems: "center", marginBottom: 1 }} color="text.secondary">
                    <EmailIcon /> {user.email}
                  </Typography>
                  <Typography color="text.secondary" sx={{ display: "flex", justifyContent: "start", alignItems: "center", marginBottom: 1 }}>
                    <PhoneIcon /> {user.phone}
                  </Typography>
                  <Typography color="text.secondary" sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                    {user.role === "user" ? <PersonIcon /> : <VerifiedUserIcon />}{user.role}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
                  <IconButton aria-label="edit" color="success" onClick={() => handleEditClick(user)}>
                    <ModeEditOutlineIcon />
                  </IconButton>
                  <IconButton onClick={() => { dispatch(deleteUser(user._id)) }} aria-label="delete" color="error">
                    <DeleteOutlineIcon />
                  </IconButton>
                </CardActions>
              </CardContainer>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
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
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={editedUser.role}
              onChange={handleRoleChange}
              name="role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
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
    </Paper>
  );
};

export default Users;
