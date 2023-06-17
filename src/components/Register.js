import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as auth from '../utils/auth';

function Register() {
  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formValue.email || !formValue.password) {
      setErrorMessage('Заполните все поля формы');
      return;
    }

    const { email, password } = formValue;

    auth
      .register(email, password)
      .then(data => {
        navigate('/sign-in', { replace: true });
      })
      .catch(error => {
        setErrorMessage((error.message = 'Пользователь с таким email уже зарегистрирован'));
      });
  };

  return (
    <div className="auth">
      <h2 className="auth__header">Регистрация</h2>
      <form onSubmit={handleSubmit} className="auth__form">
        <input
          className="auth__input"
          //required
          id="email"
          name="email"
          type="email"
          value={formValue.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="auth__input"
          //required
          id="password"
          name="password"
          type="password"
          value={formValue.password}
          onChange={handleChange}
          placeholder="Пароль"
        />
        <p className="auth__error">{errorMessage}</p>

        <div className="auth__button-container">
          <button type="submit" className="auth__button">
            Зарегистрироваться
          </button>
        </div>
      </form>
      <div className="auth__redirect">
        <p className="auth__note">Уже зарегистрированы?</p>
        <Link to="/sign-in" className="auth__link">
          Войти
        </Link>
      </div>
    </div>
  );
}

export default Register;
