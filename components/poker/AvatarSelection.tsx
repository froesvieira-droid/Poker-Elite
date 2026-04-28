'use client';

import { useState } from 'react';
import { POKER_AVATARS } from '@/lib/constants';
import { motion } from 'motion/react';
import { Check, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarSelectionProps {
  onSelect: (avatarUrl: string) => void;
  currentAvatar?: string;
}

export function AvatarSelection({ onSelect, currentAvatar }: AvatarSelectionProps) {
  const [selected, setSelected] = useState(currentAvatar || POKER_AVATARS[0].url);

  const handleSelect = (url: string) => {
    setSelected(url);
    onSelect(url);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {POKER_AVATARS.map((avatar) => (
        <motion.button
          key={avatar.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect(avatar.url)}
          className={cn(
            "relative group flex flex-col items-center p-4 rounded-3xl border transition-all duration-300",
            selected === avatar.url 
              ? "bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
              : "bg-white/5 border-white/5 hover:border-white/10"
          )}
        >
          <div className="relative w-20 h-20 mb-3 rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all">
            <img 
              src={avatar.url} 
              alt={avatar.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {selected === avatar.url && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-red-500 rounded-full p-1 shadow-lg">
                  <Check size={16} className="text-white" />
                </div>
              </div>
            )}
          </div>
          
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest text-center",
            selected === avatar.url ? "text-red-500" : "text-white/40 group-hover:text-white/60"
          )}>
            {avatar.name}
          </span>
          
          <p className="text-[8px] text-white/20 text-center mt-1 leading-tight px-2 group-hover:text-white/30 transition-colors uppercase font-bold tracking-tighter">
            {avatar.description}
          </p>
        </motion.button>
      ))}
    </div>
  );
}
