import React from 'react';
import logo from '../images/logo-pic.svg';
import NavBar from './NavBar';

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Лого" />

      {<NavBar setIsEmail={props.setIsEmail} setIsLoggedIn={props.setIsLoggedIn}></NavBar>}
    </header>
  );
}
export default Header;
