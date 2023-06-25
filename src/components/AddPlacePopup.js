import React from 'react';
import { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  //Стейты импутов
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  //Обработка изменения импута от event
  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }
  //Обработка сабмита формы
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onAddPlace({
      name,
      link
    });
  }
  //Очистка полей формы после открытия попапа
  useEffect(() => {
    setName('');
    setLink('');
  }, [props.isOpen]);

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Новое место"
      id={'add-popup'}
      btnName={'Создать'}
      onSubmit={handleSubmit}
      isLoading={props.isLoading}
    >
      <input
        name="picname"
        placeholder="Название"
        type="text"
        className="popup__input popup__input_type_heading"
        required
        minLength="2"
        maxLength="30"
        id="place-input"
        pattern="^[а-яА-ЯёЁa-zA-Z0-9-;._\s]+$"
        onChange={handleNameChange}
        value={name}
      />
      <span className="popup__error place-input-error"></span>
      <input
        name="url"
        placeholder="Ссылка на картинку"
        type="url"
        className="popup__input popup__input_type_url"
        required
        id="url-input"
        pattern="^(http(s)?:\/\/)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$"
        onChange={handleLinkChange}
        value={link}
      />
      <span className="popup__error url-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
