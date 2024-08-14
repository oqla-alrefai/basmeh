import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../features/slices/userSlice";
import { updateUser } from "../features/Actios/authActions";
import styles from "./Profile.module.css";

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
    userId: user.userId,
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
        dispatch(logoutUser());
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to update user: ", error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.avatarContainer}>
          <img
            className={styles.avatar}
            src="https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png"
            alt={user.full_name}
          />
        </div>
        <div className={styles.cardContent}>
          <h2 className={styles.userName}>{user.full_name}</h2>
          <p className={styles.userRole}>{user.role}</p>
          <hr className={styles.divider} />
          <p className={styles.userInfo}>
            <strong>Email:</strong> {user.email}
          </p>
          <p className={styles.userInfo}>
            <strong>Phone:</strong> {user.phone}
          </p>
          <div className={styles.buttonContainer}>
            <button className={styles.editButton} onClick={handleEditClick}>
              Edit Profile
            </button>
            <button className={styles.logoutButton} onClick={logoutHandler}>
              Log Out
            </button>
            <Link to="/" className={styles.homeButton}>
              Home
            </Link>
          </div>
        </div>
      </div>

      {openEditDialog && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Profile</h2>
            <input
              type="text"
              name="full_name"
              value={editedUser.full_name}
              onChange={handleEditChange}
              placeholder="Full Name"
            />
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleEditChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={editedUser.phone}
              onChange={handleEditChange}
              placeholder="Phone"
            />
            <div className={styles.modalActions}>
              <button onClick={() => setOpenEditDialog(false)}>Cancel</button>
              <button onClick={handleUpdateUser}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;