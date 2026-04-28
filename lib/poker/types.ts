export enum Suit {
  Hearts = 'H',
  Diamonds = 'D',
  Clubs = 'C',
  Spades = 'S'
}

export enum CardRank {
  Two = '2', Three = '3', Four = '4', Five = '5', Six = '6', Seven = '7', Eight = '8', Nine = '9', Ten = 'T',
  Jack = 'J', Queen = 'Q', King = 'K', Ace = 'A'
}

export interface Card {
  suit: Suit;
  rank: CardRank;
}

export enum PlayerStatus {
  Waiting = 'waiting',
  Playing = 'playing',
  Folded = 'folded',
  AllIn = 'allin',
  Out = 'out'
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  chips: number;
  status: PlayerStatus;
  isDealer: boolean;
  cards: Card[];
  bet: number;
  lastAction?: string;
}

export enum GameStage {
  PreFlop = 'preflop',
  Flop = 'flop',
  Turn = 'turn',
  River = 'river',
  Showdown = 'showdown'
}

export interface GameState {
  players: Player[];
  pot: number;
  communityCards: Card[];
  stage: GameStage;
  currentBet: number;
  actingIndex: number;
  dealerIndex: number;
  deck: Card[];
  winners?: { playerId: string; amount: number; hand: string }[];
}
