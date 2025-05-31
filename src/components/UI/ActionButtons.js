import React from 'react';

const ActionButtons = ({ 
  onCall, 
  onRaise, 
  onFold, 
  onCheck, 
  onBet,
  disabled, 
  canCheck, 
  canCall, 
  canRaise,
  canBet,
  currentBet 
}) => {
  return (
    <div className="action-buttons">
      {canCheck && (
        <button 
          onClick={onCheck} 
          disabled={disabled}
          className="action-btn check-btn"
        >
          Check
        </button>
      )}
      
      {canBet && (
        <button 
          onClick={onBet} 
          disabled={disabled}
          className="action-btn bet-btn"
        >
          Bet
        </button>
      )}
      
      {canCall && (
        <button 
          onClick={onCall} 
          disabled={disabled}
          className="action-btn call-btn"
        >
          Call ${currentBet}
        </button>
      )}
      
      {canRaise && (
        <button 
          onClick={onRaise} 
          disabled={disabled}
          className="action-btn raise-btn"
        >
          Raise
        </button>
      )}
      
      <button 
        onClick={onFold} 
        disabled={disabled}
        className="action-btn fold-btn"
      >
        Fold
      </button>
    </div>
  );
};

export default ActionButtons;
