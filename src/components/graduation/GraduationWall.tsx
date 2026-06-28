"use client";

import { useState } from "react";
import { GraduationPhotoCard } from "./GraduationPhotoCard";
import { GraduationPhotoModal } from "./GraduationPhotoModal";
import { useData } from "@/lib/DataProvider";
import { ProfileFormModal } from "../forms/ProfileFormModal";

export function GraduationWall() {
  const { friends } = useData();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editingFriendId, setEditingFriendId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative w-full pt-16 pb-24 md:pt-20 md:pb-32 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle abstract background */}
      <div className="absolute top-1/4 left-[5%] md:left-[10%] w-64 h-64 md:w-96 md:h-96 border border-black/5 rounded-full pointer-events-none opacity-20" />
      <div className="absolute bottom-1/4 right-[5%] md:right-[10%] w-80 h-80 md:w-[500px] md:h-[500px] border border-black/5 rounded-full pointer-events-none opacity-20" />

      {/* Soft spotlight behind hovered photo */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/50 blur-[120px] pointer-events-none transition-opacity duration-700 ${hoveredId ? "opacity-100" : "opacity-0"}`} 
      />

      <div className="text-center mb-6 md:mb-8 z-10 relative">
        <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary tracking-tight">Góc Lễ Phục</h2>
        <p className="mt-4 text-secondary/80 text-lg md:text-xl leading-relaxed">
          Những ngày khác biệt. <br />
          Cùng chung đích đến.
        </p>
      </div>

      <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-8 z-10">
        {/* Desktop: Grid/Flex */}
        <div className="hidden lg:flex justify-center items-center gap-10">
          {friends.map((friend, index) => (
            <GraduationPhotoCard 
              key={friend.id}
              friend={friend}
              index={index}
              isHovered={hoveredId === friend.id}
              onHover={() => setHoveredId(friend.id)}
              onHoverEnd={() => setHoveredId(null)}
              onEdit={(e) => { e.stopPropagation(); setEditingFriendId(friend.id); }}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
        
        {/* Tablet: 3 top, 2 bottom */}
        <div className="hidden md:flex lg:hidden flex-col items-center gap-12">
           <div className="flex justify-center gap-10">
              {friends.slice(0,3).map((friend, index) => (
                <GraduationPhotoCard 
                  key={friend.id}
                  friend={friend}
                  index={index}
                  isHovered={hoveredId === friend.id}
                  onHover={() => setHoveredId(friend.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onEdit={(e) => { e.stopPropagation(); setEditingFriendId(friend.id); }}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
           </div>
           <div className="flex justify-center gap-10">
              {friends.slice(3,5).map((friend, index) => (
                <GraduationPhotoCard 
                  key={friend.id}
                  friend={friend}
                  index={index + 3}
                  isHovered={hoveredId === friend.id}
                  onHover={() => setHoveredId(friend.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onEdit={(e) => { e.stopPropagation(); setEditingFriendId(friend.id); }}
                  onClick={() => setSelectedIndex(index + 3)}
                />
              ))}
           </div>
        </div>

        {/* Mobile: Wrap Stack */}
        <div className="flex md:hidden flex-wrap justify-center gap-10 pb-12 pt-8 px-4">
          {friends.map((friend, index) => (
            <div key={friend.id} className="w-[280px]">
               <GraduationPhotoCard 
                friend={friend}
                index={index}
                isHovered={hoveredId === friend.id}
                onHover={() => setHoveredId(friend.id)}
                onHoverEnd={() => setHoveredId(null)}
                onEdit={(e) => { e.stopPropagation(); setEditingFriendId(friend.id); }}
                onClick={() => setSelectedIndex(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <GraduationPhotoModal 
        friendIndex={selectedIndex}
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />

      <ProfileFormModal 
        friendId={editingFriendId}
        isOpen={!!editingFriendId}
        onClose={() => setEditingFriendId(null)}
        context="graduation"
      />
    </section>
  );
}
