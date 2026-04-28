'use client';

import { motion } from 'motion/react';
import { GameState, GameStage, Card as CardType } from '@/lib/poker/types';
import { PlayerSeat } from './PlayerSeat';
import { cn } from '@/lib/utils';

export const PokerTable = ({ state, currentPlayerId }: { state: GameState, currentPlayerId: string }) => {
  return (
    <div className="relative w-full max-w-5xl aspect-[2/1] perspective-1000 flex items-center justify-center p-20">
      {/* Table Outer Rail */}
      <div className="absolute inset-0 bg-[#2c2c2c] rounded-[200px] shadow-2xl scale-[1.02] border-b-8 border-black/40" />
      
      {/* Table Inner Felt */}
      <div className="absolute inset-4 borer-4 border-black/20 rounded-[180px] poker-table-gradient shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
        {/* Table Felt Texture - optional overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
        
        {/* Inner Border Line */}
        <div className="absolute inset-8 rounded-[160px] border border-white/5 pointer-events-none" />

        {/* Pot and Cards */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="text-center group">
            <p className="text-[10px] text-white/30 font-black tracking-[0.2em] uppercase mb-1">TOTAL POT</p>
            <motion.p 
              key={state.pot}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-display font-black text-yellow-500 flex items-center gap-2"
            >
              <span className="text-xl">$</span>{state.pot.toLocaleString()}
            </motion.p>
            {/* Chips stack visual */}
            <div className="flex -space-x-1 mt-3 opacity-50 group-hover:opacity-100 transition-opacity">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className={cn("w-5 h-5 rounded-full border border-white/10 shadow-sm", 
                   i === 0 ? "bg-red-600" : i === 1 ? "bg-blue-600" : "bg-black"
                 )} />
               ))}
            </div>
          </div>

          {/* Community Cards */}
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => {
              const card = state.communityCards[i];
              const isVisible = !!card;
              const slots = ['FLOP', 'FLOP', 'FLOP', 'TURN', 'RIVER'];
              
              return (
                <div key={i} className="relative">
                  {isVisible ? (
                    <motion.div
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      className="w-14 md:w-20 aspect-[1/1.4] bg-white rounded-lg shadow-xl flex flex-col items-center justify-center p-2 text-brand-bg"
                    >
                      <span className={cn("text-lg font-black leading-none", 
                        (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
                      )}>
                        {card.rank}
                      </span>
                      <span className={cn("text-2xl", 
                        (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
                      )}>
                        {getSuitSymbol(card.suit)}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="w-14 md:w-20 aspect-[1/1.4] bg-black/20 rounded-lg border border-white/10 flex items-center justify-center">
                       <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">{slots[i]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Player Seats - Positioned Absolute */}
      {state.players.map((player, idx) => (
         <PlayerSeat 
           key={player.id} 
           player={player} 
           index={idx} 
           totalPlayers={state.players.length} 
           isActing={state.actingIndex === idx}
           isHero={player.id === currentPlayerId}
         />
      ))}
    </div>
  );
};

const getSuitSymbol = (suit: string) => {
  switch (suit) {
    case 'H': return '♥';
    case 'D': return '♦';
    case 'C': return '♣';
    case 'S': return '♠';
    default: return '';
  }
};
