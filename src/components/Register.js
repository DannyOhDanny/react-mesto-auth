import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="auth">
      <h2 className="auth__header">Регистрация</h2>
      <form /*onSubmit={handleSubmit}*/ className="auth__form">
        <input
          className="auth__input"
          required
          id="email"
          name="email"
          type="text"
          //value={formValue.username}
          //onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="auth__input"
          required
          id="reg-password"
          name="reg-password"
          type="reg-password"
          //value={formValue.password}
          //onChange={handleChange}
          placeholder="Пароль"
        />
        <div className="auth__button-container">
          <button type="submit" className="auth__button">
            Зарегистрироваться
          </button>
        </div>
      </form>
      <div className="auth__redirect">
        <p>Уже зарегистрированы?</p>
        <Link to="/sign-in" className="auth__link">
          Войти
        </Link>
      </div>
    </div>
  );
}

export default Register;
