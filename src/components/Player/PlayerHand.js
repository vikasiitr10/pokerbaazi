import React from 'react';
import Card from '../Cards/Card';

const PlayerHand = ({ hand }) => {
  return (
    <div className="player-hand">
      <h3>Your Hand</h3>
      <div className="cards-container">
        {hand.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
