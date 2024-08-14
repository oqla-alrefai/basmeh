import React from "react";
import styles from "./EditUserDialog.module.css";

const EditUserDialog = ({ open, user, onClose, onChange, onRoleChange, onSave }) => {
  if (!open) return null;

  return (
    <div className={styles.dialog}>
      <div className={styles.dialogContent}>
        <h2 className={styles.dialogTitle}>Edit User</h2>
        <div className={styles.formField}>
          <label className={styles.label} htmlFor="full_name">Full Name</label>
          <input
            className={styles.input}
            id="full_name"
            type="text"
            name="full_name"
            value={user.full_name}
            onChange={onChange}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            className={styles.input}
            id="email"
            type="email"
            name="email"
            value={user.email}
            onChange={onChange}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.label} htmlFor="phone">Phone</label>
          <input
            className={styles.input}
            id="phone"
            type="text"
            name="phone"
            value={user.phone}
            onChange={onChange}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.label} htmlFor="role">Role</label>
          <select
            className={styles.select}
            id="role"
            name="role"
            value={user.role}
            onChange={onRoleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className={styles.dialogActions}>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
            Cancel
          </button>
          <button className={`${styles.button} ${styles.saveButton}`} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserDialog;