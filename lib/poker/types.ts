export enum Suit {
  Hearts = 'H',
  Diamonds = 'D',
  Clubs = 'C',
  Spades = 'S'
}

export enum CardRank {
  Two = 2, Three = 3, Four = 4, Five = 5, Six = 6, Seven = 7, Eight = 8, Nine = 9, Ten = 10,
  Jack = 11, Queen = 12, King = 13, Ace = 14
}

export enum HandRank {
  HighCard = 0,
  Pair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  Straight = 4,
  Flush = 5,
  FullHouse = 6,
  FourOfAKind = 7,
  StraightFlush = 8,
  RoyalFlush = 9
}

export interface HandEvaluation {
  rank: HandRank;
  score: number;
  cards: Card[];
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
