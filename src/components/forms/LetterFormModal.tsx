"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Send } from "lucide-react";
import { useData } from "@/lib/DataProvider";
import { supabase } from "@/lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function LetterFormModal({ isOpen, onClose }: Props) {
  const { friends } = useData();
  const [isSaving, setIsSaving] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  
  // Filter out friends who already wrote a letter
  const availableFriends = friends.filter(f => !f.letter);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !content.trim()) {
      alert("Vui lòng chọn tên và viết nội dung thư.");
      return;
    }
    
    setIsSaving(true);
    
    const { error } = await supabase
      .from("letters")
      .insert({
        author_name: authorName,
        content: content
      });

    if (error) {
      alert("Lỗi khi lưu thư. Vui lòng thử lại.");
      console.error(error);
    } else {
      window.location.reload(); // Quick way to refresh data
    }
    setIsSaving(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-card rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-10 flex flex-col border border-black/5"
          >
            <form onSubmit={handleSave} className="flex flex-col h-full">
              <div className="flex justify-between items-center px-8 pt-8 pb-4 shrink-0 gap-4 border-b border-transparent">
                {/* Left: Title */}
                <h3 className="font-heading text-xl md:text-2xl text-primary font-bold whitespace-nowrap shrink-0">
                  Viết thư
                </h3>

                {/* Middle: Controls */}
                <div className="flex-1 flex items-center justify-center gap-3">
                  {availableFriends.length > 0 && (
                    <>
                      <div className="relative w-40 shrink-0">
                        <select 
                          value={authorName} 
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="w-full h-10 pl-5 pr-8 bg-background border-2 border-black/5 hover:border-black/10 focus:border-primary rounded-full outline-none appearance-none transition-all cursor-pointer font-heading font-medium text-base text-primary shadow-sm"
                        >
                          <option value="" disabled>Tên</option>
                          {availableFriends.map(f => (
                            <option key={f.id} value={f.name}>{f.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-10 h-10 shrink-0 bg-primary text-white rounded-full flex justify-center items-center hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                        title="Gửi thư"
                      >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} className="-ml-0.5 mt-0.5" />}
                      </button>
                    </>
                  )}
                </div>

                {/* Right: Close (If user meant left, we can easily change flex-order, but standard UX is right) */}
                <button type="button" onClick={onClose} className="w-10 h-10 flex justify-center items-center text-secondary hover:text-primary bg-black/5 hover:bg-black/10 rounded-full transition-colors shrink-0">
                  <X size={18} />
                </button>
              </div>

              <div className="px-8 pb-8 pt-2 flex flex-col h-full">
                {availableFriends.length === 0 ? (
                  <div className="py-16 w-full text-center text-secondary">
                    Mọi người đều đã viết thư rồi!
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col h-full">
                    <div className="relative w-full h-full min-h-[400px] rounded-3xl bg-white p-6 shadow-sm border border-black/5 focus-within:border-primary/20 focus-within:shadow-md transition-all">
                      {/* Subtler lines decoration */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px)", backgroundSize: "100% 32px", marginTop: "36px" }}></div>
                      <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="Chào các bạn... (Viết thư của bạn ở đây)" 
                        rows={14} 
                        className="relative z-10 w-full h-full bg-transparent outline-none resize-none font-handwriting text-2xl md:text-3xl leading-[32px] text-primary placeholder:text-primary/30" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
