import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/Actios/authActions';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [full_name, setFull_name] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(state => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, full_name, phone }));
  };

  // Redirect to login page or dashboard if signup is successful
  if (success) {
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>Signup</div>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.formField}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.formField}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className={styles.formField}
          placeholder="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          className={styles.formField}
          placeholder="Full Name"
          type="text"
          value={full_name}
          onChange={(e) => setFull_name(e.target.value)}
          required
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading && <span className={styles.spinner}>Loading...</span>}
          Signup
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.linkWrapper}>
        Already have an account? <Link className={styles.link} to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
