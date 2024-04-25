import React, { useState } from 'react';
import axios from 'axios';

const Blackjack = () => {
  const [betAmount, setBetAmount] = useState(5); // Default bet amount
  const [gameStarted, setGameStarted] = useState(false); // Track whether the game has started
  const [playerCards, setPlayerCards] = useState([]); // Player's cards
  const [dealerCards, setDealerCards] = useState([]); // Dealer's cards
  const [gameResult, setGameResult] = useState(''); // Game result

  const handleBetAmountChange = (e) => {
    // Update the bet amount based on user input
    const newAmount = parseInt(e.target.value);
    setBetAmount(newAmount);
  };

  const handleStartGame = async () => {
    try {
      // Send request to backend to start game with selected bet amount
      const response = await axios.post('/api/blackjack/start', { betAmount });
      // Handle game initialization response from backend
      setGameStarted(true);
      setPlayerCards(response.data.playerCards);
      setDealerCards(response.data.dealerCards);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const handleHit = async () => {
    try {
      // Send request to backend to hit
      const response = await axios.post('/api/blackjack/hit');
      // Handle hit response from backend
      setPlayerCards(response.data.playerCards);
      // Check if player busts or not
      if (response.data.playerBust) {
        // Player busts, end game
        setGameResult('lose');
      }
    } catch (error) {
      console.error('Error hitting:', error);
    }
  };

  const handleStand = async () => {
    try {
      // Send request to backend to stand
      const response = await axios.post('/api/blackjack/stand');
      // Handle stand response from backend
      // Determine game outcome (win, lose, tie)
      setGameResult(response.data.gameResult);
    } catch (error) {
      console.error('Error standing:', error);
    }
  };

  return (
    <div className="blackjack-game-container">
      <h2>Blackjack Game</h2>
      {!gameStarted && (
        <div>
          <h3>Bet Selection</h3>
          <input
            type="number"
            value={betAmount}
            onChange={handleBetAmountChange}
            min={5}
            max={100}
            step={5}
          />
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}
      {gameStarted && (
        <div>
          <h3>Player's Hand</h3>
          <div className="cards-container">
            {playerCards.map((card, index) => (
              <div key={index} className="card">
                {card.rank} of {card.suit}
              </div>
            ))}
          </div>
          <h3>Dealer's Hand</h3>
          <div className="cards-container">
            {dealerCards.map((card, index) => (
              <div key={index} className="card">
                {card.rank} of {card.suit}
              </div>
            ))}
          </div>
          <div>
            <button onClick={handleHit} disabled={gameResult !== ''}>
              Hit
            </button>
            <button onClick={handleStand} disabled={gameResult !== ''}>
              Stand
            </button>
          </div>
          {gameResult && (
            <div>
              <h3>Game Result: {gameResult}</h3>
              {/* Display other game result details */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blackjack;
