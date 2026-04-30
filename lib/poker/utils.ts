import { Card, CardRank, Suit, HandRank, HandEvaluation } from './types';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const suits = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];
  const ranks = [
    CardRank.Two, CardRank.Three, CardRank.Four, CardRank.Five, CardRank.Six, CardRank.Seven,
    CardRank.Eight, CardRank.Nine, CardRank.Ten, CardRank.Jack, CardRank.Queen, CardRank.King, CardRank.Ace
  ];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const cardToString = (card: Card): string => {
  const rankNames: { [key: number]: string } = {
    11: 'J', 12: 'Q', 13: 'K', 14: 'A'
  };
  const r = rankNames[card.rank] || card.rank.toString();
  return `${r}${card.suit}`;
};

export const getRankLabel = (rank: CardRank): string => {
  if (rank <= 10) return rank.toString();
  const map: { [key: number]: string } = {
    11: 'J', 12: 'Q', 13: 'K', 14: 'A'
  };
  return map[rank] || rank.toString();
};

export const evaluateHand = (cards: Card[]): HandEvaluation => {
  // Simple poker hand evaluator
  // In a real app we'd use combinations, here we'll do a simplified version for now 
  // or use a strategy to find best 5 out of 7.
  
  if (cards.length < 5) {
    return { rank: HandRank.HighCard, score: 0, cards: [] };
  }

  // Helper to get all combinations of 5 from n cards
  const getCombinations = (arr: Card[], n: number): Card[][] => {
    if (n === 0) return [[]];
    if (arr.length === 0) return [];
    const first = arr[0];
    const rest = arr.slice(1);
    const combsWithFirst = getCombinations(rest, n - 1).map(c => [first, ...c]);
    const combsWithoutFirst = getCombinations(rest, n);
    return [...combsWithFirst, ...combsWithoutFirst];
  };

  const combinations = getCombinations(cards, 5);
  let bestHand: HandEvaluation = { rank: HandRank.HighCard, score: -1, cards: [] };

  for (const combo of combinations) {
    const evalResult = evaluateFiveCards(combo);
    if (evalResult.rank > bestHand.rank || (evalResult.rank === bestHand.rank && evalResult.score > bestHand.score)) {
      bestHand = evalResult;
    }
  }

  return bestHand;
};

const evaluateFiveCards = (cards: Card[]): HandEvaluation => {
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  const ranks = sorted.map(c => c.rank);
  const suits = sorted.map(c => c.suit);
  
  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = ranks.every((r, i) => i === 0 || r === ranks[i - 1] - 1) || 
                     (ranks[0] === CardRank.Ace && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2); // Ace low straight

  const counts: { [key: number]: number } = {};
  ranks.forEach(r => counts[r] = (counts[r] || 0) + 1);
  const countValues = Object.values(counts).sort((a, b) => b - a);
  const countRanks = Object.keys(counts).map(Number).sort((a, b) => {
    if (counts[b] !== counts[a]) return counts[b] - counts[a];
    return b - a;
  });

  let rank = HandRank.HighCard;
  let score = 0;

  // Calculate a base score for tie-breaking: sum of ranks weighted by significance
  const calcScore = (r: number[]) => r.reduce((acc, val, i) => acc + val * Math.pow(15, 4 - i), 0);

  if (isFlush && isStraight && ranks[0] === CardRank.Ace && ranks[1] === CardRank.King) {
    rank = HandRank.RoyalFlush;
  } else if (isFlush && isStraight) {
    rank = HandRank.StraightFlush;
  } else if (countValues[0] === 4) {
    rank = HandRank.FourOfAKind;
  } else if (countValues[0] === 3 && countValues[1] === 2) {
    rank = HandRank.FullHouse;
  } else if (isFlush) {
    rank = HandRank.Flush;
  } else if (isStraight) {
    rank = HandRank.Straight;
  } else if (countValues[0] === 3) {
    rank = HandRank.ThreeOfAKind;
  } else if (countValues[0] === 2 && countValues[1] === 2) {
    rank = HandRank.TwoPair;
  } else if (countValues[0] === 2) {
    rank = HandRank.Pair;
  } else {
    rank = HandRank.HighCard;
  }

  score = calcScore(countRanks);
  // Special case for Ace-low straight
  if (isStraight && ranks[0] === CardRank.Ace && ranks[1] === 5) {
     score = calcScore([5, 4, 3, 2, 14]); 
  }

  return { rank, score, cards: sorted };
};
