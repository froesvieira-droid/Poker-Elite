'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
      className="relative w-full max-w-5xl aspect-[1.5/1] sm:aspect-[2/1] perspective-1000 flex items-center justify-center p-2 sm:p-20"
    >
      {/* Table Outer Rail */}
      <div className="absolute inset-0 bg-[#2c2c2c] rounded-[60px] sm:rounded-[200px] shadow-2xl scale-[1.01] sm:scale-[1.02] border-b-4 sm:border-b-8 border-black/40" />
      
      {/* Table Inner Felt */}
      <div className="absolute inset-1 sm:inset-4 border sm:border-4 border-black/20 rounded-[55px] sm:rounded-[180px] poker-table-gradient shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] sm:shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] flex items-center justify-center">
        {/* Table Felt Texture - optional overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
        
        {/* Inner Border Line */}
        <div className="absolute inset-4 sm:inset-8 rounded-[50px] sm:rounded-[160px] border border-white/5 pointer-events-none" />

        {/* Pot and Cards */}
        <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-6 w-full">
          <div className="text-center">
            <p className="text-[7px] sm:text-[10px] text-white/40 font-black tracking-[0.2em] uppercase">POTE</p>
            <motion.p 
              key={state.pot}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg sm:text-4xl font-display font-black text-yellow-500 shadow-sm"
            >
              ${state.pot.toLocaleString()}
            </motion.p>
          </div>

          {/* Community Cards */}
          <div className="flex gap-1.5 sm:gap-3 p-1.5 sm:p-4 bg-black/40 rounded-xl sm:rounded-[30px] border border-white/10 shadow-2xl backdrop-blur-md">
            {[...Array(5)].map((_, i) => {
              const card = state.communityCards[i];
              const isVisible = !!card;
              const slots = ['FLOP', 'FLOP', 'FLOP', 'TURN', 'RIVER'];
              
              return (
                <div key={i} className="relative">
                  <AnimatePresence mode="wait">
                    {isVisible ? (
                      <motion.div
                        key={`card-${card.suit}-${card.rank}`}
                        initial={{ scale: 0.5, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        className="w-10 sm:w-20 md:w-24 aspect-[1/1.4] bg-white rounded-md sm:rounded-xl shadow-2xl flex flex-col items-center justify-center p-1 sm:p-2 text-brand-bg border-b-2 sm:border-b-4 border-slate-200"
                      >
                        <div className="flex flex-col items-center">
                          <span className={cn("text-[11px] sm:text-xl md:text-2xl font-black leading-none", 
                            (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
                          )}>
                            {getRankLabel(card.rank)}
                          </span>
                          <span className={cn("text-lg sm:text-3xl md:text-4xl leading-none mt-0.5 sm:mt-1", 
                            (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
                          )}>
                            {getSuitSymbol(card.suit)}
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <div key={`slot-${i}`} className="w-10 sm:w-20 md:w-24 aspect-[1/1.4] bg-white/5 rounded-md sm:rounded-xl border border-white/10 flex items-center justify-center">
                         <span className="text-[6px] sm:text-[10px] font-black text-white/5 uppercase tracking-widest">{slots[i]}</span>
                      </div>
                    )}
                  </AnimatePresence>
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
