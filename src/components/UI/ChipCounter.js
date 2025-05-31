import React from 'react';

const ChipCounter = ({ playerChips, botChips, pot }) => {
  return (
    <div className="chip-counter">
      <div className="chip-info">
        <span className="player-chips">Your Chips: ${playerChips}</span>
        <span className="pot">Pot: ${pot}</span>
        <span className="bot-chips">Bot Chips: ${botChips}</span>
      </div>
    </div>
  );
};

export default ChipCounter;
