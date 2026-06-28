"use client";

import { motion } from "framer-motion";
import { FriendData } from "@/lib/queries";
import { Plus } from "lucide-react";

interface Props {
  friend: FriendData;
  index: number;
  onClick: () => void;
  isHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
  onEdit: (e: React.MouseEvent) => void;
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

export function GraduationPhotoCard({ friend, index, onClick, isHovered, onHover, onHoverEnd, onEdit }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={onHover}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      className={`relative flex flex-col items-center group cursor-pointer ${isHovered ? 'z-20' : 'z-10'}`}
    >
      {/* Frame */}
      <motion.div 
        animate={{ 
          y: isHovered ? -16 : 0, 
          scale: isHovered ? 1.03 : 1 
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-[240px] lg:w-[260px] bg-white rounded-[24px] p-5 shadow-sm group-hover:shadow-xl border border-black/5 flex flex-col transition-shadow duration-300"
      >
        <div className="relative w-full aspect-[3/4] bg-background-secondary rounded-[14px] border border-black/5 overflow-hidden flex items-center justify-center shadow-inner">
          {friend.graduationPhotoUrl ? (
            <img 
              src={friend.graduationPhotoUrl} 
              alt={friend.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
               <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center mb-3">
                 <span className="text-secondary/50 text-2xl font-serif">{friend.name[0]}</span>
               </div>
               <span className="text-secondary/40 font-medium text-sm tracking-wide">CHƯA CÓ ẢNH</span>
            </div>
          )}
          
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(e); }}
            className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg hover:scale-110"
            title="Tải ảnh lên"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      </motion.div>

      {/* Info below frame */}
      <motion.div 
        animate={{ y: isHovered ? -16 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mt-5 text-center"
      >
        <h4 className="font-heading text-xl font-bold" style={{ color: getDarkPastel(friend.accentColor) }}>{friend.name}</h4>
        <p className="text-secondary/70 text-sm mt-1">{friend.graduation?.date}</p>
      </motion.div>
    </motion.div>
  );
}
