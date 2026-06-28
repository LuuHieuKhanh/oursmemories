"use client";

import { useState } from "react";
import { IDCard } from "./IDCard";
import { IDCardModal } from "./IDCardModal";
import { useData } from "@/lib/DataProvider";
import { ProfileFormModal } from "../forms/ProfileFormModal";
import { Plus } from "lucide-react";

export function MeetTheFive() {
  const { friends } = useData();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [editingFriendId, setEditingFriendId] = useState<string | null>(null);

  return (
    <section className="relative w-full pt-16 pb-16 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative doodles */}
      <div className="absolute top-20 left-12 opacity-40 text-xl pointer-events-none">✨</div>
      <div className="absolute bottom-32 right-16 opacity-40 text-xl pointer-events-none">🌸</div>
      <div className="absolute top-40 right-24 opacity-30 text-lg pointer-events-none">✈️</div>

      <div className="text-center mb-4 z-10">
        <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary tracking-tight">Hội Ngũ Quái</h2>
        <p className="mt-2 text-secondary/80 text-lg md:text-xl leading-relaxed">
          Năm mảnh ghép khác biệt. <br />
          Một thanh xuân rực rỡ.
        </p>
      </div>

      {/* Desktop/Tablet Cards container */}
      <div className="relative w-full max-w-5xl h-[400px] hidden md:flex justify-center items-center px-4">
        {friends.map((friend, index) => (
          <IDCard 
            key={friend.id}
            friend={friend}
            index={index}
            total={friends.length}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            onClick={() => setSelectedFriendId(friend.id)}
            onEdit={(e) => { e.stopPropagation(); setEditingFriendId(friend.id); }}
          />
        ))}
      </div>

      {/* Mobile Wrap Stack */}
      <div className="w-full flex md:hidden flex-wrap justify-center gap-8 px-4 pb-12 mt-8">
        {friends.map((friend, index) => (
          <div key={friend.id} className="w-[280px]">
            <IDCard 
              friend={friend}
              index={index}
              total={friends.length}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onClick={() => setSelectedFriendId(friend.id)}
              onEdit={(e) => { e.stopPropagation(); setEditingFriendId(friend.id); }}
              isMobile
            />
          </div>
        ))}
      </div>

      <p className="mt-8 text-caption text-sm uppercase tracking-widest opacity-60">Nhấn vào thẻ để xem chi tiết</p>

      <IDCardModal 
        friendId={selectedFriendId} 
        isOpen={!!selectedFriendId} 
        onClose={() => setSelectedFriendId(null)} 
      />

      <ProfileFormModal 
        friendId={editingFriendId}
        isOpen={!!editingFriendId}
        onClose={() => setEditingFriendId(null)}
        context="profile"
      />
    </section>
  );
}
