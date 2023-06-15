import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo-pic.svg';

function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Лого" />
      <Link className="header__link" to="/sign-in">
        Войти
      </Link>
    </header>
  );
}
export default Header;
