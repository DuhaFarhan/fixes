// src/TournamentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './TournamentDashboard.css';

import Header from '../components/TheHeaders/Header';
import DashboardDrawer from '../Components/TheDashboardDrawers/DashboardDrawer';
import PageContainer from '../Components/ThePageContainers/PageContainer';

import RoundsPage from './DashBoardButtons/RoundsPage/RoundsButton';
import StandingsPage from './DashBoardButtons/StandingsPage/StandingsButton';
import SettingsButton from './DashBoardButtons/TournamentSettingsButton/SettingsButton';

import CreatePlayerModal from './DashBoardButtons/PlayersButtonsModals/CreatePlayerModal';
import CreatePlayersByListModal from './DashBoardButtons/PlayersButtonsModals/CreatePlayersByListModal';
import RandomizeConfirmationModal from './DashBoardButtons/PlayersButtonsModals/RandomizeConfirmationModal';
import SortByRatingConfirmationModal from './DashBoardButtons/PlayersButtonsModals/SortByRatingConfirmationModal';
import ForbiddenPairsModal from './DashBoardButtons/PlayersButtonsModals/ForbiddenPairsModal';
import PredefinedPairsModal from './DashBoardButtons/PlayersButtonsModals/PredefinedPairsModal';
import CheckinConfirmationModal from './DashBoardButtons/PlayersButtonsModals/CheckinConfirmationModal';

import addIcon from '../assets/Icons/add-player.png';
import listIcon from '../assets/Icons/add-players.png';
import shuffleIcon from '../assets/Icons/shuffle.png';
import ratingIcon from '../assets/Icons/sortByrating.png';
import blockIcon from '../assets/Icons/forbidden.png';
import pairIcon from '../assets/Icons/pairs.png';
import confirmIcon from '../assets/Icons/confirm.png';
import csvIcon from '../assets/Icons/csv.png';

function TournamentDashboard() {
  const { id } = useParams();
  const username = localStorage.getItem('username') || 'المستخدم';
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('اللاعبين');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isRandomizeConfirmOpen, setIsRandomizeConfirmOpen] = useState(false);
  const [isSortByRatingConfirmOpen, setIsSortByRatingConfirmOpen] = useState(false);
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false);
  const [isPredefinedModalOpen, setIsPredefinedModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isCheckinMode, setIsCheckinMode] = useState(false);

  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);

  const tournamentKey = `tournament-${id}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(tournamentKey);
      const tournament = raw ? JSON.parse(raw) : {};
      const storedPlayers = Array.isArray(tournament.players) ? tournament.players : [];
      setPlayers(storedPlayers);
    } catch (err) {
      console.error('⚠ Failed to parse tournament:', err);
      setPlayers([]);
    }
  }, [id]);

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  const savePlayersToStorage = (updatedPlayers) => {
    const raw = localStorage.getItem(tournamentKey);
    const tournament = raw ? JSON.parse(raw) : {};
    const updatedTournament = { ...tournament, players: updatedPlayers };
    localStorage.setItem(tournamentKey, JSON.stringify(updatedTournament));
    setPlayers(updatedPlayers);
  };

  const handleCreatePlayer = (player) => {
    if (editingPlayer) {
      // تعديل لاعب
      const updated = players.map(p => (p.id === editingPlayer.id ? { ...player, id: editingPlayer.id } : p));
      savePlayersToStorage(updated);
    } else {
      // إنشاء لاعب جديد بمعرف ثابت
      const newPlayer = { ...player, id: getNextPlayerId() };
      savePlayersToStorage([...players, newPlayer]);
    }
    setEditingPlayer(null);
  };

  const handleCreateManyPlayers = (newPlayers) => {
    const playersWithIds = newPlayers.map(p => ({ ...p, id: getNextPlayerId() }));
    savePlayersToStorage([...players, ...playersWithIds]);
  };

  const handleDeletePlayer = (playerId) => {
    const updated = players.filter(p => p.id !== playerId);
    savePlayersToStorage(updated);
  };

  const handleCheckinChange = (playerId, value) => {
    const updated = players.map(p =>
      p.id === playerId ? { ...p, checkedIn: value } : p
    );
    savePlayersToStorage(updated);
  };

  const handleToggleCheckin = () => {
    if (!isCheckinMode) {
      const confirm = window.confirm("هل أنت متأكد من بدء التأكيد؟ سيتم إلغاء تأكيد كل اللاعبين.");
      if (!confirm) return;
      const updated = players.map(p => ({ ...p, checkedIn: false }));
      savePlayersToStorage(updated);
    }
    setIsCheckinMode(!isCheckinMode);
  };

  const handleRandomizePlayers = () => {
    const shuffled = [...players]
      .map(p => ({ ...p, sortKey: Math.random() }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ sortKey, ...p }) => p);
    savePlayersToStorage(shuffled);
  };

  const sortByRating = () => {
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    savePlayersToStorage(sorted);
  };

  const confirmedPlayers = players.filter(p => p.checkedIn !== false);
  const showToggleButton = location.pathname !== '/' && username;

  const getNextPlayerId = () => {
    const key = `tournament-${id}-nextId`;
    const current = parseInt(localStorage.getItem(key)) || 1;
    localStorage.setItem(key, current + 1);
    return current;
  };

  return (
    <>
      <Header
        username={username}
        showSidebarToggle={true}
        onSidebarToggle={toggleDrawer}
      />

      <DashboardDrawer
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showToggleButton={showToggleButton}
      />

      <PageContainer>
        {activeTab === 'اللاعبين' && (
          <>
            <div className="controls">
              <div className="row">
                <button className="btn btn-gold" onClick={() => { setIsModalOpen(true); setEditingPlayer(null); }}>
                  <img src={addIcon} alt="" className="btn-icon" /> إنشاء لاعب جديد
                </button>
                <button className="btn btn-outline" onClick={() => setIsListModalOpen(true)}>
                  <img src={listIcon} alt="" className="btn-icon" /> إنشاء لاعبين من القائمة
                </button>
                <button className="btn btn-outline" onClick={() => setIsRandomizeConfirmOpen(true)}>
                  <img src={shuffleIcon} alt="" className="btn-icon" /> ترتيب عشوائي
                </button>
              </div>

              <div className="row">
                <button className="btn btn-outline" onClick={() => setIsSortByRatingConfirmOpen(true)}>
                  <img src={ratingIcon} alt="" className="btn-icon" /> ترتيب حسب التصنيف
                </button>
                <button className="btn btn-outline" onClick={() => setIsForbiddenModalOpen(true)}>
                  <img src={blockIcon} alt="" className="btn-icon" /> الأزواج الممنوعة
                </button>
                <button className="btn btn-outline" onClick={() => setIsPredefinedModalOpen(true)}>
                  <img src={pairIcon} alt="" className="btn-icon" /> الأزواج المحددة مسبقًا
                </button>
              </div>

              <div className="row">
                <button className="btn btn-outline" onClick={() => setIsCheckinModalOpen(true)}>
                  <img src={confirmIcon} alt="" className="btn-icon" />
                  {isCheckinMode ? 'إيقاف التأكيد' : 'بدء التأكيد'}
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="table-theme">
                <thead>
                  <tr>
                    {isCheckinMode && (
                      <th>
                        <input
                          type="checkbox"
                          checked={confirmedPlayers.length === players.length}
                          onChange={(e) => {
                            const value = e.target.checked;
                            const updated = players.map(p => ({ ...p, checkedIn: value }));
                            savePlayersToStorage(updated);
                          }}
                        />
                      </th>
                    )}
                    <th>#</th>
                    <th>المعرف</th>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>التصنيف</th>
                    <th>معامل K</th>
                    <th>نقاط إضافية</th>
                    {!rounds.length && <th>حذف</th>}
                  </tr>
                </thead>
                <tbody>
                  {players.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>
                        لا توجد بيانات
                      </td>
                    </tr>
                  ) : (
                    players.map((player, index) => (
                      <tr key={player.id}>
                        {isCheckinMode && (
                          <td>
                            <input
                              type="checkbox"
                              checked={player.checkedIn !== false}
                              onChange={(e) => handleCheckinChange(player.id, e.target.checked)}
                            />
                          </td>
                        )}
                        <td>{index + 1}</td>
                        <td>{player.id}</td>
                        <td>
                          <span
                            className={`editable-name ${isCheckinMode && player.checkedIn === false ? 'crossed-name' : ''}`}
                            onClick={() => {
                              setEditingPlayer(player);
                              setIsModalOpen(true);
                            }}
                          >
                            {player.name}
                          </span>
                        </td>
                        <td>{player.email || '—'}</td>
                        <td>{player.rating}</td>
                        <td>{player.kFactor}</td>
                        <td>{player.extraPoints}</td>
                        {!rounds.length && (
                          <td>
                            <button className="btn-remove" onClick={() => handleDeletePlayer(player.id)}>🗑</button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="save-section">
              <button className="btn btn-outline">
                <img src={csvIcon} alt="csv" className="btn-icon" />
                تصدير CSV
              </button>
              {isCheckinMode && (
                <span className="checkin-count">
                  ✅ تم تأكيد {confirmedPlayers.length} / {players.length}
                </span>
              )}
            </div>
          </>
        )}

        {activeTab === 'الإعدادات' && <SettingsButton />}
        {activeTab === 'الجولات' && (
          <RoundsPage players={confirmedPlayers} rounds={rounds} setRounds={setRounds} />
        )}
        {activeTab === 'الترتيب' && (
          <StandingsPage players={players} rounds={rounds} />
        )}
      </PageContainer>

      <CreatePlayerModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPlayer(null); }}
        onCreate={handleCreatePlayer}
        existingPlayer={editingPlayer}
      />

      <CreatePlayersByListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onCreateMany={handleCreateManyPlayers}
      />
      <RandomizeConfirmationModal
        isOpen={isRandomizeConfirmOpen}
        onClose={() => setIsRandomizeConfirmOpen(false)}
        onConfirm={() => {
          handleRandomizePlayers();
          setIsRandomizeConfirmOpen(false);
        }}
      />
      <SortByRatingConfirmationModal
        isOpen={isSortByRatingConfirmOpen}
        onClose={() => setIsSortByRatingConfirmOpen(false)}
        onConfirm={() => {
          sortByRating();
          setIsSortByRatingConfirmOpen(false);
        }}
      />
      <ForbiddenPairsModal
        isOpen={isForbiddenModalOpen}
        onClose={() => setIsForbiddenModalOpen(false)}
        players={players}
      />
      <PredefinedPairsModal
        isOpen={isPredefinedModalOpen}
        onClose={() => setIsPredefinedModalOpen(false)}
        players={players}
        tournamentId={id}
      />
      <CheckinConfirmationModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        onConfirm={handleToggleCheckin}
        isActive={isCheckinMode}
      />
    </>
  );
}

export default TournamentDashboard;