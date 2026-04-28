import { GameState, Player, HandRank } from './types';
import { evaluateHand } from './utils';

export const getBotAction = (state: GameState, botIndex: number): { type: 'fold' | 'call' | 'raise', amount?: number } => {
  const bot = state.players[botIndex];
  const handEval = evaluateHand([...bot.cards, ...state.communityCards]);
  const callAmount = state.currentBet - bot.bet;
  
  // Hand strength 0-1
  let strength = handEval.rank / HandRank.RoyalFlush;
  if (state.stage === 'pre-flop') {
    // Basic hole card evaluation
    const sorted = [...bot.cards].sort((a,b) => b.rank - a.rank);
    const isPair = sorted[0].rank === sorted[1].rank;
    const highCardSum = sorted[0].rank + sorted[1].rank;
    strength = isPair ? 0.6 + (sorted[0].rank / 20) : (highCardSum / 28) * 0.4;
  }

  const random = Math.random();

  if (strength > 0.8) {
    // Very strong
    if (random > 0.5) return { type: 'raise', amount: state.currentBet + state.bigBlind * 2 };
    return { type: 'call' };
  } else if (strength > 0.5) {
    // Good
    if (callAmount > bot.chips * 0.5) return { type: 'fold' };
    if (random > 0.8) return { type: 'raise', amount: state.currentBet + state.bigBlind };
    return { type: 'call' };
  } else if (strength > 0.3 || callAmount === 0) {
    // Weak but maybe call
    if (callAmount === 0) return { type: 'call' }; // Check
    if (callAmount > state.bigBlind * 2) return { type: 'fold' };
    if (random > 0.7) return { type: 'call' };
    return { type: 'fold' };
  } else {
    // Garbage
    if (callAmount === 0) return { type: 'call' }; // Check
    return { type: 'fold' };
  }
};
