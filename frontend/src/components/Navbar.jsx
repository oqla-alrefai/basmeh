// src/components/Navbar.js
import React from 'react';
import styles from './Navbar.module.css';

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className={styles.navbar}>
      <button className={styles.button} onClick={toggleSidebar}>☰</button>
      <h1 className={styles.heading}>My App</h1>
    </div>
  );
};

export default Navbar;