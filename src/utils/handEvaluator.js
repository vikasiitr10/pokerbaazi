// Helper functions (keep existing ones and add these)
const getCombinations = (arr, k) => {
    if (k === 1) return arr.map(el => [el]);
    const combinations = [];
    arr.forEach((el, i) => {
      const rest = arr.slice(i + 1);
      const restCombinations = getCombinations(rest, k - 1);
      restCombinations.forEach(combo => {
        combinations.push([el, ...combo]);
      });
    });
    return combinations;
  };
  
  const checkStraight = (values) => {
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] - values[i + 1] !== 1) {
        if (values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2) {
          return true;
        }
        return false;
      }
    }
    return true;
  };
  
  const getValueCounts = (values) => {
    const counts = {};
    values.forEach(value => {
      counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  };
  
  // IMPROVED: Better hand ranking with proper kicker handling
  const getHandRank = (cards) => {
    const sortedCards = cards.sort((a, b) => b.value - a.value);
    const values = sortedCards.map(card => card.value);
    const suits = sortedCards.map(card => card.suit);
    
    const isFlush = suits.every(suit => suit === suits[0]);
    const isStraight = checkStraight(values);
    const valueCounts = getValueCounts(values);
    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    
    // Sort values by count first, then by card value
    const sortedByCount = Object.keys(valueCounts)
      .map(k => parseInt(k))
      .sort((a, b) => {
        const countDiff = valueCounts[b] - valueCounts[a];
        if (countDiff !== 0) return countDiff;
        return b - a; // Higher card value wins if same count
      });
  
    // Royal Flush
    if (isFlush && isStraight && values[0] === 14 && values[4] === 10) {
      return { rank: 10, name: 'Royal Flush', value: 14, kickers: [], cards: sortedCards };
    }
    
    // Straight Flush
    if (isFlush && isStraight) {
      const straightHigh = values[0] === 14 && values[1] === 5 ? 5 : values[0];
      return { rank: 9, name: 'Straight Flush', value: straightHigh, kickers: [], cards: sortedCards };
    }
    
    // Four of a Kind
    if (counts[0] === 4) {
      const fourValue = sortedByCount[0];
      const kicker = sortedByCount[1];
      return { rank: 8, name: 'Four of a Kind', value: fourValue, kickers: [kicker], cards: sortedCards };
    }
    
    // Full House
    if (counts[0] === 3 && counts[1] === 2) {
      const threeValue = sortedByCount[0];
      const pairValue = sortedByCount[1];
      return { rank: 7, name: 'Full House', value: threeValue, kickers: [pairValue], cards: sortedCards };
    }
    
    // Flush
    if (isFlush) {
      return { rank: 6, name: 'Flush', value: values[0], kickers: values.slice(1, 5), cards: sortedCards };
    }
    
    // Straight
    if (isStraight) {
      const straightHigh = values[0] === 14 && values[1] === 5 ? 5 : values[0];
      return { rank: 5, name: 'Straight', value: straightHigh, kickers: [], cards: sortedCards };
    }
    
    // Three of a Kind
    if (counts[0] === 3) {
      const threeValue = sortedByCount[0];
      const kickers = sortedByCount.slice(1, 3); // Top 2 kickers
      return { rank: 4, name: 'Three of a Kind', value: threeValue, kickers: kickers, cards: sortedCards };
    }
    
    // Two Pair
    if (counts[0] === 2 && counts[1] === 2) {
      const highPair = sortedByCount[0];
      const lowPair = sortedByCount[1];
      const kicker = sortedByCount[2];
      return { rank: 3, name: 'Two Pair', value: highPair, kickers: [lowPair, kicker], cards: sortedCards };
    }
    
    // One Pair
    if (counts[0] === 2) {
      const pairValue = sortedByCount[0];
      const kickers = sortedByCount.slice(1, 4); // Top 3 kickers
      return { rank: 2, name: 'One Pair', value: pairValue, kickers: kickers, cards: sortedCards };
    }
    
    // High Card
    return { rank: 1, name: 'High Card', value: values[0], kickers: values.slice(1, 5), cards: sortedCards };
  };
  
  // IMPROVED: Enhanced hand comparison
  export const compareHands = (hand1, hand2) => {
    // First compare by rank (pair vs high card, etc.)
    if (hand1.rank !== hand2.rank) {
      return hand1.rank - hand2.rank;
    }
    
    // Same rank, compare by primary value (pair value, three of a kind value, etc.)
    if (hand1.value !== hand2.value) {
      return hand1.value - hand2.value;
    }
    
    // Same primary value, compare all kickers in order
    const maxKickers = Math.max(hand1.kickers.length, hand2.kickers.length);
    for (let i = 0; i < maxKickers; i++) {
      const kicker1 = hand1.kickers[i] || 0;
      const kicker2 = hand2.kickers[i] || 0;
      if (kicker1 !== kicker2) {
        return kicker1 - kicker2;
      }
    }
    
    return 0; // True tie
  };
  
  export const evaluateHand = (hand, communityCards) => {
    const allCards = [...hand, ...communityCards];
    if (allCards.length < 5) return { rank: 0, name: 'High Card', value: 0, kickers: [] };
  
    const combinations = getCombinations(allCards, 5);
    let bestHand = { rank: 0, name: 'High Card', cards: [], value: 0, kickers: [] };
  
    combinations.forEach(combo => {
      const handRank = getHandRank(combo);
      if (compareHands(handRank, bestHand) > 0) {
        bestHand = handRank;
      }
    });
  
    return bestHand;
  };
  