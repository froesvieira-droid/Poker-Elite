'use client';

import { useState, useEffect } from 'react';
import { GameState, GameStage, PlayerStatus } from '@/lib/poker/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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

  const minRaise = state.currentBet * 2;
  const maxRaise = player?.chips || 0;

  useEffect(() => {
    setBetAmount(Math.min(minRaise, maxRaise));
  }, [minRaise, maxRaise]);

  if (!isMyTurn || !player) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 h-28 bg-[#0d0f13] border-t border-white/10 flex items-center px-10 gap-12 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
    >
      {/* Primary Actions */}
      <div className="flex gap-4 shrink-0">
        <button 
          onClick={() => onAction({ type: 'fold' })}
          className="w-36 h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-display font-black text-sm uppercase tracking-widest transition-all active:scale-95 border border-white/5"
        >
          Fold
        </button>
        <button 
          onClick={() => onAction({ type: 'call' })}
          className="w-36 h-16 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-display font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20"
        >
          {state.currentBet > player.bet ? `Pagar $${(state.currentBet - player.bet).toLocaleString()}` : 'Mesa'}
        </button>
        <button 
          onClick={() => onAction({ type: 'raise', amount: betAmount })}
          className="w-36 h-16 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-display font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/20"
        >
          Aumentar para ${betAmount.toLocaleString()}
        </button>
      </div>

      {/* Bet Slider Control */}
      <div className="flex-1 flex flex-col gap-4 max-w-2xl px-8 border-l border-white/5">
        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
          <span>Mín: ${minRaise}</span>
          <span className="text-white">${betAmount.toLocaleString()}</span>
          <span>All-In: ${maxRaise.toLocaleString()}</span>
        </div>
        <div className="relative group flex items-center h-4">
           {/* Slider Background */}
           <div className="absolute inset-0 h-2 bg-white/5 rounded-full" />
           {/* Active Range */}
           <div 
             className="absolute left-0 top-[14px] -translate-y-1/2 h-2 bg-red-600 rounded-full" 
             style={{ width: `${((betAmount - 0) / (maxRaise - 0)) * 100}%` }}
           />
           {/* Native Slider Input */}
           <input 
             type="range"
             min={0}
             max={maxRaise}
             step={10}
             value={betAmount}
             onChange={(e) => setBetAmount(parseInt(e.target.value))}
             className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
           />
           {/* Custom Handle */}
           <div 
             className="absolute w-6 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] border-2 border-red-600 pointer-events-none transition-transform group-hover:scale-110"
             style={{ left: `calc(${((betAmount - 0) / (maxRaise - 0)) * 100}% - 12px)` }}
           />
        </div>
      </div>

      {/* Shortcuts */}
      <div className="flex gap-2 shrink-0">
        {[0.5, 1, 2].map((mult) => (
          <button 
            key={mult}
            onClick={() => setBetAmount(Math.min(maxRaise, state.pot * mult))}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black tracking-widest text-white/60 hover:text-white transition-all uppercase border border-white/5"
          >
            {mult === 1 ? 'POTE' : `${mult} POTE`}
          </button>
        ))}
        <button 
          onClick={() => setBetAmount(maxRaise)}
          className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase border border-red-500/20"
        >
          ALL-IN
        </button>
      </div>
    </motion.div>
  );
};
