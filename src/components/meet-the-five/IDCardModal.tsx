"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/lib/DataProvider";
import { X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface IDCardModalProps {
  friendId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IDCardModal({ friendId, isOpen, onClose }: IDCardModalProps) {
  const { friends } = useData();
  const friend = friends.find((f) => f.id === friendId);

  const [isAddingHof, setIsAddingHof] = useState(false);
  const [hofNickname, setHofNickname] = useState("");
  const [hofGiver, setHofGiver] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddHof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hofNickname || !hofGiver || !friend) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('nicknames').insert({
      receiver_id: friend.id,
      nickname: hofNickname,
      giver_name: hofGiver
    });
    setIsSubmitting(false);
    if (!error) {
      setIsAddingHof(false);
      setHofNickname("");
      setHofGiver("");
      window.location.reload();
    } else {
      alert("Error adding nickname");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && friend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-background/60"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[900px] bg-card rounded-[32px] shadow-2xl border border-black/5 overflow-hidden flex flex-col md:flex-row z-10"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23noise)\\' opacity=\\'0.02\\'/%3E%3C/svg%3E')"
            }}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-background-secondary text-primary hover:bg-black/5 transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* LEFT COLUMN */}
            <div className="w-full md:w-[45%] bg-background-secondary/50 p-4 md:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-divider relative">
              <div className="w-full flex flex-col items-center mt-1">
                {/* ID Punched hole */}
                <div className="w-14 h-2.5 rounded-full border border-black/10 bg-background shadow-inner mb-4" />
                
                {/* Large Portrait */}
                <div className="w-full aspect-[4/5] max-w-[280px] bg-background border border-black/5 rounded-2xl shadow-sm flex items-center justify-center overflow-hidden">
                   {friend.imageSrc ? (
                    <img src={friend.imageSrc} alt={friend.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-caption text-sm uppercase tracking-widest">Chân dung</span>
                  )}
                </div>
              </div>
              
              <div className="mt-5 mb-2 text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 border-2 border-primary/10 rounded-full flex items-center justify-center opacity-60">
                  <span className="font-heading text-sm">🎓</span>
                </div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-secondary">Bộ sưu tập kỷ niệm</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-caption">2022–2026</p>
              </div>

              {/* Pastel strip */}
              <div 
                className="absolute bottom-0 left-0 w-full h-3"
                style={{ backgroundColor: friend.accentColor }}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-[55%] p-5 md:p-6 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-4"
              >
                <h3 className="font-handwriting text-4xl md:text-5xl text-primary mb-1" style={{ color: friend.accentColor }}>{friend.fullName}</h3>
                <p className="text-base md:text-lg text-secondary font-medium mt-0.5">{friend.faculty}</p>
                <p className="text-xs md:text-sm text-caption">{friend.course}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-2"
              >
                <div className="flex items-center gap-4 mb-3">
                  <h4 className="font-heading text-xs uppercase tracking-widest text-caption">
                    Biệt danh
                  </h4>
                  <div className="h-[1px] flex-1 bg-divider" />
                  <button 
                    onClick={() => setIsAddingHof(!isAddingHof)}
                    className="text-[11px] px-3 py-1 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                  >
                    {isAddingHof ? "Hủy" : "+ Thêm"}
                  </button>
                </div>
                
                <AnimatePresence>
                  {isAddingHof && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddHof} 
                      className="mb-3 p-3 rounded-xl bg-black/5 flex flex-col gap-2 overflow-hidden"
                    >
                      <input type="text" placeholder="Nhập biệt danh..." value={hofNickname} onChange={e => setHofNickname(e.target.value)} required className="px-3 py-1 text-sm bg-white border border-transparent focus:border-black/20 rounded-lg outline-none" />
                      <select 
                        value={hofGiver} 
                        onChange={e => setHofGiver(e.target.value)} 
                        required 
                        className="px-3 py-1 text-sm bg-white border border-transparent focus:border-black/20 rounded-lg outline-none cursor-pointer"
                      >
                        <option value="" disabled>Ai đã đặt biệt danh này...</option>
                        {friends.filter(f => f.id !== friend.id).map(f => (
                          <option key={f.id} value={f.name}>{f.name}</option>
                        ))}
                      </select>
                      <button type="submit" disabled={isSubmitting} className="w-full py-1.5 mt-1 bg-primary text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors">
                        {isSubmitting ? "Đang lưu..." : "Lưu biệt danh"}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(friend.hallOfFame || []).map((hof, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                      key={idx} 
                      className="bg-background-secondary/80 rounded-lg p-2 border border-black/5 flex flex-col justify-center"
                    >
                      <span className="font-bold text-primary text-[13px]">{hof.nickname}</span>
                      <span className="text-[10px] text-caption mt-0.5 italic">— Đặt bởi {hof.giver}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
