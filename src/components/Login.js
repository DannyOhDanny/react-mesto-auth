import React from 'react';

function Login() {
  return (
    <div className="auth">
      <h2 className="auth__header">Вход</h2>
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
          id="log-password"
          name="log-password"
          type="log-password"
          //value={formValue.password}
          //onChange={handleChange}
          placeholder="Пароль"
        />
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
