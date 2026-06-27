"use client";

import { motion } from "framer-motion";
import { FriendData } from "@/lib/queries";
import { Plus } from "lucide-react";

interface IDCardProps {
  friend: FriendData;
  index: number;
  total: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  isMobile?: boolean;
}

const FRIEND_COLORS = {
  "Khánh": { accent: "var(--baby-blue)", text: "#5A9DB5" },
  "Nguyên": { accent: "var(--lavender)", text: "#8670A8" },
  "Ngân": { accent: "var(--peach)", text: "#C77A5C" },
  "Linh": { accent: "var(--mint)", text: "#73AB85" },
  "Châu": { accent: "var(--coral)", text: "#C77353" },
};

export function IDCard({ friend, index, total, hoveredId, setHoveredId, onClick, onEdit, isMobile = false }: IDCardProps) {
  const isHovered = hoveredId === friend.id;
  
  const colors = FRIEND_COLORS[friend.name as keyof typeof FRIEND_COLORS] || { accent: "var(--baby-blue)", text: "#5A9DB5" };
  
  // Base desktop calculations
  const centerIndex = Math.floor(total / 2);
  const offsetFromCenter = index - centerIndex;
  
  // Base x offset (each card overlaps by being closer to center)
  const baseDesktopX = offsetFromCenter * 180; 
  // Base y offset (center card is highest, outer cards lower)
  const baseY = Math.abs(offsetFromCenter) * 15;
  // Base rotation (-3 to +3 degrees)
  const baseRotate = offsetFromCenter * 3;

  // Calculate dynamic X offset when hovering
  let dynamicX = baseDesktopX;
  if (!isMobile && hoveredId && hoveredId !== friend.id) {
    const hoveredIndex = 0; // Note: Referenced FRIENDS_DATA in original, simplified to match provided context
    if (index < hoveredIndex) dynamicX -= 40; // Move left
    if (index > hoveredIndex) dynamicX += 40; // Move right
  }

  // Combine variants for desktop vs mobile
  const animateProps = isMobile ? {
    y: isHovered ? -10 : 0,
    scale: isHovered ? 1.02 : 1,
    zIndex: isHovered ? 50 : 10,
    rotate: (index % 2 === 0 ? -2 : 2),
  } : {
    x: dynamicX,
    y: isHovered ? baseY - 20 : baseY,
    scale: isHovered ? 1.05 : 1,
    rotate: isHovered ? 0 : baseRotate,
    zIndex: isHovered ? 50 : 20 - Math.abs(offsetFromCenter), // Base z-index makes center highest unless hovered
  };

  return (
    <motion.div
      animate={animateProps}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => !isMobile && setHoveredId(friend.id)}
      onHoverEnd={() => !isMobile && setHoveredId(null)}
      onClick={onClick}
      className={`
        group
        ${isMobile ? "relative" : "absolute"}
        w-[240px] h-[360px] bg-card rounded-[24px] shadow-sm hover:shadow-xl cursor-pointer
        flex flex-col items-center pt-6 pb-0 overflow-hidden border border-black/5
      `}
      style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23noise)\\' opacity=\\'0.03\\'/%3E%3C/svg%3E')"
      }}
    >
      {/* Punched hole at top center */}
      <div className="absolute top-4 w-12 h-2.5 rounded-full border border-black/10 bg-background-secondary shadow-inner" />
      
      {/* Portrait */}
      <div className="w-[160px] h-[200px] mt-8 rounded-[16px] overflow-hidden flex items-center justify-center relative">
        {friend.imageSrc ? (
          <img src={friend.imageSrc} alt={friend.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-secondary opacity-30 font-medium">NO PHOTO</span>
        )}
        
        <button 
          onClick={onEdit}
          className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md hover:scale-110"
          title="Edit Profile"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Name */}
      <div 
        className="mt-8 font-heading text-[24px] font-bold relative z-10"
        style={{ color: colors.text }}
      >
        {friend.name}
      </div>

      {/* Bottom accent strip */}
      <div 
        className="absolute bottom-0 left-0 w-full h-5"
        style={{ backgroundColor: colors.accent }}
      />
    </motion.div>
  );
}
