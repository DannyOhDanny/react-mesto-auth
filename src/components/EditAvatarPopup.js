import React from 'react';
import { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
  const avatarRef = useRef('');

  function handleSubmit(e) {
    e.preventDefault();
    /* Значение инпута, полученное с помощью рефа */
    props.onUpdateAvatar({
      avatar: avatarRef.current.value
    });
  }
  //const onClear = () => {
  // avatarRef.current.value = '';
  //};

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Обновить аватар"
      id={'avatar-popup'}
      btnName={'Сохранить'}
      onSubmit={handleSubmit}
      isLoading={props.isLoading}
    >
      <input
        ref={avatarRef}
        name="avatarlink"
        placeholder="Ссылка на аватар"
        type="url"
        className="popup__input popup__input_type_url"
        required
        id="avatar-input"
        pattern="^(http(s)?:\/\/)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$"
      />
      <span className="popup__error avatar-input-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
