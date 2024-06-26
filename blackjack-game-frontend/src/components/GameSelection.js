import React from 'react';
import { Link } from 'react-router-dom';
import './GameSelection.css';

const GameSelection = () => {
  return (
    <div className='game-selection-page'>
      <div className='game-selection-container'>
        <h2>Choose a Game</h2>
        <Link to="/blackjack">
          <div className="buttonBox blackjack">
            <button>Blackjack</button>
            <div className="border"></div>
            <div className="border"></div>
            <div className="border"></div>
            <div className="border"></div>
          </div>
        </Link>
        <Link to="/baccarat">
          <div className="buttonBox baccarat">
            <button>Baccarat</button>
            <div className="border"></div>
            <div className="border"></div>
            <div className="border"></div>
            <div className="border"></div>
          </div>
        </Link>
        <Link to="/ThreeCardPoker">
          <div className="buttonBox poker">
            <button>3-Card Poker</button>
            <div className="border"></div>
            <div className="border"></div>
            <div className="border"></div>
            <div className="border"></div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default GameSelection;
