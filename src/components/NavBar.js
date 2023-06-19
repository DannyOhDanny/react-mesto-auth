import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

function NavBar(props) {
  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem('jwt');
    props.setIsLoggedIn(false);
    props.setIsEmail(null);
    navigate('/sign-in', { replace: true });
  }

  return (
    <Routes>
      <Route
        path="/sign-in"
        element={
          <Link to="/sign-up" className="header__link">
            Регистрация
          </Link>
        }
      />
      <Route
        path="/sign-up"
        element={
          <Link to="/sign-in" className="header__link">
            Войти
          </Link>
        }
      />
      <Route
        path="/"
        element={
          <Link to="/sign-in" className="header__link" style={{ color: 'grey' }} onClick={signOut}>
            Выйти
          </Link>
        }
      />
    </Routes>
  );
}

export default NavBar;
