import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import styles from "./AdminPage.module.css";

const AdminPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <nav className={styles.nav}>
            <NavLink
              to="/admin/products"
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            >
              Products
            </NavLink>
            <NavLink
              to="/admin/carts"
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            >
              Carts
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            >
              Users
            </NavLink>
            <Link to="/" className={styles.link}>Home</Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;