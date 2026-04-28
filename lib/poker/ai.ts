import { Card, GameStage, GameState, Player, PlayerStatus } from './types';
// @ts-ignore
import { Hand } from 'pokersolver';

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard'
}

interface AiAction {
  type: 'fold' | 'call' | 'raise';
  amount?: number;
}

/**
 * Converts our Card type to pokersolver string format (e.g. {rank: 'A', suit: 'H'} -> 'Ah')
 */
function toSolverFormat(card: Card): string {
  const suitMap: Record<string, string> = { 'H': 'h', 'D': 'd', 'C': 'c', 'S': 's' };
  return `${card.rank}${suitMap[card.suit]}`;
}

/**
 * Calculates current hand strength (0 to 1) based on known cards.
 * This is a simplified heuristic.
 */
function evaluateHandStrength(cards: Card[], communityCards: Card[]): number {
  const combined = [...cards, ...communityCards].map(toSolverFormat);
  if (combined.length < 5) {
    // Pre-flop or partial flop: use simplified pocket strength
    if (cards.length === 2) {
       const r1 = cards[0].rank;
       const r2 = cards[1].rank;
       const isPairPkt = r1 === r2;
       const highCard = ['A', 'K', 'Q', 'J', 'T'].includes(r1) || ['A', 'K', 'Q', 'J', 'T'].includes(r2);
       
       if (isPairPkt) return 0.7 + (ranks.indexOf(r1) / 20);
       if (highCard) return 0.5;
       return 0.3;
    }
    return 0.2;
  }

  try {
    const solved = Hand.solve(combined);
    // Solved hands have a 'rank' property or similar, but let's use the name of the hand
    // to give a score.
    const handScores: Record<string, number> = {
      'High Card': 0.1,
      'Pair': 0.2,
      'Two Pair': 0.4,
      'Three of a Kind': 0.6,
      'Straight': 0.7,
      'Flush': 0.8,
      'Full House': 0.9,
      'Four of a Kind': 0.95,
      'Straight Flush': 0.99,
      'Royal Flush': 1.0
    };
    return handScores[solved.name] || 0.1;
  } catch (e) {
    return 0.1;
  }
}

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export function getAiAction(state: GameState, playerIdx: number, difficulty: Difficulty = Difficulty.Medium): AiAction {
  const player = state.players[playerIdx];
  const strength = evaluateHandStrength(player.cards, state.communityCards);
  
  // Basic attributes based on difficulty
  let bluffFreq = 0.05; // 5% base
  let aggression = 0.5; // multiplier for strength to decide raise
  let passivity = 0.3; // threshold to fold early

  if (difficulty === Difficulty.Easy) {
    bluffFreq = 0.02;
    aggression = 0.3;
    passivity = 0.5; // folds easier
  } else if (difficulty === Difficulty.Hard) {
    bluffFreq = 0.15;
    aggression = 0.8;
    passivity = 0.2; // tighter but more aggressive
  }

  const rand = Math.random();
  const potOdds = state.pot > 0 ? (state.currentBet - player.bet) / state.pot : 0;
  
  // BLUFF logic
  if (rand < bluffFreq && state.stage !== GameStage.River) {
     return { type: 'raise', amount: state.currentBet + 100 };
  }

  // Adjusted strength based on pot odds
  const effectiveStrength = strength + (potOdds * 0.2);

  // DECISION MATRIX
  if (effectiveStrength > aggression) {
    // Raise
    const raiseAmt = 100 * Math.ceil((strength * 5) / 1);
    const finalAmount = Math.min(player.chips, state.currentBet + raiseAmt);
    return { type: 'raise', amount: finalAmount };
  } else if (effectiveStrength > passivity) {
    // Call/Check
    return { type: 'call' };
  } else {
    // Fold (but Check if possible)
    if (player.bet >= state.currentBet) return { type: 'call' }; // Check
    return { type: 'fold' };
  }
}
