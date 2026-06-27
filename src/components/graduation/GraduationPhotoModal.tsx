"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useData } from "@/lib/DataProvider";

interface Props {
  friendIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const getDarkPastel = (colorVar?: string) => {
  if (!colorVar) return '#2D2D2D';
  if (colorVar.includes('baby-blue') || colorVar.includes('sky-blue')) return '#5C9EAD';
  if (colorVar.includes('lavender') || colorVar.includes('lilac')) return '#8874A3';
  if (colorVar.includes('mint') || colorVar.includes('seafoam')) return '#6A9983';
  if (colorVar.includes('peach') || colorVar.includes('coral')) return '#D97757';
  if (colorVar.includes('pink') || colorVar.includes('rose')) return '#C06C84';
  if (colorVar.includes('yellow') || colorVar.includes('butter')) return '#D4A373';
  return '#2D2D2D';
};

export function GraduationPhotoModal({ friendIndex, isOpen, onClose, onNavigate }: Props) {
  const { friends } = useData();
  const friend = friendIndex !== null ? friends[friendIndex] : null;

  // Listen to keyboard for navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onNavigate(friendIndex !== null && friendIndex > 0 ? friendIndex - 1 : friends.length - 1);
      } else if (e.key === "ArrowRight") {
        onNavigate(friendIndex !== null && friendIndex < friends.length - 1 ? friendIndex + 1 : 0);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, friendIndex, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && friend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[340px] flex flex-col items-center justify-center z-10"
          >
            {/* Photo Frame */}
            <div className="relative w-full bg-white p-4 md:p-5 rounded-[24px] shadow-2xl border border-black/5 mt-4">
              <button 
                onClick={onClose}
                className="absolute top-2 right-2 p-1.5 text-secondary hover:text-primary transition-colors z-20 bg-black/5 rounded-full"
              >
                <X size={20} strokeWidth={2} />
              </button>
              <div className="w-full aspect-[3/4] bg-background-secondary rounded-[16px] overflow-hidden flex items-center justify-center shadow-inner">
                 {friend.graduationPhotoUrl ? (
                    <img src={friend.graduationPhotoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-caption text-sm uppercase tracking-widest font-medium">No Photo</span>
                  )}
              </div>

              {/* Text details inside the frame */}
              <div className="mt-3 text-center px-1 w-full pb-1">
                <h3 className="font-heading text-2xl font-bold tracking-tight" style={{ color: getDarkPastel(friend.accentColor) }}>{friend.fullName}</h3>
                <p className="text-secondary mt-0.5 tracking-wide text-xs">{friend.graduation?.date}</p>
                
                <div className="mt-2 flex items-center justify-center gap-3 text-caption">
                  <div className="h-[1px] w-12 bg-divider" />
                  <span className="text-lg opacity-60">🎓</span>
                  <div className="h-[1px] w-12 bg-divider" />
                </div>
                
                <p className="mt-2 text-secondary/80 font-serif italic text-base max-w-[440px] mx-auto leading-snug">
                  "{friend.graduation?.caption}"
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block absolute top-[40%] -translate-y-1/2 -left-28">
              <button 
                onClick={() => onNavigate(friendIndex !== null && friendIndex > 0 ? friendIndex - 1 : friends.length - 1)}
                className="p-4 text-secondary hover:text-primary hover:scale-110 transition-all bg-white/50 rounded-full border border-black/5"
              >
                <ChevronLeft size={32} strokeWidth={1.5} />
              </button>
            </div>
            <div className="hidden md:block absolute top-[40%] -translate-y-1/2 -right-28">
              <button 
                onClick={() => onNavigate(friendIndex !== null && friendIndex < friends.length - 1 ? friendIndex + 1 : 0)}
                className="p-4 text-secondary hover:text-primary hover:scale-110 transition-all bg-white/50 rounded-full border border-black/5"
              >
                <ChevronRight size={32} strokeWidth={1.5} />
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex md:hidden w-full justify-between px-8 mt-12">
               <button 
                onClick={() => onNavigate(friendIndex !== null && friendIndex > 0 ? friendIndex - 1 : friends.length - 1)}
                className="p-3 text-secondary hover:text-primary border border-black/5 rounded-full bg-white"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => onNavigate(friendIndex !== null && friendIndex < friends.length - 1 ? friendIndex + 1 : 0)}
                className="p-3 text-secondary hover:text-primary border border-black/5 rounded-full bg-white"
              >
                <ChevronRight size={24} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
