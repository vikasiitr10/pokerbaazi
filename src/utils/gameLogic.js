// Card suits and ranks
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const initializeDeck = () => {
  const deck = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({ suit, rank, value: getRankValue(rank) });
    });
  });
  return shuffleDeck(deck);
};

const getRankValue = (rank) => {
  if (rank === 'A') return 14;
  if (rank === 'K') return 13;
  if (rank === 'Q') return 12;
  if (rank === 'J') return 11;
  return parseInt(rank);
};

const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealCards = (deck) => {
  const newDeck = [...deck];
  const playerCards = [newDeck.pop(), newDeck.pop()];
  const botCards = [newDeck.pop(), newDeck.pop()];
  return { playerCards, botCards, remainingDeck: newDeck };
};

export const dealCommunityCard = (deck) => {
  const newDeck = [...deck];
  const card = newDeck.pop();
  return { card, remainingDeck: newDeck };
};
