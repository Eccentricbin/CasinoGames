import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataContext } from '../contexts/DataContext';
import './ThreeCardPoker.css';

const ThreeCardPoker = () => {
    const [betAmount, setBetAmount] = useState(5);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);
    const [gameResult, setGameResult] = useState('');
    const [deck, setDeck] = useState([]);
    const [balance, updateBalance] = useState(0);
    const [username, updateUsername] = useState('');
    const [playerHandDescription, setPlayerHandDescription] = useState('');
    const [dealerHandDescription, setDealerHandDescription] = useState('');

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

        fetchData();
    }, []);

    const DECK_COUNT = 1; // Only one deck is needed

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
        const newAmount = parseInt(e.target.value);
        setBetAmount(newAmount);
    };

    const handleEndGame = async (result) => {
        setGameResult(result);
        setGameStarted(false);

        try {
            let apiUrl;
            if (result === 'win') {
                apiUrl = `http://localhost:5000/api/users/win/${username}`;
                await axios.put(apiUrl, { winCount: 1, balance: balance + betAmount });
                updateBalance(balance + betAmount);
            } else if (result === 'loss') {
                apiUrl = `http://localhost:5000/api/users/loss/${username}`;
                await axios.put(apiUrl, { lossCount: 1, balance: balance - betAmount });
                updateBalance(balance - betAmount);
            }
        } catch (error) {
            console.error('API call failed:', error.response.data.message);
        }
    };

    const handleStartGame = async () => {
        try {
            if (betAmount > 0 && betAmount <= 1000) {
                setGameResult('');
                setPlayerCards([]);
                setDealerCards([]);
                generateInitialCards();
                setGameStarted(true);

                setPlayerCards([deck.pop(), deck.pop(), deck.pop()]);
                setDealerCards([deck.pop(), deck.pop(), deck.pop()]);
            } else {
                alert("Bet amount should be between 1 and 1000.");
            }
        } catch (error) {
            console.error('Error starting game:', error);
        }
    };

    useEffect(() => {
        if (playerCards.length === 3 && dealerCards.length === 3) {
            evaluateGame();
        }
    }, [playerCards, dealerCards]);

    const getRankValue = (rank) => {
        const rankValues = {
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '10': 10,
            'jack': 11,
            'queen': 12,
            'king': 13,
            'ace': 14,
        };
        return rankValues[rank];
    };

    const isFlush = (cards) => {
        return cards.every(card => card.suit === cards[0].suit);
    };

    const isStraight = (cards) => {
        const sortedCards = [...cards].sort((a, b) => getRankValue(a.rank) - getRankValue(b.rank));
        return sortedCards.every((card, index, arr) => 
            index === 0 || getRankValue(card.rank) === getRankValue(arr[index - 1].rank) + 1
        );
    };

    const getHandRank = (cards) => {
        const rankCounts = {};
        cards.forEach(card => {
            rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
        });

        const rankValues = cards.map(card => getRankValue(card.rank)).sort((a, b) => b - a);
        const uniqueRanks = Object.keys(rankCounts).length;
        const isFlushHand = isFlush(cards);
        const isStraightHand = isStraight(cards);

        if (isStraightHand && isFlushHand) {
            return { rank: 1, value: rankValues }; // Straight Flush
        } else if (Object.values(rankCounts).includes(3)) {
            return { rank: 2, value: rankValues }; // Three of a Kind
        } else if (isStraightHand) {
            return { rank: 3, value: rankValues }; // Straight
        } else if (isFlushHand) {
            return { rank: 4, value: rankValues }; // Flush
        } else if (Object.values(rankCounts).includes(2)) {
            return { rank: 5, value: rankValues }; // Pair
        } else {
            return { rank: 6, value: rankValues }; // High Card
        }
    };

    const compareHands = (playerHand, dealerHand) => {
        if (playerHand.rank < dealerHand.rank) {
            return 'win';
        } else if (playerHand.rank > dealerHand.rank) {
            return 'loss';
        } else {
            for (let i = 0; i < playerHand.value.length; i++) {
                if (playerHand.value[i] > dealerHand.value[i]) {
                    return 'win';
                } else if (playerHand.value[i] < dealerHand.value[i]) {
                    return 'loss';
                }
            }
            return 'tie';
        }
    };

    const evaluateGame = () => {
        const playerHand = getHandRank(playerCards);
        const dealerHand = getHandRank(dealerCards);
        const result = compareHands(playerHand, dealerHand);

        setPlayerHandDescription(getHandDescription(playerHand));
        setDealerHandDescription(getHandDescription(dealerHand));

        handleEndGame(result);
    };

    const getHandDescription = (hand) => {
        const handNames = [
            'Straight Flush',
            'Three of a Kind',
            'Straight',
            'Flush',
            'Pair',
            'High Card'
        ];
        return handNames[hand.rank - 1];
    };

    return (
        <div className='three-card-poker-body'>
            <div className="three-card-poker-game-container">
                <h2>3-Card Poker</h2>
                <div>
                    <h3>Bet Selection</h3>
                    <h3>Total Balance: {balance}</h3>
                    <input
                        type="number"
                        value={betAmount}
                        onChange={handleBetAmountChange}
                        min={5}
                        max={100}
                        step={5}
                    />
                    <button onClick={handleStartGame} disabled={gameStarted} className='start'>Start Game</button>
                </div>
                <div>
                    <div className="cards-container">
                        <div>
                            <h3>Player's Hand</h3>
                            <div className="cards-container-ph">
                                {playerCards.map((card, index) => (
                                    <div key={index} className="card" style={{ backgroundImage: `url(${getCardImageUrl(card)})` }} />
                                ))}
                            </div>
                            <h3>{playerHandDescription}</h3>
                        </div>
                        <div>
                            <h3>Dealer's Hand</h3>
                            <div className="cards-container-dh">
                                {dealerCards.map((card, index) => (
                                    <div key={index} className="card" style={{ backgroundImage: `url(${getCardImageUrl(card)})` }} />
                                ))}
                            </div>
                            <h3>{dealerHandDescription}</h3>
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

export default ThreeCardPoker;
