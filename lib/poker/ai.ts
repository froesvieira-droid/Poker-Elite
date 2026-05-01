import { Card, CardRank, GameStage, GameState, Player, PlayerStatus } from './types';
import { evaluateHand } from './utils';
import { MAX_RAISES } from './engine';

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
 * Calculates current hand strength (0 to 1) based on known cards.
 */
function evaluateHandStrength(cards: Card[], communityCards: Card[]): number {
  if (communityCards.length === 0) {
    // Pre-flop: use simplified pocket strength
    const r1 = cards[0].rank;
    const r2 = cards[1].rank;
    const isPair = r1 === r2;
    const highCard = Math.max(r1, r2);
    
    if (isPair) return 0.6 + (highCard / 30);
    return (highCard / 20);
  }

  const evalResult = evaluateHand([...cards, ...communityCards]);
  // rank is from 0 (High Card) to 9 (Royal Flush)
  // map to 0.1 - 1.0 range
  return (evalResult.rank + 1) / 10;
}

export function getAiAction(state: GameState, playerIdx: number, difficulty: Difficulty = Difficulty.Medium): AiAction {
  const player = state.players[playerIdx];
  const strength = evaluateHandStrength(player.cards, state.communityCards);
  
  // Basic attributes based on difficulty
  let bluffFreq = 0.05;
  let aggression = 0.5;
  let passivity = 0.2;

  if (difficulty === Difficulty.Easy) {
    bluffFreq = 0.02;
    aggression = 0.4;
    passivity = 0.4;
  } else if (difficulty === Difficulty.Hard) {
    bluffFreq = 0.12;
    aggression = 0.7;
    passivity = 0.1;
  }

  const rand = Math.random();
  const amountToCall = state.currentBet - player.bet;
  
  // If we can check, check more often if hand is weak
  const canCheck = amountToCall === 0;

  // BLUFF logic
  if (rand < bluffFreq && state.stage !== GameStage.River && player.raisesThisRound < MAX_RAISES) {
     return { type: 'raise', amount: state.currentBet + 100 };
  }

  // DECISION MATRIX
  if (strength > aggression && player.raisesThisRound < MAX_RAISES) {
    // Raise
    const raiseAmt = 100 * Math.ceil((strength * 5));
    const finalAmount = Math.min(player.chips + player.bet, state.currentBet + raiseAmt);
    // Only raise if it's actually more than currently bet
    if (finalAmount > state.currentBet) {
      return { type: 'raise', amount: finalAmount };
    }
    return { type: 'call' };
  } else if (strength > passivity || canCheck) {
    // Call/Check
    return { type: 'call' };
  } else {
    // Fold
    return { type: 'fold' };
  }
}

