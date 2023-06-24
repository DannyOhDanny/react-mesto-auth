import React from 'react';
import { useState } from 'react';
import burgerIcon from '../images/Group 5.png';
import btnClose from '../images/popup__button-close.svg';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function NavBar(props) {
  const user = React.useContext(CurrentUserContext);

  const [nav, setNav] = useState(false);

  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem('jwt');
    props.setIsLoggedIn(false);
    props.setIsEmail('');
    navigate('/sign-in', { replace: true });
  }

  return (
    <>
      <img
        onClick={() => setNav(!nav)}
        className="mobile_btn"
        src={nav ? btnClose : burgerIcon}
        alt="burger-icon"
      ></img>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <Link
              to="/sign-up"
              className={nav ? ['header__link', 'header__link_active'].join(' ') : ['header__link']}
            >
              Регистрация
            </Link>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Link
              to="/sign-in"
              className={nav ? ['header__link', 'header__link_active'].join(' ') : ['header__link']}
            >
              Войти
            </Link>
          }
        />
        <Route
          path="/"
          element={
            <>
              <div
                className={
                  user.isLoggedIn && nav
                    ? ['header__email', 'header__email_active'].join(' ')
                    : ['header__email']
                }
              >
                {user.isLoggedIn && user.isEmail.email}
              </div>
              <Link
                to="/sign-in"
                className={
                  user.isLoggedIn && nav
                    ? ['header__link', 'header__link_active'].join(' ')
                    : ['header__link']
                }
                style={{ color: 'grey' }}
                onClick={signOut}
              >
                Выйти
              </Link>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default NavBar;
