import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo-pic.svg';

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Лого" />
      {props.isLoggedIn ? (
        <Link className="header__link" to="/">
          Войти
        </Link>
      ) : (
        <Link className="header__link" to="/sign-up">
          Регистрация
        </Link>
      )}
    </header>
  );
}
export default Header;
