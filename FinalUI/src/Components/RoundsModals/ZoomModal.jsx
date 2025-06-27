import React from "react";
import "./ModalStyle.css";

function ZoomModal({ isOpen, onClose, round }) {
  if (!isOpen || !round) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>تفاصيل الجولة {round.number}</h2>
        <div className="table-wrapper">
          <table className="table-theme">
            <thead>
              <tr>
                <th>#</th>
                <th>الأبيض</th>
                <th>الأسود</th>
                <th>النتيجة</th>
              </tr>
            </thead>
            <tbody>
              {round.matches.map((match, index) => (
                <tr key={match.id}>
                  <td>{index + 1}</td>
                  <td>{match.white}</td>
                  <td>{match.black}</td>
                  <td>{match.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="close-btn" onClick={onClose}>إغلاق</button>
      </div>
    </div>
  );
}

export default ZoomModal;
