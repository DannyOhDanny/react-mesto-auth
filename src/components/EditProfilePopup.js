import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

function EditProfilePopup(props) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name: name,
      about: description
    });
  }

  useEffect(() => {
    setName('');
    setDescription('');
  }, [currentUser, props.isOpen]);

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Редактировать профиль"
      id={'edit-popup'}
      btnName={'Сохранить'}
      onSubmit={handleSubmit}
      isLoading={props.isLoading}
    >
      <input
        name="name"
        placeholder="Имя"
        type="text"
        className="popup__input popup__input_type_name"
        value={name || ''}
        minLength="2"
        maxLength="40"
        required
        id="name-input"
        pattern="^[а-яА-ЯёЁa-zA-Z0-9-;._\s]+$"
        onChange={handleNameChange}
      />
      <span className="popup__error name-input-error"></span>
      <input
        name="position"
        placeholder="О себе"
        type="text"
        className="popup__input popup__input_type_position"
        value={description || ''}
        minLength="2"
        maxLength="200"
        required
        id="position-input"
        pattern="^[а-яА-ЯёЁa-zA-Z0-9-;._\s]+$"
        onChange={handleDescriptionChange}
      />
      <span className="popup__error position-input-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
