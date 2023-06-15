import React from 'react';

import PopupWithForm from './PopupWithForm';

function DeleteConfirmationPopup(props) {
  function handleSubmit(e) {
    e.preventDefault();
    props.onDeleteCard(props.card);
    props.onClose();
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Вы уверены?"
      id={'delete-popup'}
      btnName={props.isLoading ? 'Удаление...' : 'Да'}
      onSubmit={handleSubmit}
    ></PopupWithForm>
  );
}

export default DeleteConfirmationPopup;
