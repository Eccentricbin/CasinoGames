import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataContext } from '../contexts/DataContext';


const Blackjack = () => {
    const [betAmount, setBetAmount] = useState(5); // Default bet amount
    const [gameStarted, setGameStarted] = useState(false); // Track whether the game has started
    const [playerCards, setPlayerCards] = useState([]); // Player's cards
    const [dealerCards, setDealerCards] = useState([]); // Dealer's cards
    const [gameResult, setGameResult] = useState(''); // Game result
    const [deck, setDeck] = useState([]); // Game result
    const [balance, updateBalance] = useState(0);
    const [username, updateUsername] = useState('');

    const { userData } = useContext(DataContext);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/users/${userData.username}`);
            console.log(response.data);
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
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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

    const handleBetAmountChange = (e) => {
        // Update the bet amount based on user input
        const newAmount = parseInt(e.target.value);
        setBetAmount(newAmount);
    };

    const handleEndGame = async (result) => {
        setGameResult(result);
        setGameStarted(false);

        try {
            
            // Define the API endpoint URLs
            let apiUrl;
            switch (result) {
                case 'win':
                    console.log(balance, betAmount)
                    apiUrl = `http://localhost:5000/api/users/win/${username}`; // Replace userId with the actual user ID
                    // Make the PUT request to the corresponding API endpoint
                    const response1 = await axios.put(apiUrl, {
                        winCount: 1, 
                        balance: balance + betAmount
                    });
                    break;
                case 'lose':
                    console.log(balance, betAmount)
                    apiUrl = `http://localhost:5000/api/users/loss/${username}`; // Replace userId with the actual user ID
                    const response2 = await axios.put(apiUrl, {
                        lossCount: 1, 
                        balance: balance - betAmount
                    });
                    break;
                case 'draw':
                    apiUrl = `http://localhost:5000/api/users/tie/${username}`; // Replace userId with the actual user ID
                    const response3 = await axios.put(apiUrl, {
                        tieCount: 1, 
                        balance: balance
                    });
                    break;
                default:
                    console.error('Invalid game result');
                    return;
            }
        } catch (error) {
            console.error('API call failed:', error.response.data.message);
        }
    }

    const handlePlayerBlackJack = async () => {
        console.log("here");
        if (calculateTotal(dealerCards) == 10 || (calculateTotal(dealerCards) == 11 && dealerCards.length == 1)) {
            dealerCards.push(deck.pop());
            setPlayerCards(dealerCards => [...dealerCards]);
            if (calculateTotal(dealerCards) == 21) {
                await handleEndGame('draw')
            }
            else {
                await handleEndGame('win');
            }
        }
        else {
            await handleEndGame('win');
        }
    }

    const handleStartGame = async () => {
        try {
            setGameResult('');
            setPlayerCards([]);
            setDealerCards([]);
            // Handle game initialization response from backend
            generateInitialCards();
            setGameStarted(true);
            setPlayerCards(playerCards => [...playerCards, deck.pop()]);
            setDealerCards(dealerCards => [...dealerCards, deck.pop()]);
            setPlayerCards(playerCards => [...playerCards, deck.pop()]);
            //Handle black jack logic
            var total = calculateTotal(playerCards);
            if (total == 21)
                await handlePlayerBlackJack();
        } catch (error) {
            console.error('Error starting game:', error);
        }
    };

    const calculateTotal = (cards) => {
        let total = 0;
        let aceCount = 0; // Count the number of Aces
        console.log(playerCards)
        cards.forEach((card) => {
            if (card.rank === 'K' || card.rank === 'Q' || card.rank === 'J') {
                total += 10;
            } else if (card.rank === 'A') {
                aceCount++; // Increment Ace count
                total += 11; // Assume Ace as 11 initially
            } else {
                total += parseInt(card.rank);
            }
        });

        // Adjust Ace value if total exceeds 21 and there are Aces
        while (total > 21 && aceCount > 0) {
            total -= 10; // Change Ace value from 11 to 1
            aceCount--; // Decrement Ace count
        }
        return total;
    };

    const handleHit = async () => {
        var total = 0;
        try {
            playerCards.push(deck.pop())
            setPlayerCards(playerCards => [...playerCards]);
            total = calculateTotal(playerCards);
            if (total > 21) {
                // Player busts, end game
                await handleEndGame('lose');
            }
            else if (total == 21) {
                await handleStand();
            }
        } catch (error) {
            console.error('Error hitting:', error);
        }
    };

    const handleStand = async () => {
        try {
            if (calculateTotal(playerCards) < 12) {
                alert("You can't stand below 12.");
                return;
            }

            while (calculateTotal(dealerCards) < 17) {
                dealerCards.push(deck.pop())
            }
            if (calculateTotal(dealerCards) > 21 || calculateTotal(dealerCards) < calculateTotal(playerCards)) {
                await handleEndGame('win');
            }
            else if (calculateTotal(dealerCards) > calculateTotal(playerCards)) {
                await handleEndGame('lose');
            }
            else {
                await handleEndGame('draw');
            }
        } catch (error) {
            console.error('Error standing:', error);
        }
    };

    return (
        <div className="blackjack-game-container">
            <h2>Blackjack Game</h2>
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
                <button onClick={handleStartGame} disabled={gameStarted}>Start Game</button>
            </div>
            <div>
                <h3>Dealer's Hand</h3>
                <div className="cards-container">
                    {dealerCards.map((card, index) => (
                        <div key={index} className="card">
                            {card.rank} of {card.suit}
                        </div>
                    ))}
                </div>
                <h3>Player's Hand</h3>
                <div className="cards-container">
                    {playerCards.map((card, index) => (
                        <div key={index} className="card">
                            {card.rank} of {card.suit}
                        </div>
                    ))}
                </div>
                <div>
                    <button onClick={handleHit} disabled={!gameStarted}>
                        Hit
                    </button>
                    <button onClick={handleStand} disabled={!gameStarted}>
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
        </div>
    );
};

export default Blackjack;
