'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, GameStage, Player, PlayerStatus } from '@/lib/poker/types';
import { createInitialState, startHand, processAction } from '@/lib/poker/engine';
import { getAiAction, Difficulty } from '@/lib/poker/ai';
import { PokerTable } from '@/components/poker/PokerTable';
import { BettingControls } from '@/components/poker/BettingControls';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Trophy, Settings, RefreshCw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { POKER_AVATARS } from '@/lib/constants';
import { AvatarSelection } from '@/components/poker/AvatarSelection';
import { X } from 'lucide-react';

const INITIAL_PLAYERS: Player[] = [
  { id: 'hero', name: 'Hero', avatar: POKER_AVATARS[0].url, chips: 10000, status: PlayerStatus.Playing, isDealer: true, cards: [], bet: 0, raisesThisRound: 0 },
  { id: 'cpu1', name: 'Shark_AI', avatar: POKER_AVATARS[1].url, chips: 10000, status: PlayerStatus.Playing, isDealer: false, cards: [], bet: 0, raisesThisRound: 0 },
  { id: 'cpu2', name: 'Bluff_Bot', avatar: POKER_AVATARS[2].url, chips: 10000, status: PlayerStatus.Playing, isDealer: false, cards: [], bet: 0, raisesThisRound: 0 },
  { id: 'cpu3', name: 'Pro_CPU', avatar: POKER_AVATARS[3].url, chips: 10000, status: PlayerStatus.Playing, isDealer: false, cards: [], bet: 0, raisesThisRound: 0 },
];

export default function OfflinePlayPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = (level: Difficulty) => {
    setDifficulty(level);
    const state = createInitialState(INITIAL_PLAYERS);
    setGameState(startHand(state));
    setGameStarted(true);
  };

  const changeHeroAvatar = (url: string) => {
    if (!gameState) return;
    const nextState = {
      ...gameState,
      players: gameState.players.map(p => p.id === 'hero' ? { ...p, avatar: url } : p)
    };
    setGameState(nextState);
  };

  // AI Opponent Logic Loop
  useEffect(() => {
    if (gameState && gameState.stage !== GameStage.Showdown) {
      const actingPlayer = gameState.players[gameState.actingIndex];
      if (actingPlayer.id !== 'hero' && actingPlayer.status === PlayerStatus.Playing) {
        const timer = setTimeout(() => {
          const action = getAiAction(gameState, gameState.actingIndex, difficulty);
          const nextState = processAction(gameState, action);
          setGameState(nextState);
        }, 1000 + (Math.random() * 1000)); // Varied delay for realism
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, difficulty]);

  const handleAction = useCallback((action: { type: 'fold' | 'call' | 'raise', amount?: number }) => {
    if (!gameState) return;
    const nextState = processAction(gameState, action);
    setGameState(nextState);
  }, [gameState]);

  const newHand = () => {
    if (!gameState) return;
    setGameState(startHand(gameState));
  };

  if (!gameStarted) {
    return (
      <main className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1)_0%,transparent_100%)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
            <Sparkles size={14} className="text-red-500" />
            <span className="text-[10px] font-black tracking-[0.2em] text-red-500 uppercase">MODO TREINAMENTO ELITE</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-black italic tracking-tighter uppercase mb-6 leading-none">
            ESCOLHA SEU <span className="text-red-500">NÍVEL</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto mb-16 font-medium">
            Enfrente nossa IA adaptativa em três níveis de intensidade. Aprimore sua leitura de mesa antes de entrar nas arenas globais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { level: Difficulty.Easy, label: 'INICIANTE', desc: 'Ideal para aprender as mecânicas. IA menos agressiva.', icon: '🔰' },
              { level: Difficulty.Medium, label: 'ESPECIALISTA', desc: 'Oponentes balanceados com estratégias reais.', icon: '⚡' },
              { level: Difficulty.Hard, label: 'PRO', desc: 'IA elite. Bluffs frequentes e decisões matemáticas.', icon: '💎' },
            ].map((item) => (
              <motion.button
                key={item.level}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame(item.level)}
                className="group relative bg-brand-surface border border-white/5 p-8 rounded-[32px] text-left hover:border-red-500/50 transition-all shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-red-500/50 transition-all" />
                <div className="text-4xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-display font-black italic tracking-tight mb-2 uppercase group-hover:text-red-500 transition-colors">{item.label}</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{item.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-white/20 group-hover:text-red-500/50 tracking-widest uppercase transition-colors">
                  <span>Selecionar Nível</span>
                  <ChevronRight size={12} />
                </div>
              </motion.button>
            ))}
          </div>

          <Link href="/" className="inline-flex items-center gap-2 mt-16 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
            <ChevronLeft size={16} />
            Voltar ao Início
          </Link>
        </motion.div>
      </main>
    );
  }

  if (!gameState) return null;

  return (
    <main className="min-h-screen bg-brand-bg flex flex-col overflow-hidden relative">
      {/* HUD Header */}
      <nav className="h-16 md:h-20 bg-brand-surface border-b border-white/5 flex items-center justify-between px-4 md:px-10 relative z-50">
        <div className="flex items-center gap-4 md:gap-10">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-red-600 to-red-400 rounded-lg md:rounded-xl flex items-center justify-center rotate-45 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
               <span className="font-black text-xs md:text-sm -rotate-45">♠</span>
             </div>
             <span className="font-display font-black text-xl md:text-2xl tracking-tighter uppercase whitespace-nowrap">
               STAR<span className="text-red-500">POKER</span>
             </span>
          </Link>
          <div className="hidden md:flex gap-8 text-[11px] font-black tracking-widest text-white/40">
             <span className="text-white border-b-2 border-red-500 py-7">JOGANDO: OFFLINE</span>
             <div className="flex items-center gap-4 py-7">
                <span className="opacity-50">DIFICULDADE:</span>
                {[Difficulty.Easy, Difficulty.Medium, Difficulty.Hard].map((d) => (
                   <button
                     key={d}
                     onClick={() => setDifficulty(d)}
                     className={cn(
                       "transition-all hover:text-white",
                       difficulty === d ? "text-red-500 underline underline-offset-4" : "text-white/40"
                     )}
                   >
                     {d === 'easy' ? 'INICIANTE' : d === 'medium' ? 'ESPECIALISTA' : 'PRO'}
                   </button>
                ))}
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-black/40 px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
             <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] text-black font-black">$</div>
             <span className="text-sm font-display font-black tracking-tight">142,500.00</span>
           </div>
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 p-0.5 border border-white/20 overflow-hidden hover:scale-110 active:scale-95 transition-all group"
           >
             <img 
               src={gameState.players.find(p => p.id === 'hero')?.avatar} 
               alt="Hero" 
               className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all"
               referrerPolicy="no-referrer"
             />
           </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-72 bg-brand-sidebar border-r border-white/5 p-6 flex flex-col gap-8 shrink-0 hidden xl:flex">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Destaques da Temporada</h3>
            <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
               <p className="text-[10px] text-red-500 font-black tracking-widest mb-2 italic">MISSÃO DO DIA</p>
               <p className="text-lg font-display font-black tracking-tight leading-none mb-4">Vencer 10 mãos com um par de Áses</p>
               <div className="flex items-center justify-between">
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-white/20" />
                  </div>
                  <span className="ml-3 text-[10px] font-black text-white/40 italic">3/10</span>
               </div>
            </div>
          </div>

          <div className="space-y-4 mt-auto">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status do Jogador</h3>
            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Nível Elite</span>
                  <span className="text-[11px] font-black text-white">LVL 42</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Total Ganhos</span>
                  <span className="text-[11px] font-black text-yellow-500">$2.4M</span>
               </div>
            </div>
          </div>
        </aside>

        {/* Center: The Table */}
        <div className="flex-1 relative flex items-center justify-center p-2 sm:p-10 bg-brand-surface overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.03)_0%,transparent_50%)] pointer-events-none" />
           <PokerTable state={gameState} currentPlayerId="hero" />
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 bg-brand-sidebar border-l border-white/5 flex flex-col shrink-0 hidden lg:flex">
          <div className="p-6 border-b border-white/5">
             <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Força da Mão</h3>
             <div className="h-3 bg-black/40 rounded-full overflow-hidden flex border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  className="bg-gradient-to-r from-red-600 to-red-400"
                />
             </div>
             <p className="text-xs mt-3 text-red-500 font-black italic tracking-tight">Carta Alta: Ás</p>
          </div>

          <div className="flex-1 p-6 overflow-hidden">
             <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Chat da Mesa</h3>
             <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-none">
                <p className="text-[11px] leading-relaxed"><span className="text-emerald-500 font-black tracking-tight">Shark_AI:</span> Boa mão, cara!</p>
                <p className="text-[11px] leading-relaxed text-white/30 italic"><span className="font-black not-italic text-white">Dealer:</span> Blinds subiram para 200/400.</p>
                <p className="text-[11px] leading-relaxed"><span className="text-red-500 font-black tracking-tight">Bluff_Bot:</span> Pensando...</p>
             </div>
          </div>

          <div className="p-6 mt-auto">
             <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black tracking-widest text-white/40 hover:text-white transition-all uppercase">
                CONFIGURAÇÕES OFFLINE
             </button>
          </div>
        </aside>
      </div>

      <BettingControls state={gameState} onAction={handleAction} playerId="hero" />

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          >
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="w-full max-w-2xl bg-brand-surface border border-white/10 rounded-[40px] p-10 relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-white/10 to-red-600 opacity-50" />
                
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h2 className="text-3xl font-display font-black italic tracking-tighter uppercase leading-none">PERFIL DO JOGADOR</h2>
                      <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mt-2">Personalize sua presença na mesa</p>
                   </div>
                   <button 
                     onClick={() => setIsSettingsOpen(false)}
                     className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                   >
                     <X size={20} className="text-white/40" />
                   </button>
                </div>

                <div className="space-y-6">
                   <section>
                      <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Escolha seu Avatar</h3>
                      <AvatarSelection 
                        currentAvatar={gameState.players.find(p => p.id === 'hero')?.avatar}
                        onSelect={changeHeroAvatar}
                      />
                   </section>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex justify-end">
                   <button
                     onClick={() => setIsSettingsOpen(false)}
                     className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-display font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
                   >
                     SALVAR ALTERAÇÕES
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
               <h2 className="text-5xl font-display font-black italic tracking-tighter uppercase mb-2">MÃO FINALIZADA</h2>
               <p className="text-white/40 font-medium mb-10">As fichas foram empurradas. Pronto para a próxima?</p>
               
               <div className="space-y-4 mb-10">
                  {gameState.winners?.map((w, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                       <span className="font-display font-black text-lg italic text-white uppercase">{w.playerId === 'hero' ? 'Você' : w.playerId} Venceu</span>
                       <span className="text-yellow-500 font-display font-black text-xl">+${w.amount.toLocaleString()}</span>
                    </div>
                  ))}
               </div>

               <button
                 onClick={newHand}
                 className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-display font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
               >
                 <RefreshCw size={20} />
                 PRÓXIMA MÃO
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
