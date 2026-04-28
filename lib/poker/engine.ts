import { Card, CardRank, GameStage, GameState, Player, PlayerStatus, Suit } from "./types";

export function createDeck(): Card[] {
  const suits = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];
  const ranks = Object.values(CardRank);
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return shuffle(deck);
}

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function createInitialState(players: Player[]): GameState {
  return {
    players: players.map(p => ({ ...p, status: PlayerStatus.Playing, bet: 0, cards: [] })),
    pot: 0,
    communityCards: [],
    stage: GameStage.PreFlop,
    currentBet: 0,
    actingIndex: 0,
    dealerIndex: 0,
    deck: createDeck(),
  };
}

export function startHand(state: GameState): GameState {
  const deck = createDeck();
  const nextDealer = (state.dealerIndex + 1) % state.players.length;
  const players = state.players.map((p, i) => ({
    ...p,
    status: p.chips > 0 ? PlayerStatus.Playing : PlayerStatus.Out,
    bet: 0,
    cards: [deck.pop()!, deck.pop()!],
  }));

  return {
    ...state,
    deck,
    players,
    communityCards: [],
    pot: 0,
    stage: GameStage.PreFlop,
    currentBet: 20, // Example Big Blind
    actingIndex: (nextDealer + 3) % players.length,
    dealerIndex: nextDealer,
  };
}

export function processAction(state: GameState, action: { type: string; amount?: number }): GameState {
  // Mock logic for demo purposes
  const newState = { ...state };
  const player = newState.players[newState.actingIndex];

  if (action.type === 'fold') {
    player.status = PlayerStatus.Folded;
  } else if (action.type === 'call') {
     const callAmount = newState.currentBet - player.bet;
     player.chips -= callAmount;
     player.bet += callAmount;
     newState.pot += callAmount;
  } else if (action.type === 'raise') {
     const raiseAmount = (action.amount || 0) + (newState.currentBet - player.bet);
     player.chips -= raiseAmount;
     player.bet += raiseAmount;
     newState.pot += raiseAmount;
     newState.currentBet = player.bet;
  }

  // Next player
  let nextIdx = (newState.actingIndex + 1) % newState.players.length;
  while (newState.players[nextIdx].status !== PlayerStatus.Playing && nextIdx !== newState.actingIndex) {
    nextIdx = (nextIdx + 1) % newState.players.length;
  }
  newState.actingIndex = nextIdx;

  // Simple stage progression logic... 
  // (In a real app, track if everyone matched current bet)
  if (nextIdx === (newState.dealerIndex + 1) % newState.players.length) {
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
        newState.stage = GameStage.Showdown;
        // Winner logic mock
        newState.winners = [{ playerId: newState.players[0].id, amount: newState.pot, hand: 'Full House' }];
     }
  }

  return newState;
}
