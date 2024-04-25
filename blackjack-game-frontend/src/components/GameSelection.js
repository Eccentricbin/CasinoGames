import React from 'react';
import { Link } from 'react-router-dom';

const GameSelection = () => {
  return (
    <div>
      <h2>Choose a Game</h2>
      <div>
        <Link to="/blackjack">
          <button>Blackjack</button>
        </Link>
        <Link>
          <button>Baccarat</button>
        </Link>
      </div>
    </div>
  );
};

export default GameSelection;
