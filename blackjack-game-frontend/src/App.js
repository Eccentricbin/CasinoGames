import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import GameSelection from './components/GameSelection';
import BlackJack from './components/BlackJack'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration /> } />
          <Route path="/game-selection" element={<GameSelection />} />
          <Route path="/blackjack" element={<BlackJack />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
