'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GameState, GameStage, Player, PlayerStatus } from '@/lib/poker/types';
import { createInitialState, startHand, processAction } from '@/lib/poker/engine';
import { PokerTable } from '@/components/poker/PokerTable';
import { BettingControls } from '@/components/poker/BettingControls';
import { useAuth } from '@/hooks/use-auth';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Home, Loader2, Users } from 'lucide-react';
import Link from 'next/link';

export default function OnlineRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { user, profile } = useAuth();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
      if (docSnap.exists()) {
        setRoom({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [roomId]);

  // Join logic
  useEffect(() => {
    const joinRoom = async () => {
      if (!user || !profile || !room || room.players[user.uid]) return;
      
      const newPlayers = {
        ...room.players,
        [user.uid]: {
          id: user.uid,
          name: profile.name,
          avatar: profile.avatar,
          chips: profile.chips,
          status: 'waiting',
          isDealer: false,
          cards: [],
          bet: 0,
          raisesThisRound: 0
        }
      };
      
      await updateDoc(doc(db, 'rooms', roomId), {
        players: newPlayers,
        updatedAt: serverTimestamp()
      });
    };
    
    if (user && profile && room && !loading) {
       joinRoom();
    }
  }, [user, profile, room, loading, roomId]);

  const handleAction = useCallback(async (action: { type: 'fold' | 'call' | 'raise', amount?: number }) => {
    if (!room || !room.gameState) return;
    
    const nextState = processAction(room.gameState, action);
    await updateDoc(doc(db, 'rooms', roomId), {
      gameState: nextState,
      updatedAt: serverTimestamp(),
      status: nextState.stage === GameStage.Showdown ? 'finished' : 'playing'
    });
  }, [room, roomId]);

  const startNewHand = async () => {
    if (!room) return;
    
    // Convert map to array for engine
    const playersArr = Object.values(room.players) as Player[];
    const initialState = createInitialState(playersArr);
    const handState = startHand(initialState);
    
    await updateDoc(doc(db, 'rooms', roomId), {
      gameState: handState,
      status: 'playing',
      updatedAt: serverTimestamp()
    });
  };

  const nextHand = useCallback(async () => {
    if (!room || !room.gameState) return;
    const handState = startHand(room.gameState);
    await updateDoc(doc(db, 'rooms', roomId), {
      gameState: handState,
      status: 'playing',
      updatedAt: serverTimestamp()
    });
  }, [room, roomId]);

  if (loading || !room) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
        <p className="text-white/40 font-bold uppercase tracking-widest">Carregando Sala...</p>
      </main>
    );
  }

  const isCreator = room.creatorId === user?.uid;
  const isPlaying = room.status === 'playing' || room.status === 'finished';
  const playersCount = Object.keys(room.players).length;

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
        <Link href="/play/online" className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors">
          <Home size={24} className="text-white" />
        </Link>
        
        <div className="flex bg-slate-900 rounded-full px-4 py-2 border border-white/10 gap-4">
           <div className="flex items-center gap-2">
             <Users size={16} className="text-blue-400" />
             <span className="text-white text-xs font-bold uppercase tracking-tighter">{room.name}</span>
           </div>
        </div>

        <div className="flex bg-slate-900 rounded-full px-4 py-2 border border-white/10 gap-2 items-center">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-white text-[10px] font-black uppercase tracking-widest">{playersCount} Online</span>
        </div>
      </div>

      {!isPlaying ? (
        <div className="flex flex-col items-center gap-6">
           <div className="text-center">
              <h2 className="text-4xl font-black italic tracking-tighter text-white mb-2 uppercase">Aguardando Jogadores</h2>
              <p className="text-white/40 font-medium">Mínimo de 2 jogadores para iniciar.</p>
           </div>
           
           {isCreator && playersCount >= 2 && (
             <button 
               onClick={startNewHand}
               className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all"
             >
               INICIAR PARTIDA
             </button>
           )}
           
           {!isCreator && (
              <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-white/40 font-bold animate-pulse">
                Aguardando o criador iniciar...
              </div>
           )}
        </div>
      ) : room.gameState ? (
        <>
          <PokerTable state={room.gameState} currentPlayerId={user?.uid || ''} />
          <BettingControls 
            key={`${room.gameState.stage}-${room.gameState.currentBet}-${room.gameState.actingIndex}`}
            state={room.gameState} 
            onAction={handleAction} 
            playerId={user?.uid || ''} 
          />
        </>
      ) : (
        <div className="text-white/20">Erro ao carregar estado do jogo</div>
      )}

      <AnimatePresence>
        {room.status === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <Trophy size={80} className="text-amber-400 mb-4 animate-bounce" />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase italic text-center">Hand Ended</h2>
            <p className="text-white/60 mb-8 max-w-md text-center text-lg">Check the table to see who won the pot!</p>
            
            {isCreator && (
              <div className="flex gap-4">
                <button
                  onClick={nextHand}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl transition-all hover:scale-105"
                >
                  PRÓXIMA MÃO
                </button>
              </div>
            )}
            {!isCreator && (
              <div className="text-white/40 font-bold uppercase tracking-widest italic animate-pulse">
                Aguardando nova mão...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
