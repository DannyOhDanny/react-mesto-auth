import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../utils/auth';

function Login({ onLogin }) {
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
    auth
      .login(formValue.email, formValue.password)
      .then(data => {
        localStorage.setItem('jwt', data.token);
        onLogin();
        navigate('/', { replace: true });
      })
      .catch(err => {
        setErrorMessage((err = 'Неверый логин или пароль пользователя'));
      });
  };

  return (
    <div className="auth">
      <h2 className="auth__header">Вход</h2>
      <form onSubmit={handleSubmit} className="auth__form" id="log-form">
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
            Войти
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
