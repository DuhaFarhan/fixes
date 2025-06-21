import React, { useRef, useState, useEffect } from "react";
import PageContainer from '../../../Components/ThePageContainers/PageContainer';
import './RoundsButton.css';
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ViolationDetailsModal from '../../../Components/Violations/ViolationDetailsModal';

function RoundsButton({ players }) {
  const resultOptions = [
    { value: "", label: "تعيين النتيجة" },
    { value: "1-0", label: "١ - ٠" },
    { value: "0.5-0.5", label: "تعادل ٠.٥ - ٠.٥" },
    { value: "0-1", label: "٠ - ١" },
    { value: "0F-0F", label: "٠F - ٠F" },
    { value: "1F-0", label: "١F - ٠" },
    { value: "0-1F", label: "٠ - ١F" },
    { value: "حذف", label: "❌ حذف النتيجة" },
  ];

  const initialRounds = [
    {
      number: 1,
      matches: [
        { id: 'match-1-1', white: 'لينا', black: 'شهد', whitePts: 0, blackPts: 0, result: '', whiteViolations: [], blackViolations: [] },
        { id: 'match-1-2', white: 'ديما', black: 'غادة', whitePts: 0, blackPts: 0, result: '', whiteViolations: [], blackViolations: [] },
        { id: 'match-1-3', white: 'جنان', black: 'بتول', whitePts: 0, blackPts: 0, result: '', whiteViolations: [], blackViolations: [] },
        { id: 'match-1-4', white: 'هبه', black: 'براءة', whitePts: 0, blackPts: 0, result: '', whiteViolations: [], blackViolations: [] },
        { id: 'match-1-5-bye', white: 'ايمان', black: 'Bye', whitePts: 0.5, blackPts: '', result: 'Bye', whiteViolations: [], blackViolations: [] },
      ]
    }
  ];

  const [rounds, setRounds] = useState(initialRounds);
  const [currentRound, setCurrentRound] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [showAllRoundsModal, setShowAllRoundsModal] = useState(false);
  const scrollRef = useRef(null);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [currentViolationData, setCurrentViolationData] = useState(null);

  useEffect(() => {
    if (rounds.length > 0 && currentRound === null) {
      setCurrentRound(1);
    }
  }, [rounds.length, currentRound]);

  const allResultsFilled = (round) => {
    return round.matches.every((m) => m.result !== "" || m.black === "Bye");
  };

  const generateMatches = () => {
    const activePlayers = players.filter(player => player && player.name);
    const shuffled = [...activePlayers].sort(() => Math.random() - 0.5);
    const matches = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        matches.push({
          id: `match-${rounds.length + 1}-${i / 2 + 1}`,
          white: shuffled[i].name,
          black: shuffled[i + 1].name,
          whitePts: 0,
          blackPts: 0,
          result: "",
          whiteViolations: [],
          blackViolations: []
        });
      } else {
        matches.push({
          id: `match-${rounds.length + 1}-${i / 2 + 1}-bye`,
          white: shuffled[i].name,
          black: "Bye",
          whitePts: 0.5,
          blackPts: "",
          result: "Bye",
          whiteViolations: [],
          blackViolations: []
        });
      }
    }

    return matches;
  };

  const handleGenerateRound = () => {
    if (!allResultsFilled(rounds[rounds.length - 1])) return;
    const newRound = {
      number: rounds.length + 1,
      matches: generateMatches()
    };
    setRounds([...rounds, newRound]);
    setCurrentRound(rounds.length + 1);
    setTimeout(() => scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' }), 100);
  };

  const handleSetResult = (roundIdx, matchId, value) => {
    const updated = [...rounds];
    const match = updated[roundIdx].matches.find(m => m.id === matchId);
    if (!match) return;

    if (value === "" || value === "حذف") {
      match.whitePts = 0;
      match.blackPts = 0;
      match.result = "";
    } else {
      switch (value) {
        case "1-0": match.whitePts = 1; match.blackPts = 0; break;
        case "0.5-0.5": match.whitePts = 0.5; match.blackPts = 0.5; break;
        case "0-1": match.whitePts = 0; match.blackPts = 1; break;
        case "0F-0F": match.whitePts = 0; match.blackPts = 0; break;
        case "1F-0": match.whitePts = 1; match.blackPts = 0; break;
        case "0-1F": match.whitePts = 0; match.blackPts = 1; break;
        default: break;
      }
      match.result = value;
    }

    setRounds(updated);
  };

  const handleOpenViolationModal = (matchId, playerType, index, existing) => {
    if (currentRound !== rounds.length) return;
    setCurrentViolationData({ matchId, playerType, violationIndex: index, ...existing });
    setIsViolationModalOpen(true);
  };

  const handleSaveViolation = (data) => {
    const { matchId, playerType, violationIndex } = currentViolationData;
    const updated = [...rounds];
    const match = updated[currentRound - 1].matches.find(m => m.id === matchId);
    const arr = playerType === 'white' ? match.whiteViolations : match.blackViolations;
    if (violationIndex !== undefined) arr[violationIndex] = data;
    else if (arr.length < 3) arr.push(data);
    setRounds(updated);
    setIsViolationModalOpen(false);
  };

  const handleDeleteViolation = () => {
    const { matchId, playerType, violationIndex } = currentViolationData;
    const updated = [...rounds];
    const match = updated[currentRound - 1].matches.find(m => m.id === matchId);
    const arr = playerType === 'white' ? match.whiteViolations : match.blackViolations;
    if (violationIndex !== undefined) arr.splice(violationIndex, 1);
    setRounds(updated);
    setIsViolationModalOpen(false);
  };

  const RoundTable = ({ round, roundIdx }) => (
    <table className="round-table">
      <thead>
        <tr>
          <th>#</th>
          <th>الأبيض</th>
          <th>نقاط</th>
          <th colSpan="3">مخالفات الأبيض</th>
          <th>النتيجة</th>
          <th colSpan="3">مخالفات الأسود</th>
          <th>نقاط</th>
          <th>الأسود</th>
        </tr>
      </thead>
      <tbody>
        {round.matches.map((m, i) => (
          <tr key={m.id}>
            <td>{i + 1}</td>
            <td>{m.white}</td>
            <td>{m.whitePts}</td>
            <td colSpan="3">
              <div className="violation-squares-container">
                {[0, 1, 2].map(idx => (
                  <button
                    key={idx}
                    className={`violation-square ${m.whiteViolations[idx] ? 'filled' : ''}`}
                    onClick={() => handleOpenViolationModal(m.id, 'white', idx, m.whiteViolations[idx])}
                    disabled={roundIdx !== rounds.length - 1}
                  >
                    {m.whiteViolations[idx] ? `V${idx + 1}` : `+${idx + 1}`}
                  </button>
                ))}
              </div>
            </td>
            <td>
              {m.black !== "Bye" ? (
                <select
                  value={m.result}
                  onChange={(e) => handleSetResult(roundIdx, m.id, e.target.value)}
                  disabled={roundIdx !== rounds.length - 1}
                  className="native-select"
                >
                  {resultOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <span>{m.result}</span>
              )}
            </td>
            <td colSpan="3">
              <div className="violation-squares-container">
                {[0, 1, 2].map(idx => (
                  <button
                    key={idx}
                    className={`violation-square ${m.blackViolations[idx] ? 'filled' : ''}`}
                    onClick={() => handleOpenViolationModal(m.id, 'black', idx, m.blackViolations[idx])}
                    disabled={roundIdx !== rounds.length - 1 || m.black === "Bye"}
                  >
                    {m.blackViolations[idx] ? `V${idx + 1}` : `+${idx + 1}`}
                  </button>
                ))}
              </div>
            </td>
            <td>{m.blackPts}</td>
            <td>{m.black}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <PageContainer>
      <div className="rounds-page">
        <h1 className="round-title">الجولات</h1>

        <button className="generate-btn" onClick={handleGenerateRound}>
          الجولة التالية
        </button>

        <div className="round-buttons-wrapper">
          <button onClick={() => setCurrentRound((p) => Math.max(1, p - 1))}>
            <LuChevronRight size={24} />
          </button>
          <div className="round-buttons-scroll" ref={scrollRef}>
            {rounds.map(r => (
              <button
                key={r.number}
                className={currentRound === r.number ? "round-btn active" : "round-btn"}
                onClick={() => setCurrentRound(r.number)}
              >
                {r.number}
              </button>
            ))}
          </div>
          <button onClick={() => setCurrentRound((p) => Math.min(rounds.length, p + 1))}>
            <LuChevronLeft size={24} />
          </button>
        </div>

        <div className="rounds-table-wrapper">
          <RoundTable round={rounds[currentRound - 1]} roundIdx={currentRound - 1} />
        </div>

        <ViolationDetailsModal
          isOpen={isViolationModalOpen}
          onClose={() => setIsViolationModalOpen(false)}
          violationData={currentViolationData}
          onSave={handleSaveViolation}
          onDelete={handleDeleteViolation}
        />
      </div>
    </PageContainer>
  );
}

export default RoundsButton;
