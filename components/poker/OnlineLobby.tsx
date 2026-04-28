'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Users, Play, Loader2, Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const OnlineLobby = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'rooms'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const createRoom = async () => {
    if (!user || !profile) return;
    setCreating(true);
    try {
      const roomData = {
        name: `Mesa de ${profile.name}`,
        creatorId: user.uid,
        status: 'waiting',
        smallBlind: 10,
        bigBlind: 20,
        maxPlayers: 8,
        players: {
          [user.uid]: {
            id: user.uid,
            name: profile.name,
            avatar: profile.avatar,
            chips: profile.chips,
            status: 'waiting',
            isDealer: false,
            cards: [],
            bet: 0
          }
        },
        gameState: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'rooms'), roomData);
      // We need to update the id inside the doc too for easier reference if we want, 
      // but firestore id is enough. Let's redirect to the room page.
      router.push(`/play/online/${docRef.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
           <input 
             type="text" 
             placeholder="Buscar mesas..."
             className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors"
           />
        </div>
        
        <button 
          onClick={createRoom}
          disabled={creating}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {creating ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
          CRIAR MESA
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {rooms.length === 0 ? (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="col-span-full py-20 text-center text-white/20 font-bold uppercase tracking-widest"
               >
                 Nenhuma mesa encontrada
               </motion.div>
            ) : rooms.map((room) => (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-white/10 p-6 rounded-3xl group hover:border-indigo-500/50 transition-all cursor-pointer"
                onClick={() => router.push(`/play/online/${room.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold italic tracking-tight uppercase group-hover:text-indigo-400 transition-colors">{room.name}</h3>
                    <div className="text-xs text-white/40 font-mono font-bold mt-1 uppercase">Blinds: ${room.smallBlind}/${room.bigBlind}</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-xs font-bold">
                    <Users size={12} className="text-indigo-400" />
                    <span>{Object.keys(room.players || {}).length} / {room.maxPlayers}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                   <div className="flex -space-x-2">
                      {Object.values(room.players || {}).slice(0, 4).map((p: any, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800">
                          {p.avatar ? (
                             <img src={p.avatar} alt="P" className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">?</div>
                          )}
                        </div>
                      ))}
                      {Object.keys(room.players || {}).length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                          +{Object.keys(room.players || {}).length - 4}
                        </div>
                      )}
                   </div>
                   
                   <button className="flex items-center gap-2 text-indigo-400 font-bold text-sm group-hover:gap-3 transition-all">
                      ENTRAR <Play size={14} className="fill-current" />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
