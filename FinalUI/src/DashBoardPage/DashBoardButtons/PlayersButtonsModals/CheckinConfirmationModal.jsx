import React from 'react';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper';

function CheckinConfirmationModal({ isOpen, onClose, onConfirm, isActive }) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={isActive ? "إيقاف التأكيد" : "بدء التأكيد"}>
      <p>
        {isActive
          ? 'هل أنت متأكد أنك تريد إيقاف وضع التأكيد؟'
          : 'هل أنت متأكد أنك تريد بدء وضع التأكيد؟'}
      </p>
      <div className="modal-actions">
        <button onClick={onConfirm} className="btn btn-gold">تأكيد</button>
        <button onClick={onClose} className="btn btn-outline">إلغاء</button>
      </div>
    </ModalWrapper>
  );
}
export default CheckinConfirmationModal;