import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, FormGroup } from 'react-bootstrap';
import { hideModal } from '../../store/modal-slice';

const ConfirmationModal = (props) => {
  const { title, btnOk, handleSubmit } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef();

  const onSubmitForm = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Modal show>
      <Modal.Header>
        <Modal.Title>{ t(`${title}`) }</Modal.Title>
        <button type="button" className="btn" onClick={() => dispatch(hideModal())}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
            />
            <path
              fillRule="evenodd"
              d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
            />
          </svg>
        </button>
      </Modal.Header>
      <Modal.Body>
        <p>{ t('modals.delete description') }</p>
        <form onSubmit={onSubmitForm}>
          <FormGroup className="d-flex justify-content-end">
            <button type="submit" ref={inputRef} className="btn btn-danger ms-2 order-1">{t(btnOk)}</button>
            <button type="button" className="btn btn-primary ms-2" onClick={() => dispatch(hideModal())}>{t('modals.cancel')}</button>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;
