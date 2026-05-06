'use client';

import { useState, useEffect } from 'react';
import { GameState, GameStage, PlayerStatus, Card as CardType } from '@/lib/poker/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { getRankLabel, evaluateHand, getHandRankName } from '@/lib/poker/utils';
import { MAX_RAISES, FIXED_RAISE } from '@/lib/poker/engine';

const getSuitSymbol = (suit: string) => {
  switch (suit) {
    case 'H': return '♥';
    case 'D': return '♦';
    case 'C': return '♣';
    case 'S': return '♠';
    default: return '';
  }
};

export const BettingControls = ({ 
  state, 
  onAction, 
  playerId,
  highlightedCards = []
}: { 
  state: GameState, 
  onAction: (action: { type: 'fold' | 'call' | 'raise', amount?: number }) => void,
  playerId: string,
  highlightedCards?: CardType[]
}) => {
  const [betAmount, setBetAmount] = useState(0);
  const player = state.players.find(p => p.id === playerId);
  if (!player) return null;

  const isMyTurn = state.players[state.actingIndex]?.id === playerId && state.stage !== GameStage.Showdown;

  const currentHand = evaluateHand([...player.cards, ...state.communityCards]);
  const handName = getHandRankName(currentHand.rank);

  const minRaise = state.currentBet + FIXED_RAISE;
  const canRaise = player.raisesThisRound < MAX_RAISES && player.chips > (minRaise - player.bet);

  return (
    <motion.div 
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-auto sm:h-28 bg-gradient-to-t from-black to-black/80 backdrop-blur-2xl border-t border-white/5 flex flex-col items-center p-3 sm:p-4 z-50"
    >
      {/* Hand Assessment & Deck Stats */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none">
        <AnimatePresence>
          {state.stage !== GameStage.Showdown && player.cards.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-2 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] border border-white/20"
            >
              <span className="text-sm sm:text-lg font-display font-black italic text-white uppercase tracking-tighter">
                {state.pot > 0 ? "SUA MÃO" : "EM ESPERA"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10">
        {/* Left Side: Cards */}
        <div className="relative group flex items-end -mt-12 sm:-mt-16 mb-2 sm:mb-0">
          {player.cards.map((card, i) => {
            const isHighlighted = highlightedCards.some(hc => hc.rank === card.rank && hc.suit === card.suit);
            
            return (
              <motion.div
                key={i}
                initial={{ y: 50, rotate: i === 0 ? -15 : 15, opacity: 0 }}
                animate={{ 
                  y: isHighlighted ? -8 : 0, 
                  rotate: i === 0 ? -15 : 15, 
                  opacity: 1 
                }}
                whileHover={{ y: -20, rotate: 0, zIndex: 50, scale: 1.15 }}
                className={cn(
                  "relative w-12 h-18 sm:w-18 sm:h-26 bg-white rounded-md sm:rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between p-1 sm:p-2 text-brand-bg border-b-[4px] border-slate-300 transition-all",
                  i === 1 && "-ml-5 sm:-ml-8",
                  isHighlighted && "ring-4 ring-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.7)]"
                )}
              >
              <div className={cn(
                "w-full text-left font-display font-black text-[10px] sm:text-base leading-none",
                (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
              )}>
                {getRankLabel(card.rank)}
              </div>
              <div className={cn(
                "text-lg sm:text-2xl",
                (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
              )}>
                {getSuitSymbol(card.suit)}
              </div>
              <div className={cn(
                "w-full text-right font-display font-black text-[10px] sm:text-base leading-none rotate-180",
                (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
              )}>
                {getRankLabel(card.rank)}
              </div>
              
              {/* Card Decoration */}
              <div className="absolute inset-1.5 border border-black/5 rounded-md sm:rounded-lg pointer-events-none" />
            </motion.div>
          ); })}
          
          {/* Hand Info Pill */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 px-4 py-1 rounded-full font-black text-[9px] sm:text-xs z-30 shadow-[0_4px_15px_rgba(234,179,8,0.4)] border-2 border-slate-950 whitespace-nowrap uppercase tracking-tighter">
             {handName}
          </div>
        </div>

        {isMyTurn ? (
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full">
            {/* Fixed Raise Info - Ultra Compact */}
            <div className={cn(
              "flex flex-col gap-1 w-full sm:w-40 bg-white/5 p-2 rounded-xl border border-white/10",
              !canRaise && "opacity-40 grayscale"
            )}>
              <div className="flex justify-between items-center h-full sm:h-auto">
                 <div className="flex flex-col">
                   <span className="text-[8px] font-black text-white/20 tracking-widest uppercase">RAISE FIXO</span>
                   <span className="text-[8px] font-black text-yellow-500/50 uppercase tracking-widest">+{FIXED_RAISE}</span>
                 </div>
                 <span className="text-base font-display font-black text-yellow-500">${minRaise.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[7px] font-black text-white/10 uppercase tracking-widest mt-0.5">
                 <span>RODADA: {player.raisesThisRound}/{MAX_RAISES}</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto h-11 sm:h-14">
              <button 
                onClick={() => onAction({ type: 'fold' })}
                className="flex-1 sm:w-28 bg-slate-900/80 hover:bg-slate-800 text-white border-2 border-white/10 rounded-xl font-display font-black italic text-[10px] sm:text-sm uppercase tracking-tighter transition-all active:scale-95 shadow-xl"
              >
                DESISTIR
              </button>
              <button 
                onClick={() => onAction({ type: 'call' })}
                className="flex-1 sm:w-28 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white border-b-4 border-green-800 rounded-xl font-display font-black italic text-[10px] sm:text-sm uppercase tracking-tighter transition-all active:scale-95 shadow-lg active:border-b-0 active:translate-y-1"
              >
                {state.currentBet > player.bet ? 'PAGAR' : 'PASSAR'}
              </button>
              <button 
                onClick={() => onAction({ type: 'raise' })}
                disabled={!canRaise}
                className={cn(
                  "flex-1 sm:w-32 rounded-xl font-display font-black italic text-[10px] sm:text-base uppercase tracking-tighter transition-all active:scale-95 shadow-2xl border-b-4",
                  !canRaise 
                    ? "bg-slate-800 border-slate-900 text-white/20 opacity-50 cursor-not-allowed shadow-none border-b-0" 
                    : "bg-gradient-to-b from-red-500 to-red-700 border-red-800 text-white hover:from-red-400 hover:to-red-600 active:border-b-0 active:translate-y-1"
                )}
              >
                {player.raisesThisRound >= MAX_RAISES ? 'LIMITE' : 'AUMENTAR'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-0">
             <div className="relative w-32 sm:w-48 h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-red-600 to-transparent"
                />
             </div>
             <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] animate-pulse">AGUARDANDO JOGADA...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
