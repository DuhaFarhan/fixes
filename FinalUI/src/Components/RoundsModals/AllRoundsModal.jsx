import React from "react";
import "./ModalStyle.css";

function AllRoundsModal({ isOpen, onClose, rounds }) {
  if (!isOpen || !rounds) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-x" onClick={onClose}>×</button>
        <h2>كل الجولات</h2>
        {rounds.map((round) => (
          <div key={round.number}>
            <h3>الجولة {round.number}</h3>
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
                  {round.matches.map((match, i) => (
                    <tr key={match.id}>
                      <td>{i + 1}</td>
                      <td>{match.white}</td>
                      <td>{match.black}</td>
                      <td>{match.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllRoundsModal;
