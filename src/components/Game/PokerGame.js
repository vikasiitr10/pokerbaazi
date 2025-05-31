import React, { useState, useEffect } from 'react';
import PlayerHand from '../Player/PlayerHand';
import { evaluateHand, compareHands } from '../../utils/handEvaluator';

import BotHand from '../Bot/BotHand';
import CommunityCards from '../Cards/CommunityCards';
import ActionButtons from '../UI/ActionButtons';
import ChipCounter from '../UI/ChipCounter';
import { initializeDeck, dealCards, dealCommunityCard } from '../../utils/gameLogic';
import { getBotAction, getBotBetAmount } from '../Bot/BotLogic';
import './PokerGame.css';


const PokerGame = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [playerChips, setPlayerChips] = useState(1000);
  const [botChips, setBotChips] = useState(1000);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [playerBet, setPlayerBet] = useState(0);
  const [botBet, setBotBet] = useState(0);
  const [gamePhase, setGamePhase] = useState('preflop');
  const [currentPlayer, setCurrentPlayer] = useState('player');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [message, setMessage] = useState('');
  const [showBotCards, setShowBotCards] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (currentPlayer === 'bot' && !gameOver) {
      setTimeout(handleBotTurn, 1000);
    }
  }, [currentPlayer, gameOver]);

  const startNewGame = () => {
    const newDeck = initializeDeck();
    const { playerCards, botCards, remainingDeck } = dealCards(newDeck);
    
    setPlayerHand(playerCards);
    setBotHand(botCards);
    setDeck(remainingDeck);
    setCommunityCards([]);
    setCurrentBet(0);
    setPlayerBet(0);
    setBotBet(0);
    setPot(0);
    setGamePhase('preflop');
    setCurrentPlayer('player');
    setGameOver(false);
    setWinner('');
    setMessage('New game started! Make your move.');
    setShowBotCards(false);
  };

  const handleBotTurn = () => {
    const action = getBotAction(botHand, communityCards, currentBet, pot, botChips);
    
    switch (action) {
      case 'call':
        botCall();
        break;
      case 'raise':
        botRaise();
        break;
      case 'bet':
        handleBotBet();  // ✅ Updated function name
        break;
      case 'check':
        botCheck();
        break;
      default:
        botCheck();
    }
  };
  
  

  const botCall = () => {
    if (currentBet > botBet) {
      const callAmount = Math.min(currentBet - botBet, botChips);
      setBotBet(prev => prev + callAmount);
      setBotChips(prev => prev - callAmount);
      setPot(prev => prev + callAmount);
      setMessage(`Bot calls $${callAmount}`);
      checkForNextPhase();
    }
  };

  const botRaise = () => {
    const handStrength = evaluateHand(botHand, communityCards);
    const raiseAmount = getBotBetAmount(botChips, handStrength.rank);
    const totalBet = currentBet + raiseAmount;
    
    if (totalBet <= botChips + botBet) {
      const additionalAmount = totalBet - botBet;
      setBotBet(totalBet);
      setBotChips(prev => prev - additionalAmount);
      setPot(prev => prev + additionalAmount);
      setCurrentBet(totalBet);
      setMessage(`Bot raises to $${totalBet}`);
      setCurrentPlayer('player');
    } else {
      botCall();
    }
  };

  const handleBotBet = () => {
    const handStrength = evaluateHand(botHand, communityCards);
    const betAmount = getBotBetAmount(botChips, handStrength.rank);
    
    if (betAmount <= botChips) {
      setBotBet(betAmount);
      setBotChips(prev => prev - betAmount);
      setPot(prev => prev + betAmount);
      setCurrentBet(betAmount);
      setMessage(`Bot bets $${betAmount}`);
      setCurrentPlayer('player');
    } else {
      botCheck();
    }
  };
  

  const botCheck = () => {
    setMessage('Bot checks');
    checkForNextPhase();
  };

  const playerCall = () => {
    if (currentBet > playerBet) {
      const callAmount = Math.min(currentBet - playerBet, playerChips);
      setPlayerBet(prev => prev + callAmount);
      setPlayerChips(prev => prev - callAmount);
      setPot(prev => prev + callAmount);
      setMessage(`You call $${callAmount}`);
      checkForNextPhase();
    }
  };

  const playerRaise = () => {
    const raiseAmount = 50;
    const totalBet = currentBet + raiseAmount;
    
    if (totalBet <= playerChips + playerBet) {
      const additionalAmount = totalBet - playerBet;
      setPlayerBet(totalBet);
      setPlayerChips(prev => prev - additionalAmount);
      setPot(prev => prev + additionalAmount);
      setCurrentBet(totalBet);
      setMessage(`You raise to $${totalBet}`);
      setCurrentPlayer('bot');
    }
  };

  const handlePlayerBet = () => {
    const betAmount = 25;
    if (betAmount <= playerChips) {
      setPlayerBet(betAmount);
      setPlayerChips(prev => prev - betAmount);
      setPot(prev => prev + betAmount);
      setCurrentBet(betAmount);
      setMessage(`You bet $${betAmount}`);
      setCurrentPlayer('bot');
    }
  };
  
  const playerCheck = () => {
    setMessage('You check');
    checkForNextPhase();
  };

  const playerFold = () => {
    setMessage('You fold. Bot wins!');
    setBotChips(prev => prev + pot);
    setPot(0);
    setGameOver(true);
    setWinner('Bot');
    setShowBotCards(true);
  };

  const checkForNextPhase = () => {
    if (playerBet === botBet && currentBet === playerBet) {
      proceedToNextPhase();
    } else {
      setCurrentPlayer(currentPlayer === 'player' ? 'bot' : 'player');
    }
  };

  const proceedToNextPhase = () => {
    switch (gamePhase) {
      case 'preflop':
        dealFlop();
        break;
      case 'flop':
        dealTurn();
        break;
      case 'turn':
        dealRiver();
        break;
      case 'river':
        showdown();
        break;
      default:
        break;
    }
  };

  const dealFlop = () => {
    const newCommunityCards = [];
    let currentDeck = [...deck];
    
    for (let i = 0; i < 3; i++) {
      const { card, remainingDeck } = dealCommunityCard(currentDeck);
      newCommunityCards.push(card);
      currentDeck = remainingDeck;
    }
    
    setCommunityCards(newCommunityCards);
    setDeck(currentDeck);
    setGamePhase('flop');
    setCurrentBet(0);
    setPlayerBet(0);
    setBotBet(0);
    setCurrentPlayer('player');
    setMessage('Flop dealt!');
  };

  const dealTurn = () => {
    const { card, remainingDeck } = dealCommunityCard(deck);
    setCommunityCards(prev => [...prev, card]);
    setDeck(remainingDeck);
    setGamePhase('turn');
    setCurrentBet(0);
    setPlayerBet(0);
    setBotBet(0);
    setCurrentPlayer('player');
    setMessage('Turn dealt!');
  };

  const dealRiver = () => {
    const { card, remainingDeck } = dealCommunityCard(deck);
    setCommunityCards(prev => [...prev, card]);
    setDeck(remainingDeck);
    setGamePhase('river');
    setCurrentBet(0);
    setPlayerBet(0);
    setBotBet(0);
    setCurrentPlayer('player');
    setMessage('River dealt!');
  };


  const showdown = () => {
    const playerHandStrength = evaluateHand(playerHand, communityCards);
    const botHandStrength = evaluateHand(botHand, communityCards);
    
    setShowBotCards(true);
    
    const comparison = compareHands(playerHandStrength, botHandStrength);
    
    if (comparison > 0) {
      setWinner('Player');
      setPlayerChips(prev => prev + pot);
      setMessage(`You win with ${playerHandStrength.name}! ${getDetailedHandDescription(playerHandStrength)}`);
    } else if (comparison < 0) {
      setWinner('Bot');
      setBotChips(prev => prev + pot);
      setMessage(`Bot wins with ${botHandStrength.name}! ${getDetailedHandDescription(botHandStrength)}`);
    } else {
      setWinner('Tie');
      setPlayerChips(prev => prev + Math.floor(pot / 2));
      setBotChips(prev => prev + Math.floor(pot / 2));
      setMessage(`It's a tie! Both have ${playerHandStrength.name}`);
    }
    
    setPot(0);
    setGameOver(true);
  };
  
  // Enhanced hand description
  const getDetailedHandDescription = (hand) => {
    const getCardName = (value) => {
      if (value === 14) return 'Ace';
      if (value === 13) return 'King';
      if (value === 12) return 'Queen';
      if (value === 11) return 'Jack';
      return value.toString();
    };
  
    switch (hand.rank) {
      case 2: // One Pair
        const kickers = hand.kickers.map(k => getCardName(k)).join(', ');
        return `(${getCardName(hand.value)}s with ${kickers} kicker${hand.kickers.length > 1 ? 's' : ''})`;
      case 3: // Two Pair
        return `(${getCardName(hand.value)}s and ${getCardName(hand.kickers[0])}s with ${getCardName(hand.kickers[1])} kicker)`;
      case 4: // Three of a Kind
        const threeKickers = hand.kickers.map(k => getCardName(k)).join(', ');
        return `(${getCardName(hand.value)}s with ${threeKickers} kicker${hand.kickers.length > 1 ? 's' : ''})`;
      case 6: // Flush
        return `(${getCardName(hand.value)} high)`;
      case 7: // Full House
        return `(${getCardName(hand.value)}s full of ${getCardName(hand.kickers[0])}s)`;
      case 8: // Four of a Kind
        return `(${getCardName(hand.value)}s)`;
      default:
        return hand.value ? `(${getCardName(hand.value)} high)` : '';
    }
  };
  
  const canCheck = currentBet === 0 || currentBet === playerBet;
  const canCall = currentBet > playerBet;
  const canRaise = currentBet > 0;
  const canBet = currentBet === 0;

  return (
    <div className="poker-game">
      <div className="game-header">
        <h1>Texas Hold'em Poker</h1>
        <ChipCounter playerChips={playerChips} botChips={botChips} pot={pot} />
      </div>
      
      <div className="game-status">
        <p>{message}</p>
        <p>Phase: {gamePhase} | Current Player: {currentPlayer}</p>
        {gameOver && (
          <button onClick={startNewGame} className="new-game-btn">
            New Game
          </button>
        )}
      </div>
      
      <div className="game-board">
        <BotHand hand={botHand} showCards={showBotCards} />
        <CommunityCards cards={communityCards} />
        <PlayerHand hand={playerHand} />
      </div>
      
    <ActionButtons 
  onCall={playerCall}
  onRaise={playerRaise}
  onFold={playerFold}
  onCheck={playerCheck}
  onBet={handlePlayerBet}  // ✅ Updated function name
  disabled={currentPlayer !== 'player' || gameOver}
  canCheck={canCheck}
  canCall={canCall}
  canRaise={canRaise}
  canBet={canBet}
  currentBet={currentBet}
/>

    </div>
  );
};

export default PokerGame;
