import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../utils/auth';

// Правила валидации импутов
const validators = {
  email: {
    required: value => {
      return value === '';
    },
    isEmail: value => {
      return !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    }
  },
  password: {
    required: value => {
      return value === '';
    },
    minLength: value => {
      return value.length < 3;
    },
    containNumbers: value => {
      return !/[0-9]/.test(value);
    }
  }
};

function Login({ onLogin }) {
  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  //Стейт ошибок сервера
  const [errorMessage, setErrorMessage] = useState('');

  //Отслеживание ошибок валидации
  const [errors, setErrors] = useState({
    email: {
      required: true,
      isEmail: true
    },
    password: {
      required: true,
      minLength: true,
      containNumbers: true
    }
  });

  //Валидация импутов
  useEffect(
    function validateInputs() {
      const { email, password } = formValue;
      // Прогоняем значение импута по ключам объекта validators
      const emailValidationResult = Object.keys(validators.email)
        .map(errorKey => {
          const errorResult = validators.email[errorKey](email);
          return { [errorKey]: errorResult };
        })
        //собираем новые значения в новый объект
        .reduce((acc, element) => ({ ...acc, ...element }), {});
      const passwordValidationResult = Object.keys(validators.password)
        .map(errorKey => {
          const errorResult = validators.password[errorKey](password);
          return { [errorKey]: errorResult };
        })
        .reduce((acc, element) => ({ ...acc, ...element }), {});
      //Соединяем { } cо значениями ошибок и объект с валидацией импутов
      setErrors({ email: emailValidationResult, password: passwordValidationResult });
      //console.log(emailValidationResult, passwordValidationResult);
    },
    //зависимости
    [formValue, setErrors]
  );

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
        onLogin(true);
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
        {errors.email.required && <p className="auth__error">Обязательное поле</p>}
        {errors.email.isEmail && <p className="auth__error">Укажите электронный адрес</p>}
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
        {errors.password.required && <p className="auth__error">Обязательное поле</p>}

        {errors.password.minLength && (
          <p className="auth__error">Минимальная длина пароля: 3 символа</p>
        )}

        {errors.password.containNumbers && (
          <p className="auth__error">Пароль должен состоять из цифр</p>
        )}
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
