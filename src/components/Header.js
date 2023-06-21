import React from 'react';
import logo from '../images/logo-pic.svg';
import NavBar from './NavBar';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Header(props) {
  const user = React.useContext(CurrentUserContext);

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Лого" />
      <div className="header__email">{user.isLoggedIn && user.isEmail.email}</div>
      {<NavBar setIsEmail={props.setIsEmail} setIsLoggedIn={props.setIsLoggedIn}></NavBar>}
    </header>
  );
}
export default Header;
