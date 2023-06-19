export const BASE_URL = 'https://auth.nomoreparties.co';

// function handleServerResponse(res) {
//   res.ok
//     ? res.json()
//     : Promise.reject(`Ошибка ответа сервера! Код ошибки:${res.status} - ${res.statusText}`);
// }

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(res =>
    res.ok
      ? res.json()
      : Promise.reject(
          `Ошибка ответа сервера при регистрации! Код ошибки:${res.status} - ${res.statusText}`
        )
  );
};

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(res =>
    res.ok
      ? res.json()
      : Promise.reject(
          `Ошибка ответа сервера при логине! Код ошибки:${res.status} - ${res.statusText}`
        )
  );
};

export const getContent = token => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(res =>
    res.ok ? res.json() : Promise.reject(`Ошибка токена ${res.status} - ${res.statusText}`)
  );
};
