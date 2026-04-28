'use client';

import { motion } from 'motion/react';
import { Card, Suit } from '@/lib/poker/types';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card?: Card; // If undefined, show back
  className?: string;
  isFolded?: boolean;
}

export const PlayingCard = ({ card, className, isFolded }: PlayingCardProps) => {
  const getSuitSymbol = (suit: Suit) => {
    switch (suit) {
      case Suit.Hearts: return '♥';
      case Suit.Diamonds: return '♦';
      case Suit.Clubs: return '♣';
      case Suit.Spades: return '♠';
    }
  };

  const getSuitColor = (suit: Suit) => {
    return (suit === Suit.Hearts || suit === Suit.Diamonds) ? 'text-red-500' : 'text-slate-900';
  };

  const getRankLabel = (rank: number) => {
    if (rank <= 10) return rank.toString();
    const map: { [key: number]: string } = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };
    return map[rank];
  };

  if (!card) {
    return (
      <motion.div
        initial={{ scale: 0, rotateY: 180 }}
        animate={{ scale: 1, rotateY: 0 }}
        className={cn(
          "w-12 h-16 md:w-16 md:h-24 bg-indigo-800 rounded-lg border-2 border-white/20 shadow-xl flex items-center justify-center overflow-hidden",
          "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-700 to-indigo-900",
          className
        )}
      >
        <div className="w-full h-full border-4 border-white/10 m-1 rounded-md flex items-center justify-center">
          <div className="text-white/20 text-4xl">♠</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, y: 50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: isFolded ? 0.3 : 1 }}
      className={cn(
        "w-12 h-16 md:w-16 md:h-24 bg-white rounded-lg shadow-lg flex flex-col p-1 relative select-none",
        isFolded && "grayscale opacity-50",
        className
      )}
    >
      <div className={cn("text-xs md:text-sm font-bold leading-none", getSuitColor(card.suit))}>
        {getRankLabel(card.rank)}
      </div>
      <div className={cn("text-[10px] md:text-xs leading-none", getSuitColor(card.suit))}>
        {getSuitSymbol(card.suit)}
      </div>
      
      <div className={cn("absolute inset-0 flex items-center justify-center text-xl md:text-3xl", getSuitColor(card.suit))}>
        {getSuitSymbol(card.suit)}
      </div>

      <div className={cn("mt-auto self-end rotate-180 flex flex-col items-end", getSuitColor(card.suit))}>
         <div className="text-xs md:text-sm font-bold leading-none">{getRankLabel(card.rank)}</div>
         <div className="text-[10px] md:text-xs leading-none">{getSuitSymbol(card.suit)}</div>
      </div>
    </motion.div>
  );
};
