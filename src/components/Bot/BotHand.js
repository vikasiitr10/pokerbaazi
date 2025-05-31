import React from 'react';
import Card from '../Cards/Card';

const BotHand = ({ hand, showCards = false }) => {
  return (
    <div className="bot-hand">
      <h3>Bot's Hand</h3>
      <div className="cards-container">
        {hand.map((card, index) => (
          <Card key={index} card={card} hidden={!showCards} />
        ))}
      </div>
    </div>
  );
};

export default BotHand;
