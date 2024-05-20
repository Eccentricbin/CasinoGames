import React from 'react';
import { Link } from 'react-router-dom';
import './GameSelection.css';

const GameSelection = () => {
  return (
    <div className= 'game-selection-page'>
      <div className='game-selection-container'>
        <h2>Choose a Game</h2>
        <Link to="/blackjack">
          <button class = "blackjack">Blackjack</button>
        </Link>
        <Link to="/baccarat">
          <button class = "baccarat">Baccarat</button>
        </Link>
      </div>
    </div>
  );
};

export default GameSelection;
