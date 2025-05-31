import { evaluateHand } from '../../utils/handEvaluator';

export const getBotAction = (botHand, communityCards, currentBet, pot, botChips) => {
  const botHandStrength = evaluateHand(botHand, communityCards);
  const handRank = botHandStrength ? botHandStrength.rank : 0;
  
  // Strong hands - raise aggressively
  if (handRank >= 6) {
    return Math.random() < 0.8 ? 'raise' : 'call';
  }
  
  // Medium to weak hands
  if (currentBet === 0) {
    return Math.random() < 0.6 ? 'bet' : 'check';
  } else {
    // Always call (never fold) to play every hand
    return 'call';
  }
};

export const getBotBetAmount = (botChips, handRank) => {
  const baseAmount = Math.min(25, Math.floor(botChips * 0.05));
  
  if (handRank >= 6) {
    return Math.min(baseAmount * 3, Math.floor(botChips * 0.15));
  }
  
  return baseAmount;
};
