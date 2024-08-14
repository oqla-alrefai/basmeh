import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css"; // Make sure to create this CSS module file

const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>
          ⚠️
        </div>
        <h1 className={styles.title}>
          404 Not Found
        </h1>
        <p className={styles.message}>
          The page you are looking for does not exist.
        </p>
        <button
          className={styles.button}
          onClick={handleHomeClick}
        >
          🏠 Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;