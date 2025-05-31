import React from 'react';
import Card from './Card';

const CommunityCards = ({ cards }) => {
  return (
    <div className="community-cards">
      <h3>Community Cards</h3>
      <div className="cards-container">
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
        {/* Show placeholder for remaining cards */}
        {Array.from({ length: 5 - cards.length }).map((_, index) => (
          <div key={`placeholder-${index}`} className="card-placeholder">
            ?
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityCards;
