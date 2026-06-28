"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useData } from "@/lib/DataProvider";

interface LetterModalProps {
  friendIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function LetterModal({ friendIndex, isOpen, onClose, onNavigate }: LetterModalProps) {
  const { friends } = useData();
  const friend = friendIndex !== null ? friends[friendIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || friendIndex === null) return;
      if (e.key === "ArrowLeft") {
        onNavigate(friendIndex > 0 ? friendIndex - 1 : friends.length - 1);
      } else if (e.key === "ArrowRight") {
        onNavigate(friendIndex < friends.length - 1 ? friendIndex + 1 : 0);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, friendIndex, friends.length, onNavigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && friend && friend.letter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-background/80"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[800px] max-h-[90vh] bg-[#FDFBF7] rounded-sm shadow-2xl border border-black/5 overflow-y-auto flex flex-col z-10"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23noise)\\' opacity=\\'0.03\\'/%3E%3C/svg%3E')"
            }}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full text-caption hover:bg-black/5 transition-colors z-20"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            <div className="p-8 md:p-16 flex flex-col min-h-full">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-black/5 pb-8 mb-12 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-background-secondary border border-black/10 overflow-hidden shadow-sm shrink-0">
                    {friend.imageSrc ? (
                      <img src={friend.imageSrc} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-caption text-[10px] uppercase">Ảnh</div>
                    )}
                  </div>
                  <div className="font-handwriting text-3xl md:text-4xl text-primary">{friend.name}</div>
                </div>
                <div className="font-serif italic text-secondary text-lg">{friend.letter.date}</div>
              </div>

              {/* Content */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1.2 }}
                className="flex-1 text-primary leading-[2.2] text-lg font-serif first-letter:float-left first-letter:text-[80px] first-letter:pr-4 first-letter:font-handwriting first-letter:leading-[0.8] first-letter:text-secondary whitespace-pre-wrap"
              >
                {friend.letter.content}
              </motion.div>

              {/* Signature */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mt-20 text-right pr-8"
              >
                <div className="font-handwriting text-5xl md:text-6xl text-primary" style={{ color: friend.accentColor }}>
                  — {friend.name}
                </div>
                <div className="mt-6 mr-12 text-2xl opacity-50">✈️</div>
              </motion.div>

              {/* Navigation */}
              <div className="mt-24 pt-8 border-t border-black/5 flex justify-between items-center text-secondary">
                <button 
                  onClick={() => onNavigate(friendIndex !== null && friendIndex > 0 ? friendIndex - 1 : friends.length - 1)}
                  className="flex items-center gap-2 hover:text-primary transition-colors uppercase tracking-widest text-xs"
                >
                  <ChevronLeft size={16} /> Thư trước
                </button>
                <button 
                  onClick={() => onNavigate(friendIndex !== null && friendIndex < friends.length - 1 ? friendIndex + 1 : 0)}
                  className="flex items-center gap-2 hover:text-primary transition-colors uppercase tracking-widest text-xs"
                >
                  Thư sau <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
