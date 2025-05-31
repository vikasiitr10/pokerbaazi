import React from 'react';

const Card = ({ card, hidden = false }) => {
  if (hidden) {
    return (
      <div className="card card-hidden">
        <div className="card-back">🂠</div>
      </div>
    );
  }

  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  return (
    <div className={`card ${getSuitColor(card.suit)}`}>
      <div className="card-rank">{card.rank}</div>
      <div className="card-suit">{getSuitSymbol(card.suit)}</div>
    </div>
  );
};

export default Card;
