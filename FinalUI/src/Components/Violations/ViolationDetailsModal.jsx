// src/Components/Violations/ViolationDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import './ViolationDetailsModal.css';

const violationChoices = [
  'لا يوجد',
  'عدم الالتزام بالزي',
  'تأخر عن الجولة',
  'سلوك غير لائق',
  'أخرى'
];

function ViolationDetailsModal({ isOpen, onClose, violationData, onSave, onDelete }) {
  const [choice, setChoice] = useState('لا يوجد');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (violationData) {
      setChoice(violationData.choice || 'لا يوجد');
      setNote(violationData.note || '');
    }
  }, [violationData]);

  if (!isOpen || !violationData) return null;

  return (
    <div className="violation-modal-backdrop">
      <div className="violation-modal-box">
        <h3 className="violation-title">تفاصيل المخالفة</h3>

        <label className="violation-label">اختر المخالفة:</label>
        <select
          className="violation-select"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
        >
          {violationChoices.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>

        <label className="violation-label">ملاحظة:</label>
        <input
          className="violation-note-input"
          placeholder="أضف ملاحظة (اختياري)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="violation-buttons">
          <button className="btn violet" onClick={() => onSave({ choice, note })}> حفظ</button>
          <button className="btn violet" onClick={onDelete}> حذف</button>
          <button className="btn violet" onClick={onClose}> إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export default ViolationDetailsModal;
