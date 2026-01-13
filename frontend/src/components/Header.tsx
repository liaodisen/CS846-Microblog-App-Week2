import React from 'react';
import styles from './Header.module.css';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          Chirp
        </div>
        <nav className={styles.nav}>
          {user ? (
            <>
              <span className={styles.username}>{user.displayName}</span>
              <button onClick={() => navigate(`/profile/${user.username}`)}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
