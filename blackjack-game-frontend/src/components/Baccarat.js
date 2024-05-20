import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataContext } from '../contexts/DataContext';
import './Baccarat.css';

const Baccarat = () => {
    const [betAmount, setBetAmount] = useState(5); // Default bet amount
    const [betChoice, setBetChoice] = useState('player'); // Default bet choice
    const [gameStarted, setGameStarted] = useState(false); // Track whether the game has started
    const [playerCards, setPlayerCards] = useState([]); // Player's cards
    const [bankerCards, setBankerCards] = useState([]); // Banker's cards
    const [gameResult, setGameResult] = useState(''); // Game result
    const [deck, setDeck] = useState([]); // Game result
    const [balance, updateBalance] = useState(0);
    const [username, updateUsername] = useState('');

    const { userData } = useContext(DataContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${userData.username}`);
                updateBalance(response.data.balance);
                updateUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

    const DECK_COUNT = 6; // Number of decks to use

    const generateInitialCards = () => {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

        // Generate cards for each deck
        for (let i = 0; i < DECK_COUNT; i++) {
            for (const suit of suits) {
                for (const rank of ranks) {
                    deck.push({ suit, rank });
                }
            }
        }

        // Shuffle the deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    };

    const getCardImageUrl = (card) => {
        const { rank, suit } = card;
        return `images/${rank}_of_${suit}.png`;
    };

    const handleBetAmountChange = (e) => {
        // Update the bet amount based on user input
        const newAmount = parseInt(e.target.value);
        setBetAmount(newAmount);
    };
    
    const handleBetChoiceChange = (e) => {
        // Update the bet choice based on user selection
        setBetChoice(e.target.value);
    };

    const handleEndGame = async (result) => {
        setGameResult(result);
        setGameStarted(false);

        try {
            // Define the API endpoint URLs
            let apiUrl;
            if (result === "banker" || result === "player") {
                apiUrl = `http://localhost:5000/api/users/win/${username}`;
                const response = await axios.put(apiUrl, {
                    winCount: 1,
                    balance: balance + betAmount
                });
                updateBalance(balance + betAmount);
            }
            if (result === "tie") {
                apiUrl = `http://localhost:5000/api/users/win/${username}`;
                const response = await axios.put(apiUrl, {
                    winCount: 1,
                    balance: balance + (8 * betAmount)
                });
                updateBalance(balance + (8 * betAmount));
            }
            else {
                apiUrl = `http://localhost:5000/api/users/loss/${username}`;
                const response = await axios.put(apiUrl, {
                    lossCount: 1,
                    balance: balance - betAmount
                });
                updateBalance(balance - betAmount);
            }
        } catch (error) {
            console.error('API call failed:', error.response.data.message);
        }
    };

    const handleStartGame = async () => {
        try {
            if (betAmount % 5 === 0 && betAmount > 0 && betAmount <= 1000) {
                setGameResult('');
                setPlayerCards([]);
                setBankerCards([]);
                generateInitialCards();
                setGameStarted(true);

                // Deal two cards to player and banker
                setPlayerCards(playerCards => [...playerCards, deck.pop(), deck.pop()]);
                setBankerCards(bankerCards => [...bankerCards, deck.pop(), deck.pop()]);

            } else {
                alert("Bet amount should be in units of 5 and maximum is 1000.");
            }
        } catch (error) {
            console.error('Error starting game:', error);
        }
    };

    // Handle player's blackjack
    useEffect(() => {

        // Evaluate game result
        if (playerCards.length >= 2 && bankerCards.length >= 2)
            evaluateGame();
    }, [playerCards, bankerCards]);

    const calculateTotal = (cards) => {
        let total = 0;
        cards.forEach((card) => {
            if (card.rank === 'king' || card.rank === 'queen' || card.rank === 'jack') {
                total += 0;
            } else if (card.rank === 'ace') {
                total += 1;
            } else {
                total += parseInt(card.rank);
            }
        });
        return total % 10; // In Baccarat, only the last digit of the total counts
    };

    const evaluateGame = async () => {
        let playerTotal = calculateTotal(playerCards);
        let bankerTotal = calculateTotal(bankerCards);
        debugger;

        if ((playerTotal >= 8 || bankerTotal >= 8) || (playerTotal >= 6 && bankerTotal >= 6)) {
            if (playerTotal > bankerTotal) {
                await handleEndGame('player');
            }
            else if (bankerTotal > playerTotal) {
                await handleEndGame('banker');
            }
            else {
                await handleEndGame('tie');
            }
        }
        else {
            if ((playerTotal == 6 || playerTotal == 7) && bankerTotal <= 5) {
                bankerCards.push(deck.pop())
                playerTotal = calculateTotal(playerCards);
                bankerTotal = calculateTotal(bankerCards);
                if (playerTotal > bankerTotal) {
                    await handleEndGame('player');
                }
                else if (bankerTotal > playerTotal) {
                    await handleEndGame('banker');
                }
                else {
                    await handleEndGame('tie');
                }
            }
            else {
                playerCards.push(deck.pop())
                if ((bankerTotal == 5 && (playerCards[3] <= 7 && playerCards >= 4)) ||
                    (bankerTotal == 4 && (playerCards[3] <= 7 && playerCards >= 2)) ||
                    (bankerTotal == 3 && (playerCards[3] != 8)) ||
                    (bankerTotal <= 2)
                ) {
                    bankerCards.push(deck.pop())
                }
                playerTotal = calculateTotal(playerCards);
                bankerTotal = calculateTotal(bankerCards);
                if (playerTotal > bankerTotal) {
                    await handleEndGame('player');
                }
                else if (bankerTotal > playerTotal) {
                    await handleEndGame('banker');
                }
                else {
                    await handleEndGame('tie');
                }
            }
        }


        if (playerTotal > bankerTotal) {
            await handleEndGame('player');
        } else if (bankerTotal > playerTotal) {
            await handleEndGame('banker');
        } else {
            await handleEndGame('tie');
        }
    };

    return (
        <div className='baccarat-body'>
            <div className="baccarat-game-container">
                <h2>Baccarat Game</h2>
                <div>
                    <h3>Bet Selection</h3>
                    <h3>Total Balance: {balance}</h3>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="player"
                                checked={betChoice === 'player'}
                                onChange={handleBetChoiceChange}
                                disabled={gameStarted}
                            />
                            Player
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="banker"
                                checked={betChoice === 'banker'}
                                onChange={handleBetChoiceChange}
                                disabled={gameStarted}
                            />
                            Banker
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="tie"
                                checked={betChoice === 'tie'}
                                onChange={handleBetChoiceChange}
                                disabled={gameStarted}
                            />
                            Tie
                        </label>
                    </div>
                    <input
                        type="number"
                        value={betAmount}
                        onChange={handleBetAmountChange}
                        min={5}
                        max={1000}
                        step={5}
                    />
                    <button onClick={handleStartGame} disabled={gameStarted} className='start'>Start Game</button>
                </div>
                <div>
                    <div className="cards-container">
                        <div>
                            <h3>Player's Hand - {calculateTotal(playerCards)}</h3>
                            <div className="cards-container-ph">
                                {playerCards.map((card, index) => (
                                    <div key={index} className="card" style={{ backgroundImage: `url(${getCardImageUrl(card)})` }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3>Banker's Hand - {calculateTotal(bankerCards)}</h3>
                            <div className="cards-container-dh">
                                {bankerCards.map((card, index) => (
                                    <div key={index} className="card" style={{ backgroundImage: `url(${getCardImageUrl(card)})` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Game Result: {gameResult}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Baccarat;
