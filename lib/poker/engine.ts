import { Card, CardRank, GameStage, GameState, Player, PlayerStatus, Suit } from "./types";
import { createDeck, shuffleDeck, evaluateHand } from "./utils";

export const MAX_RAISES = 2;

export function createInitialState(players: Player[]): GameState {
  return {
    players: players.map(p => ({ ...p, status: PlayerStatus.Playing, bet: 0, cards: [], raisesThisRound: 0 })),
    pot: 0,
    communityCards: [],
    stage: GameStage.PreFlop,
    currentBet: 0,
    actingIndex: 0,
    dealerIndex: -1, // Will be incremented on startHand
    deck: [],
  };
}

export function startHand(state: GameState): GameState {
  const deck = shuffleDeck(createDeck());
  const nextDealer = (state.dealerIndex + 1) % state.players.length;
  
  // Blinds
  const sbIndex = (nextDealer + 1) % state.players.length;
  const bbIndex = (nextDealer + 2) % state.players.length;
  const sbAmount = 10;
  const bbAmount = 20;

  const players = state.players.map((p, i) => {
    let bet = 0;
    let chips = p.chips;
    
    if (i === sbIndex) {
      bet = Math.min(chips, sbAmount);
      chips -= bet;
    } else if (i === bbIndex) {
      bet = Math.min(chips, bbAmount);
      chips -= bet;
    }

    return {
      ...p,
      status: p.chips > 0 ? PlayerStatus.Playing : PlayerStatus.Out,
      bet,
      chips,
      cards: [deck.pop()!, deck.pop()!],
      isDealer: i === nextDealer,
      raisesThisRound: 0
    };
  });

  return {
    ...state,
    deck,
    players,
    communityCards: [],
    pot: players.reduce((sum, p) => sum + p.bet, 0),
    stage: GameStage.PreFlop,
    currentBet: bbAmount,
    actingIndex: (nextDealer + 3) % players.length,
    dealerIndex: nextDealer,
    winners: undefined,
  };
}

export function processAction(state: GameState, action: { type: string; amount?: number }): GameState {
  let newState = { ...state };
  let player = newState.players[newState.actingIndex];

  // Apply action
  if (action.type === 'fold') {
    player.status = PlayerStatus.Folded;
  } else if (action.type === 'call') {
     const callAmount = newState.currentBet - player.bet;
     const actualCall = Math.min(player.chips, callAmount);
     player.chips -= actualCall;
     player.bet += actualCall;
     newState.pot += actualCall;
  } else if (action.type === 'raise') {
     if (player.raisesThisRound >= MAX_RAISES) {
       // Force a call if max raises reached
       const callAmount = newState.currentBet - player.bet;
       const actualCall = Math.min(player.chips, callAmount);
       player.chips -= actualCall;
       player.bet += actualCall;
       newState.pot += actualCall;
     } else {
       const totalBet = (action.amount || 0);
       const raiseAmount = totalBet - player.bet;
       const actualRaise = Math.min(player.chips, raiseAmount);
       player.chips -= actualRaise;
       player.bet += actualRaise;
       newState.pot += actualRaise;
       newState.currentBet = player.bet;
       player.raisesThisRound += 1;
     }
  }

  // Check if round is over
  if (isRoundOver(newState)) {
    newState = advanceStage(newState);
  } else {
    // Next player
    newState.actingIndex = getNextActingIndex(newState);
  }

  return newState;
}

function isRoundOver(state: GameState): boolean {
  const activePlayers = state.players.filter(p => p.status === PlayerStatus.Playing);
  if (activePlayers.length <= 1) return true;

  // Everyone has acted and matched the current bet (or is all-in)
  return activePlayers.every(p => p.bet === state.currentBet || p.chips === 0);
}

function getNextActingIndex(state: GameState): number {
  let idx = (state.actingIndex + 1) % state.players.length;
  let count = 0;
  while (state.players[idx].status !== PlayerStatus.Playing && count < state.players.length) {
    idx = (idx + 1) % state.players.length;
    count++;
  }
  return idx;
}

function advanceStage(state: GameState): GameState {
  const newState = { ...state };
  
  // Reset bets for new stage
  newState.players = newState.players.map(p => ({ ...p, bet: 0, raisesThisRound: 0 }));
  newState.currentBet = 0;

  // Check if only one player left
  const activePlayers = newState.players.filter(p => p.status === PlayerStatus.Playing);
  if (activePlayers.length <= 1) {
    return determineWinner(newState);
  }

  if (newState.stage === GameStage.PreFlop) {
    newState.stage = GameStage.Flop;
    newState.communityCards = [newState.deck.pop()!, newState.deck.pop()!, newState.deck.pop()!];
  } else if (newState.stage === GameStage.Flop) {
    newState.stage = GameStage.Turn;
    newState.communityCards.push(newState.deck.pop()!);
  } else if (newState.stage === GameStage.Turn) {
    newState.stage = GameStage.River;
    newState.communityCards.push(newState.deck.pop()!);
  } else if (newState.stage === GameStage.River) {
    return determineWinner(newState);
  }

  // First player to act after dealer
  newState.actingIndex = getNextActingIndex({ ...newState, actingIndex: newState.dealerIndex });

  return newState;
}

function determineWinner(state: GameState): GameState {
  const newState = { ...state };
  newState.stage = GameStage.Showdown;

  const activePlayers = newState.players.filter(p => p.status === PlayerStatus.Playing);
  
  if (activePlayers.length === 1) {
    const winner = activePlayers[0];
    winner.chips += newState.pot;
    newState.winners = [{ playerId: winner.id, amount: newState.pot, hand: 'Folded' }];
    return newState;
  }

  // Compare hands
  const evaluations = activePlayers.map(p => ({
    player: p,
    eval: evaluateHand([...p.cards, ...newState.communityCards])
  }));

  evaluations.sort((a, b) => {
     if (b.eval.rank !== a.eval.rank) return b.eval.rank - a.eval.rank;
     return b.eval.score - a.eval.score;
  });

  const topEval = evaluations[0].eval;
  const winners = evaluations.filter(e => e.eval.rank === topEval.rank && e.eval.score === topEval.score);
  
  const winAmount = Math.floor(newState.pot / winners.length);
  newState.winners = winners.map(w => {
    w.player.chips += winAmount;
    return {
      playerId: w.player.id,
      amount: winAmount,
      hand: getHandRankName(w.eval.rank)
    };
  });

  return newState;
}

function getHandRankName(rank: number): string {
  const names = ['Carta Alta', 'Um Par', 'Dois Pares', 'Trinca', 'Sequência', 'Flush', 'Full House', 'Quadra', 'Straight Flush', 'Royal Flush'];
  return names[rank] || 'Mão';
}

