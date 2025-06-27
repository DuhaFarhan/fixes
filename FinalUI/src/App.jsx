import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import GuestsHomePage from './HomePage/GuestsHomePage';
import RoundsHomePage from './HomePage/RoundsHomePage';
import StandingsHomePage from './HomePage/StandingsHomePage';
import Login from './LoginPage/Login';
import MyTournaments from './MyTournamentsPage/MyTournaments';
import CreateTournament from './CreateTournamentPage/CreateTournament';
import TournamentDashboard from './DashBoardPage/TournamentDashboard';
import ArchivedTournaments from './ArchivedTournamentsPage/ArchivedTournaments';
import ArbiterRounds from './DashBoardPage/ArbiterRounds'; // استيراد الصفحة الجديدة

// ✅ صفحة الجولات الخاصة بالحكم (لوحة التحكم)
import RoundsButton from './DashBoardPage/DashBoardButtons/RoundsPage/RoundsButton';

const App = () => {
  const location = useLocation();

  return (
    <Routes>
      {/* صفحات الزوار */}
      <Route path="/" element={<GuestsHomePage />} />
      <Route path="/rounds" element={<RoundsHomePage />} />
      <Route path="/standings" element={<StandingsHomePage />} />
      <Route path="/login" element={<Login />} />

      {/* بعد تسجيل الدخول */}
      <Route path="/mytournaments" element={<MyTournaments />} />
      <Route path="/create" element={<CreateTournament />} />
      <Route path="/tournament/:id" element={<TournamentDashboard />} />

      {/* ✅ صفحة البطولات المؤرشفة */}
      <Route path="/archive" element={<ArchivedTournaments />} />

      {/* ✅ صفحة الجولات للحكم */}
      <Route path="/rounds-dashboard" element={<RoundsButton />} />
      <Route path="/arbiter-rounds" element={<ArbiterRounds />} />

    </Routes>
  );
};

export default App;
