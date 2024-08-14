import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, getUser, deleteUser, updateUser } from "../features/Actios/authActions";
import UserCard from "./UserCard";
import EditUserDialog from "./EditUserDialog";
import styles from "./Users.module.css"; // Create this CSS module file

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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Users</h2>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search Users"
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className={styles.userGrid}>
        {filteredUsers.map((user) => (
          <div key={user._id} className={styles.userCard}>
            <UserCard 
              user={user}
              onEditClick={handleEditClick}
              onDeleteClick={(id) => dispatch(deleteUser(id))}
            />
          </div>
        ))}
      </div>
      {selectedUser && (
        <EditUserDialog
          open={openEditDialog}
          user={editedUser}
          onClose={() => setOpenEditDialog(false)}
          onChange={handleEditChange}
          onRoleChange={handleRoleChange}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default Users;