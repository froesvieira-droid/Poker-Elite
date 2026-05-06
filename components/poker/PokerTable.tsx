'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, GameStage, Card as CardType } from '@/lib/poker/types';
import { PlayerSeat } from './PlayerSeat';
import { cn } from '@/lib/utils';
import { getRankLabel } from '@/lib/poker/utils';

export const PokerTable = ({ 
  state, 
  currentPlayerId, 
  highlightedCards = [] 
}: { 
  state: GameState, 
  currentPlayerId: string,
  highlightedCards?: CardType[]
}) => {
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
      className="relative w-full max-w-5xl aspect-[1/1.2] sm:aspect-[1.5/1] perspective-1000 flex items-center justify-center p-4 sm:p-20 overflow-hidden rounded-[40px]"
    >
      {/* Casino Background Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1596838132731-dd93c850b042?q=80&w=2070&auto=format&fit=crop" 
          alt="Casino Background" 
          className="w-full h-full object-cover blur-[2px] opacity-40 scale-105"
        />
      </div>

      {/* Table Outer Rail */}
      <div className="absolute inset-x-4 inset-y-10 sm:inset-10 bg-gradient-to-b from-[#3a3a3a] to-[#121212] rounded-[100px] sm:rounded-[240px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-1 border-b-[8px] sm:border-b-[12px] border-black/80" />
      
      {/* Table Inner Felt */}
      <div className="absolute inset-x-6 inset-y-12 sm:inset-16 border-[4px] sm:border-[8px] border-black/40 rounded-[90px] sm:rounded-[220px] bg-[#1a4a2a] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-2 overflow-hidden flex items-center justify-center">
        {/* Dealer Character Overlay */}
        <div className="absolute -top-12 sm:-top-24 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-96 sm:h-96 z-0 opacity-40 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" 
            alt="Dealer" 
            className="w-full h-full object-cover rounded-full mix-blend-overlay border-8 border-yellow-500/10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a4a2a] via-[#1a4a2a]/20 to-transparent" />
        </div>
        
        {/* Table Felt Texture and Logo */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
        <div className="absolute flex flex-col items-center opacity-10 select-none">
          <h2 className="text-4xl sm:text-7xl font-display font-black italic tracking-tighter text-white">MEGA</h2>
          <h3 className="text-xl sm:text-2xl font-display font-black text-white/80">HOLD'EM</h3>
        </div>
        
        {/* Inner Border Line */}
        <div className="absolute inset-6 sm:inset-12 rounded-[80px] sm:rounded-[200px] border border-white/5 pointer-events-none" />

        {/* Pot and Cards */}
        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-10 w-full mb-10 sm:mb-20">
          {/* Pot Display */}
          <div className="flex flex-col items-center">
             <div className="bg-black/40 backdrop-blur-md px-6 py-1 rounded-full border border-white/10 mb-2">
                <span className="text-[10px] sm:text-xs font-black text-white/40 uppercase tracking-[0.3em]">POTE TOTAL</span>
             </div>
             <motion.p 
               key={state.pot}
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-3xl sm:text-6xl font-display font-black text-yellow-500 [text-shadow:0_0_20px_rgba(234,179,8,0.4)]"
             >
               ${state.pot.toLocaleString()}
             </motion.p>
          </div>

          {/* Community Cards with Neon Glows */}
          <div className="flex gap-2 sm:gap-4 p-2 sm:p-6">
            {[...Array(5)].map((_, i) => {
              const card = state.communityCards[i];
              const isVisible = !!card;
              const isHighlighted = card && highlightedCards.some(hc => hc.rank === card.rank && hc.suit === card.suit);
              
              return (
                <div key={i} className="relative group">
                  <AnimatePresence mode="wait">
                    {isVisible ? (
                      <motion.div
                        key={`card-${card.suit}-${card.rank}`}
                        initial={{ scale: 0.5, y: 10, opacity: 0 }}
                        animate={{ 
                          scale: isHighlighted ? 1.05 : 1, 
                          y: 0, 
                          opacity: 1 
                        }}
                        className={cn(
                          "relative w-12 sm:w-24 md:w-28 aspect-[1/1.4] bg-white rounded-lg sm:rounded-2xl shadow-2xl flex flex-col items-center justify-center p-1 sm:p-3 text-brand-bg border-b-4 sm:border-b-8 border-slate-300 transition-all overflow-hidden",
                          isHighlighted ? "ring-4 ring-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.7)]" : "ring-2 ring-transparent group-hover:ring-red-500/50"
                        )}
                      >
                        {/* Neon Inner Glow */}
                        <div className={cn(
                          "absolute inset-0 transition-opacity",
                          isHighlighted ? "bg-yellow-500/10 opacity-100" : "bg-red-500/5 opacity-0 group-hover:opacity-100"
                        )} />
                        
                        <div className="flex flex-col items-center relative z-10">
                          <span className={cn("text-base sm:text-4xl md:text-5xl font-black leading-none tracking-tighter", 
                            (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-slate-900"
                          )}>
                            {getRankLabel(card.rank)}
                          </span>
                          <span className={cn("text-2xl sm:text-5xl md:text-6xl leading-none mt-1 sm:mt-2", 
                            (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-slate-900"
                          )}>
                            {getSuitSymbol(card.suit)}
                          </span>
                        </div>

                         {/* Card Reflection/Texture */}
                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent -translate-y-10 translate-x-10 rotate-45 pointer-events-none" />
                      </motion.div>
                    ) : (
                      <div key={`slot-${i}`} className="w-12 sm:w-24 md:w-28 aspect-[1/1.4] bg-black/40 rounded-lg sm:rounded-2xl border-2 border-white/5 flex items-center justify-center shadow-inner group/slot">
                         <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-white/10 group-hover/slot:bg-white/20 transition-colors" />
                      </div>
                    )}
                  </AnimatePresence>
                  
                  {isVisible && (
                    <div className="absolute -inset-1 sm:-inset-2 rounded-lg sm:rounded-2xl border-2 border-red-500/40 blur-[4px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
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
