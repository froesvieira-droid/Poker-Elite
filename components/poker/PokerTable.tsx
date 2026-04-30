'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { GameState, GameStage, Card as CardType } from '@/lib/poker/types';
import { PlayerSeat } from './PlayerSeat';
import { cn } from '@/lib/utils';
import { getRankLabel } from '@/lib/poker/utils';

export const PokerTable = ({ state, currentPlayerId }: { state: GameState, currentPlayerId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-5xl aspect-[2/1] perspective-1000 flex items-center justify-center p-8 sm:p-20"
    >
      {/* Table Outer Rail */}
      <div className="absolute inset-0 bg-[#2c2c2c] rounded-[100px] sm:rounded-[200px] shadow-2xl scale-[1.02] border-b-4 sm:border-b-8 border-black/40" />
      
      {/* Table Inner Felt */}
      <div className="absolute inset-2 sm:inset-4 border-2 sm:border-4 border-black/20 rounded-[90px] sm:rounded-[180px] poker-table-gradient shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] sm:shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
        {/* Table Felt Texture - optional overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
        
        {/* Inner Border Line */}
        <div className="absolute inset-8 rounded-[160px] border border-white/5 pointer-events-none" />

        {/* Pot and Cards */}
        <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-6">
          <div className="text-center group">
            <p className="text-[8px] sm:text-[10px] text-white/30 font-black tracking-[0.2em] uppercase mb-1">POTE TOTAL</p>
            <motion.p 
              key={state.pot}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl sm:text-4xl font-display font-black text-yellow-500 flex items-center gap-1 sm:gap-2"
            >
              <span className="text-sm sm:text-xl">$</span>{state.pot.toLocaleString()}
            </motion.p>
            {/* Chips stack visual */}
            <div className="flex -space-x-1 mt-2 sm:mt-3 opacity-50 group-hover:opacity-100 transition-opacity justify-center">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className={cn("w-3 h-3 sm:w-5 sm:h-5 rounded-full border border-white/10 shadow-sm", 
                   i === 0 ? "bg-red-600" : i === 1 ? "bg-blue-600" : "bg-black"
                 )} />
               ))}
            </div>
          </div>

          {/* Community Cards */}
          <div className="flex gap-1 sm:gap-2">
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
                      className="w-10 sm:w-16 md:w-20 aspect-[1/1.4] bg-white rounded-md sm:rounded-lg shadow-xl flex flex-col items-center justify-center p-1 sm:p-2 text-brand-bg"
                    >
                      <span className={cn("text-[10px] sm:text-base md:text-lg font-black leading-none", 
                        (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
                      )}>
                        {getRankLabel(card.rank)}
                      </span>
                      <span className={cn("text-xs sm:text-xl md:text-2xl", 
                        (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
                      )}>
                        {getSuitSymbol(card.suit)}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="w-10 sm:w-16 md:w-20 aspect-[1/1.4] bg-black/20 rounded-md sm:rounded-lg border border-white/10 flex items-center justify-center">
                       <span className="text-[6px] sm:text-[8px] font-black text-white/10 uppercase tracking-widest">{slots[i]}</span>
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
           tableDimensions={dimensions}
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
