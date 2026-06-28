"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "@/lib/DataProvider";
import { supabase } from "@/lib/supabase";

interface Props {
  photoIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function GalleryModal({ photoIndex, isOpen, onClose, onNavigate }: Props) {
  const { friends, gallery } = useData();
  const photo = photoIndex !== null ? gallery[photoIndex] : null;
  const [commentText, setCommentText] = useState("");
  const [selectedUser, setSelectedUser] = useState(friends[0]?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listen to keyboard for navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onNavigate(photoIndex !== null && photoIndex > 0 ? photoIndex - 1 : gallery.length - 1);
      } else if (e.key === "ArrowRight") {
        onNavigate(photoIndex !== null && photoIndex < gallery.length - 1 ? photoIndex + 1 : 0);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, photoIndex, gallery.length, onNavigate, onClose]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !photo) return;
    
    setIsSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      image_id: photo.id,
      author_name: selectedUser,
      content: commentText.trim()
    });
    
    if (error) {
      console.error(error);
      alert("Failed to add comment.");
    } else {
      window.location.reload(); // Simple refresh to show new comment
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-2 lg:p-4">
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/90"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[95vw] max-w-[1600px] h-full md:h-[98vh] bg-background flex flex-col lg:flex-row md:rounded-[24px] overflow-hidden z-10 shadow-2xl"
          >
            {/* Close Button Mobile */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20 lg:hidden backdrop-blur-md"
            >
              <X size={20} />
            </button>

            {/* LEFT: PHOTO */}
            <div className="w-full lg:w-[45%] xl:w-[40%] h-[40vh] lg:h-full bg-black flex items-center justify-center relative group">
              {photo.url ? (
                <img src={photo.url} alt={photo.title} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50 border border-white/10 m-4 rounded-xl bg-white/5">
                   <span className="text-4xl opacity-50 mb-4">📷</span>
                   <span className="text-xs uppercase tracking-widest">{photo.category} placeholder</span>
                </div>
              )}
              
              {/* Navigation Arrows */}
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate(photoIndex !== null && photoIndex > 0 ? photoIndex - 1 : gallery.length - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate(photoIndex !== null && photoIndex < gallery.length - 1 ? photoIndex + 1 : 0); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* RIGHT: INFO & COMMENTS */}
            <div className="w-full lg:w-[55%] xl:w-[60%] h-[60vh] lg:h-full bg-white flex flex-col overflow-hidden relative">
              <button 
                onClick={onClose}
                className="hidden lg:flex absolute top-6 right-6 p-2 rounded-full text-caption hover:bg-black/5 transition-colors z-20"
              >
                <X size={24} strokeWidth={1.5} />
              </button>

              <div className="flex-1 overflow-y-auto scrollbar-hide p-6 lg:p-10 pt-4 lg:pt-6">
                {/* Header Info */}
                <div className="mb-4 pb-4 border-b border-divider">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-2 leading-tight">{photo.title}</h3>
                  <p className="text-secondary/90 leading-relaxed mb-3">{photo.description}</p>
                  <div className="flex items-center gap-2 text-xs text-caption">
                    <span>Tải lên bởi <strong>{photo.uploader}</strong></span>
                    <span>•</span>
                    <span>{photo.date}</span>
                  </div>
                </div>

                {/* Comments List */}
                <div className="flex flex-col gap-4 mb-4">
                  <h4 className="font-heading text-xs uppercase tracking-widest text-primary font-medium">Bình luận ({photo.comments.length})</h4>
                  
                  {photo.comments.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-caption italic border border-dashed border-divider rounded-[16px]">
                      <span className="text-2xl mb-2 opacity-50">✍️</span>
                      <span className="text-sm">Chưa có bình luận nào.</span>
                    </div>
                  ) : (
                    photo.comments.map((comment) => (
                      <div key={comment.id} className="py-2 border-b border-divider/50 last:border-b-0">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-primary text-xs">{comment.author}</span>
                           <span className="text-[10px] text-caption font-medium">•</span>
                           <span className="text-[10px] text-caption font-medium">{comment.date}</span>
                        </div>
                        <p className="text-secondary text-sm leading-snug">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="p-4 lg:p-6 bg-white border-t border-divider shrink-0">
                <div className="flex flex-row items-center gap-3">
                   <select 
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-[110px] shrink-0 text-xs bg-background-secondary border border-divider rounded-full px-4 py-3.5 text-primary font-bold focus:outline-none focus:border-black/20 appearance-none text-center transition-colors"
                      style={{ backgroundImage: 'none' }}
                   >
                     {friends.map(f => (
                       <option key={f.id} value={f.name}>{f.name}</option>
                     ))}
                   </select>
                  
                   <input 
                     type="text" 
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     placeholder="Viết bình luận..."
                     className="flex-1 bg-background-secondary border border-divider rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-black/20 transition-colors"
                   />
                   
                   <button 
                       type="submit"
                       disabled={isSubmitting || !commentText.trim()}
                       className="shrink-0 p-3.5 rounded-full bg-primary text-white hover:bg-black transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
                   >
                      <Send size={16} />
                   </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
