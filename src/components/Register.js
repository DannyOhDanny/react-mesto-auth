import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

function Register(props) {
  const navigate = useNavigate();

  //Отслеживание ошибок от сервера
  const [errorMessage, setErrorMessage] = useState(null);
  //Стейты импутов
  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  });
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
      // Находим прогоняем значение импута по ключам объекта validators
      const emailValidationResult = Object.keys(validators.email)
        .map(errorKey => {
          const errorResult = validators.email[errorKey](email);
          return { [errorKey]: errorResult };
        })
        .reduce((acc, element) => ({ ...acc, ...element }), {});
      const passwordValidationResult = Object.keys(validators.password)
        .map(errorKey => {
          const errorResult = validators.password[errorKey](password);
          return { [errorKey]: errorResult };
        })
        //собираем новые значения в новый объект
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

    const { email, password } = formValue;

    auth
      .register(email, password)
      .then(data => {
        props.setIsSuccess(true);
        navigate('/sign-in', { replace: true });
      })
      .catch(error => {
        props.setIsSuccess(false);
        setErrorMessage((error = 'Пользователь с таким email уже зарегистрирован'));
      })
      .finally(() => props.setInfoTooltipPopupOpen(true));
  };

  return (
    <div className="auth">
      <h2 className="auth__header">Регистрация</h2>
      <form onSubmit={handleSubmit} className="auth__form" id="reg-form">
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

        {errors.password.minLength && <p className="auth__error">Количество символов меньше 3</p>}

        {errors.password.containNumbers && (
          <p className="auth__error">Пароль должен содержать цифры</p>
        )}

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
