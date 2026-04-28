'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, GameStage, Player, PlayerStatus } from '@/lib/poker/types';
import { createInitialState, startHand, processAction } from '@/lib/poker/engine';
import { PokerTable } from '@/components/poker/PokerTable';
import { BettingControls } from '@/components/poker/BettingControls';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Trophy, Settings, RefreshCw, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const INITIAL_PLAYERS: Player[] = [
  { id: 'hero', name: 'Hero', avatar: '', chips: 10000, status: PlayerStatus.Playing, isDealer: true, cards: [], bet: 0 },
  { id: 'cpu1', name: 'Shark_AI', avatar: '', chips: 10000, status: PlayerStatus.Playing, isDealer: false, cards: [], bet: 0 },
  { id: 'cpu2', name: 'Bluff_Bot', avatar: '', chips: 10000, status: PlayerStatus.Playing, isDealer: false, cards: [], bet: 0 },
  { id: 'cpu3', name: 'Pro_CPU', avatar: '', chips: 10000, status: PlayerStatus.Playing, isDealer: false, cards: [], bet: 0 },
];

export default function OfflinePlayPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const state = createInitialState(INITIAL_PLAYERS);
    setGameState(startHand(state));
  }, []);

  const handleAction = useCallback((action: { type: 'fold' | 'call' | 'raise', amount?: number }) => {
    if (!gameState) return;
    const nextState = processAction(gameState, action);
    setGameState(nextState);

    // Minimal CPU logic - if it's not hero's turn, auto-play after a delay
    if (nextState.players[nextState.actingIndex].id !== 'hero' && nextState.stage !== GameStage.Showdown) {
       setTimeout(() => {
          const cpuAction = { type: 'call' }; // Simple CPU
          const afterCpuState = processAction(nextState, cpuAction);
          setGameState(afterCpuState);
       }, 1000);
    }
  }, [gameState]);

  const newHand = () => {
    if (!gameState) return;
    setGameState(startHand(gameState));
  };

  if (!gameState) return null;

  return (
    <main className="min-h-screen bg-brand-bg flex flex-col overflow-hidden relative">
      {/* HUD Header */}
      <nav className="h-20 bg-brand-surface border-b border-white/5 flex items-center justify-between px-10 relative z-50">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-red-400 rounded-xl flex items-center justify-center rotate-45 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
               <span className="font-black text-sm -rotate-45">♠</span>
             </div>
             <span className="font-display font-black text-2xl tracking-tighter uppercase">
               STAR<span className="text-red-500">POKER</span>
             </span>
          </Link>
          <div className="hidden md:flex gap-8 text-[11px] font-black tracking-widest text-white/40">
             <span className="text-white border-b-2 border-red-500 py-7">PLAYING: OFFLINE</span>
             <span className="hover:text-white transition-colors cursor-pointer py-7">STATS</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-black/40 px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
             <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] text-black font-black">$</div>
             <span className="text-sm font-display font-black tracking-tight">142,500.00</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 p-0.5 border border-white/20" />
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-72 bg-brand-sidebar border-r border-white/5 p-6 flex flex-col gap-6 shrink-0 hidden xl:flex">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Active Tournament</h3>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
               <p className="text-[10px] text-red-500 font-black tracking-widest mb-1 italic">GRAND SLAM ELITE</p>
               <p className="text-xl font-display font-black tracking-tight">$50,000 GTD</p>
               <div className="mt-4 flex justify-between text-[11px] font-bold text-white/40">
                  <span>Players: 124/500</span>
                  <span>Blinds: 200/400</span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Global Rankings</h3>
            <div className="flex flex-col gap-2">
               {[
                 { rank: '01', name: 'Ace_Hunter', chips: '1.2M', color: 'text-yellow-500' },
                 { rank: '02', name: 'BluffMaster', chips: '980K', color: 'text-white/40' },
                 { rank: '03', name: 'RiverRat99', chips: '845K', color: 'text-red-600' },
               ].map((r, i) => (
                 <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <span className={cn("text-xs font-black", r.color)}>{r.rank}</span>
                    <div className="w-7 h-7 rounded bg-slate-700" />
                    <span className="text-[11px] font-bold text-white/80">{r.name}</span>
                    <span className="ml-auto text-[10px] font-black text-white/30">{r.chips}</span>
                 </div>
               ))}
            </div>
          </div>
        </aside>

        {/* Center: The Table */}
        <div className="flex-1 relative flex items-center justify-center p-10 bg-brand-surface overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.03)_0%,transparent_50%)] pointer-events-none" />
           <PokerTable state={gameState} currentPlayerId="hero" />
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 bg-brand-sidebar border-l border-white/5 flex flex-col shrink-0 hidden lg:flex">
          <div className="p-6 border-b border-white/5">
             <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Hand Strength</h3>
             <div className="h-3 bg-black/40 rounded-full overflow-hidden flex border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  className="bg-gradient-to-r from-red-600 to-red-400"
                />
             </div>
             <p className="text-xs mt-3 text-red-500 font-black italic tracking-tight">High Card: Ace</p>
          </div>

          <div className="flex-1 p-6 overflow-hidden">
             <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Table Chat</h3>
             <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-none">
                <p className="text-[11px] leading-relaxed"><span className="text-emerald-500 font-black tracking-tight">Shark_AI:</span> Nice hand man!</p>
                <p className="text-[11px] leading-relaxed text-white/30 italic"><span className="font-black not-italic text-white">Dealer:</span> Blinds increased to 200/400.</p>
                <p className="text-[11px] leading-relaxed"><span className="text-red-500 font-black tracking-tight">Bluff_Bot:</span> Thinking...</p>
             </div>
          </div>

          <div className="p-6 mt-auto">
             <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black tracking-widest text-white/40 hover:text-white transition-all uppercase">
                OFFLINE SETTINGS
             </button>
          </div>
        </aside>
      </div>

      <BettingControls state={gameState} onAction={handleAction} playerId="hero" />

      {/* Showdown Modal */}
      <AnimatePresence>
        {gameState.stage === GameStage.Showdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-brand-surface border border-white/10 rounded-[40px] p-12 text-center max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-white to-red-600" />
               <Trophy size={64} className="text-yellow-500 mx-auto mb-6" />
               <h2 className="text-5xl font-display font-black italic tracking-tighter uppercase mb-2">HAND COMPLETE</h2>
               <p className="text-white/40 font-medium mb-10">The chips have been pushed. Ready for the next one?</p>
               
               <div className="space-y-4 mb-10">
                  {gameState.winners?.map((w, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                       <span className="font-display font-black text-lg italic text-white uppercase">{w.playerId} Won</span>
                       <span className="text-yellow-500 font-display font-black text-xl">+${w.amount.toLocaleString()}</span>
                    </div>
                  ))}
               </div>

               <button
                 onClick={newHand}
                 className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-display font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
               >
                 <RefreshCw size={20} />
                 NEXT HAND
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
