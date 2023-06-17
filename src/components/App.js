import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import api from '../utils/api.js';
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

  //Стейты пользователя
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Получаем  данные пользователя с ервера
  useEffect(() => {
    api
      .getUserInfo()
      .then(data => {
        console.log(data);
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
  }, []);

  //Получаем карточки с сервера
  useEffect(() => {
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
  }, []);

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
        //setCards(newCards);
        setCards(cards => cards.filter(c => c._id !== card._id));
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="page">
          <Header isLoggedIn={isLoggedIn} />
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

            <Route path="/sign-up" element={<Register onRegister={<></>} />} />

            <Route path="/sign-in" element={<Login onLogin={() => setIsLoggedIn(true)} />} />

            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/sign-in" replace />
              }
            />
          </Routes>
          <Footer />

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

          <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups}></InfoTooltip>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
