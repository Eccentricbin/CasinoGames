import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import GameSelection from './components/GameSelection';
import BlackJack from './components/BlackJack'
import Baccarat from './components/Baccarat';
import ThreeCardPoker from './components/ThreeCardPoker';
import Home from './components/Home';
import AboutMe from './components/AboutMe';

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
          <Route path="/baccarat" element={<Baccarat />} />
          <Route path="/ThreeCardPoker" element={<ThreeCardPoker />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/AboutMe" element={<AboutMe />} />
        </Routes>
      </div>
    </Router>
  );
};



export default App;
