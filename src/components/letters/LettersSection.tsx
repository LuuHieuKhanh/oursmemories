"use client";

import { useState } from "react";
import { Envelope } from "./Envelope";
import { LetterModal } from "./LetterModal";
import { useData } from "@/lib/DataProvider";
import { LetterFormModal } from "../forms/LetterFormModal";
import { Plus } from "lucide-react";

export function LettersSection() {
  const { friends } = useData();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const friendsWithLetters = friends.filter(f => f.letter);
  const hasLetters = friendsWithLetters.length > 0;

  // Natural rotations for the envelopes
  const rotations = [-3, 2, -1, 4, -2];

  return (
    <section className="relative w-full pt-16 pb-8 md:pt-24 md:pb-12 bg-[#FCFBF8] flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle texture for the section background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23noise)\\' opacity=\\'1\\'/%3E%3C/svg%3E')"
      }} />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 md:left-24 opacity-30 text-2xl rotate-[15deg] pointer-events-none">🌸</div>
      <div className="absolute top-40 right-10 md:right-32 opacity-20 text-xl rotate-[-10deg] pointer-events-none">✨</div>
      <div className="absolute bottom-32 right-10 md:right-32 w-64 h-64 bg-orange-100/30 rounded-full blur-[80px] pointer-events-none" />

      <div className="text-center mb-8 md:mb-12 z-10">
        <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary tracking-tight inline-flex items-center gap-4">
          Thư gửi thanh xuân
          <button 
            onClick={() => setIsFormOpen(true)}
            className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full transition-colors"
            title="Viết thư"
          >
            <Plus size={24} />
          </button>
        </h2>
        <p className="mt-4 text-secondary/80 text-lg md:text-xl leading-relaxed italic font-serif">
          "Có những điều viết ra <br className="md:hidden" />
          luôn dễ hơn là nói thành lời."
        </p>
      </div>

      {/* Envelopes Container */}
      {hasLetters ? (
        <div className="relative w-full max-w-6xl mx-auto flex flex-wrap justify-center gap-12 md:gap-16 px-4 z-10">
          {friendsWithLetters.map((friend, index) => {
            // Find absolute index to pass to LetterModal so it knows which friend's letter to show
            const absoluteIndex = friends.findIndex(f => f.id === friend.id);
            return (
              <div key={friend.id} className="relative">
                 <Envelope 
                    friend={friend}
                    rotation={rotations[index % rotations.length]}
                    onClick={() => setSelectedIndex(absoluteIndex)}
                 />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="z-10 flex flex-col items-center justify-center p-12 bg-white/50 rounded-2xl border border-black/5 backdrop-blur-sm max-w-lg mx-auto">
          <p className="text-secondary/60 text-lg mb-6 text-center">Chưa có ai viết thư cả.</p>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus size={18} /> Viết lá thư đầu tiên
          </button>
        </div>
      )}

      <LetterModal 
        friendIndex={selectedIndex} 
        isOpen={selectedIndex !== null} 
        onClose={() => setSelectedIndex(null)} 
        onNavigate={setSelectedIndex}
      />

      <LetterFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </section>
  );
}
