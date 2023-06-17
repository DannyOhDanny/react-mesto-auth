import React from 'react';
import iconClose from '../images/popup__button-close.svg';
import errorAuth from '../images/element_error-auth.svg';
import correctAuth from '../images/element_correct_auth.svg';

function InfoTooltip(props) {
  function handleClickOnOverlay(e) {
    props.onClose();
  }

  return (
    <div
      className={`popup ${props.isOpen ? 'popup_opened' : ''}`}
      id={props.id}
      onClick={e => {
        handleClickOnOverlay(e);
      }}
    >
      <div className="popup__container" onClick={event => event.stopPropagation()}>
        <button
          style={{ backgroundImage: `url(${iconClose})` }}
          onClick={props.onClose}
          className="popup__button-close"
          type="button"
          aria-label="Close"
        ></button>
        <div className="auth-popup">
          <img className="auth-popup__image" src={errorAuth} alt="предупреждение" />
          <p className="auth-popup__caption">Что-то пошло не так! Попробуйте ещё раз.</p>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;
