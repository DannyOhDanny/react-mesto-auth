export const BASE_URL = 'https://auth.nomoreparties.co';

function handleServerResponse(res) {
  res.ok
    ? res.json()
    : Promise.reject(`Ошибка ответа сервера! Код ошибки:${res.status} - ${res.statusText}`);

  if (res.status === 400) {
    let error = new Error(res.statusText);
    error.response = res;
    throw error;
  }
}

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(res => handleServerResponse(res));
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
      : Promise.reject(`Ошибка ответа сервера! Код ошибки:${res.status} - ${res.statusText}`)
  );
};
