import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import * as auth from '../utils/auth';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteConfirmationPopup from './DeleteConfirmationPopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {
  //Стейты карточки
  const [cards, setCards] = useState([]);
  const [deletedCard, setDeletedCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Стейты попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  //Стейты пользователя
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmail, setIsEmail] = useState('');

  const navigate = useNavigate();

  //Получаем  данные пользователя с cервера
  useEffect(() => {
    if (isLoggedIn) {
      api
        .getUserInfo()
        .then(data => {
          //console.log(data);
          setCurrentUser({
            _id: data._id,
            name: data.name,
            about: data.about,
            avatar: data.avatar,
            cohort: data.cohort
          });
        })
        .catch(err => {
          console.error(
            `Возникла ошибка загрузки данных пользователя с сервера:${err} - ${err.statusText}`
          );
        });
    }
  }, [isLoggedIn]);

  //Получаем карточки с сервера
  useEffect(() => {
    if (isLoggedIn) {
      api
        .getCardsFromServer()
        .then(cardsData => {
          setCards(cardsData);
        })
        .catch(err => {
          console.error(
            `Возникла ошибка загрузки данных карточек с сервера:${err} - ${err.statusText}`
          );
        });
    }
  }, [isLoggedIn]);

  //Открытие попапов
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  //Закрытие попапов
  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setDeletePopupOpen(false);
    setImagePopupOpen(false);
    setSelectedCard({});
    setInfoTooltipPopupOpen(false);
  }

  //Открытие попапа изображения
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  //Обработка лайка карточки с запросом на сервер
  function handleCardLike(card) {
    const isLiked = card.likes.some(item => item._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    (!isLiked ? api.putUserLike(card._id) : api.deleteUserLike(card._id))
      .then(newCard => {
        setCards(state => state.map(c => (c._id === card._id ? newCard : c)));
      })
      .catch(err => {
        console.error(`Возникла ошибка при постановке лайка:${err} - ${err.statusText}`);
      });
  }

  //Обработка удаления карточки с запросом на сервер
  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteUserCard(card._id)
      .then(newCard => {
        //удаляем из старого массива карточку и сохраняем новый массив
        const newCards = cards.filter(c => (c._id === card._id ? null : newCard));
        //отрисовываем новый массив
        setCards(cards => cards.filter(c => c._id !== card._id));
        closeAllPopups();
      })
      .catch(err => {
        console.error(`Возникла ошибка удаления карточки:${err} - ${err.statusText}`);
      })
      .finally(() => setIsLoading(false));
  }

  //Обработка изменения информации о пользователе с запросом на сервер
  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api
      .setUserInfo({ name, about })
      .then(newData => {
        setCurrentUser(newData);
        closeAllPopups();
      })
      .catch(err => {
        console.error(`Возникла ошибка редактирования профиля:${err} - ${err.statusText}`);
      })
      .finally(() => setIsLoading(false));
  }

  //Обработка изменения аватара с запросом на сервер
  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api
      .setUserAvatar({ avatar })
      .then(newUrl => {
        setCurrentUser(newUrl);
        closeAllPopups();
      })
      .catch(err => {
        console.error(`Возникла ошибка редактирования аватара:${err} - ${err.statusText}`);
      })
      .finally(() => setIsLoading(false));
  }

  //Обработка добавления карточки с запросом на сервер
  function handleAddPlaceSubmit({ name, link }) {
    setIsLoading(true);
    api
      .setNewCard({ name, link })
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => {
        console.error(`Возникла ошибка добавления карточки:${err} - ${err.statusText}`);
      })
      .finally(() => setIsLoading(false));
  }

  //Обработка клика удаления карточки с передачей card
  function handleTrashBtnClick(card) {
    setDeletePopupOpen(true);
    setDeletedCard(card);
  }

  //Проверка токена jwt
  const checkToken = () => {
    const jwt = localStorage.getItem('jwt');
    auth
      .getContent(jwt)
      .then(res => {
        if (res) {
          setIsLoggedIn(true);
          setIsEmail(res.data);
          navigate('/', { replace: true });
        }
        if (!res) {
          return;
        }
      })
      .catch(err => {
        setIsLoggedIn(false);
        console.log((err = 'Переданный токен некорректен'));
      });
  };

  //Отрисовка токена jwt 1 раз
  useEffect(() => {
    checkToken();
  }, []);

  //Ф-ия регистрации пользователя
  function handleRegister(formValue, setErrorMessage) {
    if (!formValue.email || !formValue.password) {
      setErrorMessage('Заполните все поля формы');
      return;
    }

    const { email, password } = formValue;

    auth
      .register(email, password)
      .then(data => {
        setIsSuccess(true);
        setInfoTooltipPopupOpen(true);
        navigate('/sign-in', { replace: true });
      })
      .catch(error => {
        setIsSuccess(false);
        setInfoTooltipPopupOpen(true);
        setErrorMessage((error = 'Пользователь с таким email уже зарегистрирован'));
      });
  }

  //Ф-ия авторизации пользователя
  function onLoggedIn(formValue, onLogin, setErrorMessage) {
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
  }

  return (
    <CurrentUserContext.Provider
      value={{ currentUser: currentUser, isLoggedIn: isLoggedIn, isEmail: isEmail }}
    >
      <div className="root">
        <div className="page">
          <Header
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            // isEmail={isEmail}
            setIsEmail={setIsEmail}
          />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute
                  element={Main}
                  cards={cards}
                  isLoggedIn={isLoggedIn}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onTrashBtnClick={handleTrashBtnClick}
                />
              }
            />

            <Route
              path="/sign-up"
              element={
                <Register
                  isOpen={isInfoTooltipPopupOpen}
                  isSuccess={isSuccess}
                  setInfoTooltipPopupOpen={setInfoTooltipPopupOpen}
                  setIsSuccess={setIsSuccess}
                  onRegister={handleRegister}
                />
              }
            />

            <Route
              path="/sign-in"
              element={<Login onLogin={setIsLoggedIn} onLoggedIn={onLoggedIn} />}
            />

            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/sign-in" replace />
              }
            />
            <Route path="/*" element={<Navigate to="/sign-in" replace />} />
          </Routes>

          {isLoggedIn && <Footer />}

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          ></EditProfilePopup>

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          ></AddPlacePopup>

          <DeleteConfirmationPopup
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            onDeleteCard={handleCardDelete}
            card={deletedCard}
            isLoading={isLoading}
          ></DeleteConfirmationPopup>

          <ImagePopup isOpen={isImagePopupOpen} onClose={closeAllPopups} card={selectedCard} />

          <InfoTooltip
            isSuccess={isSuccess}
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
            onSuccess={`Вы успешно авторизировались!`}
            onError={`Что-то пошло не так! Попробуйте еще раз`}
          ></InfoTooltip>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
