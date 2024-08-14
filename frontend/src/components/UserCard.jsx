import React from "react";
import styles from "./UserCard.module.css";

const UserCard = ({ user, onEditClick, onDeleteClick }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardContent}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <h2 className={styles.userName}>{user.full_name}</h2>
        </div>
        <div className={styles.userDetail}>
          <span className={styles.icon}>📧</span> {user.email}
        </div>
        <div className={styles.userDetail}>
          <span className={styles.icon}>📞</span> {user.phone}
        </div>
        <div className={styles.userDetail}>
          <span className={styles.icon}>
            {user.role === "user" ? "👤" : "🛡️"}
          </span>
          {user.role}
        </div>
      </div>
      <div className={styles.cardActions}>
        <button
          className={`${styles.iconButton} ${styles.editButton}`}
          onClick={() => onEditClick(user)}
          aria-label="edit"
        >
          ✏️
        </button>
        <button
          className={`${styles.iconButton} ${styles.deleteButton}`}
          onClick={() => onDeleteClick(user._id)}
          aria-label="delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default UserCard;