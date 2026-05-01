'use client';

import { useState, useEffect } from 'react';
import { GameState, GameStage, PlayerStatus } from '@/lib/poker/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { getRankLabel } from '@/lib/poker/utils';
import { MAX_RAISES } from '@/lib/poker/engine';

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
  playerId 
}: { 
  state: GameState, 
  onAction: (action: { type: 'fold' | 'call' | 'raise', amount?: number }) => void,
  playerId: string
}) => {
  const [betAmount, setBetAmount] = useState(0);
  const player = state.players.find(p => p.id === playerId);
  const isMyTurn = state.players[state.actingIndex]?.id === playerId && state.stage !== GameStage.Showdown;

  const minRaise = state.currentBet === 0 ? 20 : state.currentBet * 2;
  const maxRaise = (player?.chips || 0) + (player?.bet || 0);

  useEffect(() => {
    setBetAmount(Math.min(minRaise, maxRaise));
  }, [minRaise, maxRaise]);

  // Move isMyTurn check lower to allow showing cards always
  if (!player) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 h-auto md:h-32 bg-[#0d0f13]/90 backdrop-blur-xl border-t border-white/10 flex flex-col md:flex-row items-center p-4 md:px-10 gap-4 md:gap-8 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
    >
      {/* Hero Cards Display */}
      <div className="flex gap-2 mr-4 bg-black/40 p-2 rounded-2xl border border-white/5 shadow-2xl relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-white/20 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
          Sua Mão
        </div>
        {player.cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, rotate: i === 0 ? -5 : 5, opacity: 0 }}
            animate={{ y: 0, rotate: i === 0 ? -5 : 5, opacity: 1 }}
            className="w-12 h-16 sm:w-16 sm:h-24 bg-white rounded-xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden border-b-4 border-slate-200"
          >
            <div className={cn(
              "absolute top-1 left-1.5 text-[10px] sm:text-xs font-black leading-none",
              (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
            )}>
              {getRankLabel(card.rank)}
            </div>
            <div className={cn(
              "text-xl sm:text-3xl",
              (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
            )}>
              {getSuitSymbol(card.suit)}
            </div>
            <div className={cn(
              "absolute bottom-1 right-1.5 text-[10px] sm:text-xs font-black leading-none rotate-180",
              (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
            )}>
              {getRankLabel(card.rank)}
            </div>
          </motion.div>
        ))}
      </div>

      {isMyTurn ? (
        <>
          {/* Primary Actions */}
          <div className="flex gap-2 sm:gap-4 shrink-0 w-full md:w-auto">
            <button 
              onClick={() => onAction({ type: 'fold' })}
              className="flex-1 md:w-36 h-12 md:h-16 rounded-xl md:rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-display font-black text-xs md:text-sm uppercase tracking-widest transition-all active:scale-95 border border-white/5"
            >
              Fold
            </button>
            <button 
              onClick={() => onAction({ type: 'call' })}
              className="flex-1 md:w-36 h-12 md:h-16 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-display font-black text-xs md:text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20"
            >
              {state.currentBet > player.bet ? `Pagar $${(state.currentBet - player.bet).toLocaleString()}` : 'Mesa'}
            </button>
            <button 
              onClick={() => onAction({ type: 'raise', amount: betAmount })}
              disabled={player.raisesThisRound >= MAX_RAISES}
              className={cn(
                "flex-1 md:w-36 h-12 md:h-16 rounded-xl md:rounded-2xl font-display font-black text-xs md:text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                player.raisesThisRound >= MAX_RAISES 
                  ? "bg-slate-800 text-white/20 cursor-not-allowed border border-white/5 shadow-none" 
                  : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
              )}
            >
              {player.raisesThisRound >= MAX_RAISES ? 'Limite Aum.' : (betAmount === maxRaise ? 'ALL-IN' : `Aum. $${betAmount.toLocaleString()}`)}
            </button>
          </div>

          {/* Bet Slider Control */}
          <div className={cn(
            "flex-1 flex flex-col gap-2 md:gap-4 w-full md:max-w-2xl md:px-8 md:border-l border-white/5 transition-opacity",
            player.raisesThisRound >= MAX_RAISES && "opacity-20 pointer-events-none"
          )}>
            <div className="flex justify-between text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
              <span>Mín: ${minRaise.toLocaleString()}</span>
              <span className="text-white">${betAmount.toLocaleString()}</span>
              <span className="hidden sm:inline">All-In: ${maxRaise.toLocaleString()}</span>
            </div>
            <div className="relative group flex items-center h-4">
               {/* Slider Background */}
               <div className="absolute inset-0 h-2 bg-white/5 rounded-full" />
               {/* Active Range */}
               <div 
                 className="absolute left-0 top-[6px] md:top-[14px] -translate-y-1/2 h-2 bg-red-600 rounded-full" 
                 style={{ width: `${((betAmount - minRaise) / Math.max(1, maxRaise - minRaise)) * 100}%` }}
               />
               {/* Native Slider Input */}
               <input 
                 type="range"
                 min={minRaise}
                 max={maxRaise}
                 step={10}
                 value={betAmount}
                 onChange={(e) => setBetAmount(parseInt(e.target.value))}
                 className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
               />
               {/* Custom Handle */}
               <div 
                 className="absolute w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] border-2 border-red-600 pointer-events-none transition-transform group-hover:scale-110"
                 style={{ left: `calc(${((betAmount - minRaise) / Math.max(1, maxRaise - minRaise)) * 100}% - 10px)` }}
               />
            </div>
          </div>

          {/* Shortcuts */}
          <div className="hidden sm:flex gap-2 shrink-0">
            {[0.5, 1, 2].map((mult) => (
              <button 
                key={mult}
                onClick={() => setBetAmount(Math.min(maxRaise, state.pot * mult))}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black tracking-widest text-white/60 hover:text-white transition-all uppercase border border-white/5"
              >
                {mult === 1 ? 'POTE' : `${mult} POTE`}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] animate-pulse">
            Aguardando outros jogadores...
          </p>
        </div>
      )}
    </motion.div>
  );
};
