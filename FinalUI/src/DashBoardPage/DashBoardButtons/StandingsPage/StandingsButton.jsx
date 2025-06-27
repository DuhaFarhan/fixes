import React, { useEffect, useState } from "react";
import "../../TournamentDashboard.css";
import "./StandingsButton.css";
import { FaSearch } from "react-icons/fa";

function StandingsButton({ players, rounds }) {
  const [rankingData, setRankingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    const playerScores = {};
    players.forEach((p) => {
      playerScores[p.name] = {
        name: p.name,
        points: 0,
        rating: p.rating,
        newRating: p.rating,
        pos: 0,
        de: "",
        buc1: "",
        bucT: ""
      };
    });

    rounds.forEach((round) => {
      round.matches.forEach((match) => {
        if (match.result === "Bye") {
          playerScores[match.white].points += 0.5;
        } else {
          playerScores[match.white].points += match.whitePts;
          playerScores[match.black].points += match.blackPts;
        }
      });
    });

    const sorted = Object.values(playerScores).sort((a, b) => b.points - a.points);
    sorted.forEach((p, index) => (p.pos = index + 1));
    setRankingData(sorted);
  }, [players, rounds]);

  const filteredData = rankingData.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = () => {
    if (rankingData.length === 0) return;
    let csv = "الترتيب,الاسم,النقاط,التصنيف,التصنيف الجديد,DE,Buc1,BucT\n";
    rankingData.forEach((row) => {
      csv += `${row.pos},${row.name},${row.points.toFixed(1)},${row.rating},${row.newRating},${row.de},${row.buc1},${row.bucT}\n`;
    });
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = "standings.csv";
    link.click();
  };

  return (
    <div className="standings-page">
      <div className="standings-title">الترتيب</div>
      <div className="standings-search-wrapper">
        <input
          type="text"
          className="standings-search-input"
          placeholder="ابحث عن لاعب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="standings-search-icon" />
      </div>

      <div className="standings-table-wrapper">
        <table className="table-theme">
          <thead>
            <tr>
              <th>الترتيب</th>
              <th>الاسم</th>
              <th>النقاط</th>
              <th>التصنيف</th>
              <th>التصنيف الجديد</th>
              <th>DE</th>
              <th>Buc1</th>
              <th>BucT</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results-message">
                  لا توجد نتائج مطابقة
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.pos}</td>
                  <td>{row.name}</td>
                  <td>{row.points.toFixed(1)}</td>
                  <td>{row.rating}</td>
                  <td>{row.newRating}</td>
                  <td>{row.de}</td>
                  <td>{row.buc1}</td>
                  <td>{row.bucT}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="ranking-actions">
        <button className="csv-btn" onClick={handleDownloadCSV}>💾 حفظ كـ CSV</button>
        <button className="fullscreen-btn" onClick={() => setShowZoom(true)}>🔍</button>
      </div>

      {showZoom && (
        <div className="modal-overlay" onClick={() => setShowZoom(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="zoom-title">الترتيب الكامل</h2>
            <table className="table-theme">
              <thead>
                <tr>
                  <th>الترتيب</th>
                  <th>الاسم</th>
                  <th>النقاط</th>
                  <th>التصنيف</th>
                  <th>التصنيف الجديد</th>
                  <th>DE</th>
                  <th>Buc1</th>
                  <th>BucT</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.pos}</td>
                    <td>{row.name}</td>
                    <td>{row.points.toFixed(1)}</td>
                    <td>{row.rating}</td>
                    <td>{row.newRating}</td>
                    <td>{row.de}</td>
                    <td>{row.buc1}</td>
                    <td>{row.bucT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="centered-close-btn">
              <button className="close-btn" onClick={() => setShowZoom(false)}>✖ إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StandingsButton;
