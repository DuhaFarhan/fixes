import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import PageContainer from '../Components/ThePageContainers/PageContainer';
import Header from '../Components/TheHeaders/Header';
import './RoundsHomePage.css';

const RoundsHomePage = () => {
  const [submittedRounds, setSubmittedRounds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedRounds = JSON.parse(localStorage.getItem("submittedRounds")) || [];
    setSubmittedRounds(savedRounds);
  }, []);

  const calculatePastPoints = (roundIndex) => {
    const totals = {};
    for (let i = 0; i < roundIndex; i++) {
      submittedRounds[i]?.matches?.forEach(match => {
        if (match.white && !totals[match.white]) totals[match.white] = 0;
        if (match.black && !totals[match.black]) totals[match.black] = 0;
        totals[match.white] += match.whiteScore ?? 0;
        totals[match.black] += match.blackScore ?? 0;
      });
    }
    return totals;
  };

  return (
    <>
      <Header showHomeButton={true} />

      <PageContainer>
        <div className="rounds-content">
          {submittedRounds.length === 0 ? (
            <p className="no-rounds-text">لا توجد جولات بعد.</p>
          ) : (
            submittedRounds.map((round, roundIndex) => {
              const totals = calculatePastPoints(roundIndex);
              return (
                <div key={round.number} className="table-wrapper">
                  <h2 className="form-title">الجولة {round.number}</h2>

                  <div className="search-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="ابحث عن لاعب..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                  </div>

                  <table className="table-theme">
                    <thead>
                      <tr>
                        <th>الرقم</th>
                        <th>الأبيض</th>
                        <th>النقاط</th>
                        <th>النتيجة</th>
                        <th>النقاط</th>
                        <th>الأسود</th>
                      </tr>
                    </thead>
                    <tbody>
                      {round.matches
                        .filter(match =>
                          match.white?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          match.black?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((match, idx) => (
                          <tr key={match.id || idx}>
                            <td>{idx + 1}</td>
                            <td>{match.white}</td>
                            <td>{totals[match.white]?.toFixed(1) || 0}</td>
                            <td>{match.result || "—"}</td>
                            <td>{totals[match.black]?.toFixed(1) || 0}</td>
                            <td>{match.black}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              );
            })
          )}
        </div>
      </PageContainer>
    </>
  );
};

export default RoundsHomePage;
