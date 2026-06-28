"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";
import { useData } from "@/lib/DataProvider";
import { uploadImage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

interface Props {
  friendId: string | null;
  isOpen: boolean;
  onClose: () => void;
  context?: "profile" | "graduation";
}

export function ProfileFormModal({ friendId, isOpen, onClose, context = "profile" }: Props) {
  const { friends } = useData();
  const friend = friends.find(f => f.id === friendId);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [fullName, setFullName] = useState(friend?.fullName || "");
  const [faculty, setFaculty] = useState(friend?.faculty || "");
  const [course, setCourse] = useState(friend?.course || "");
  const [avatarUrl, setAvatarUrl] = useState(friend?.imageSrc || "");
  const [gradPhotoUrl, setGradPhotoUrl] = useState(friend?.graduationPhotoUrl || "");
  const [gradDate, setGradDate] = useState(friend?.graduation?.date || "");
  const [gradCaption, setGradCaption] = useState(friend?.graduation?.caption || "");

  // Update local state when friend changes
  useState(() => {
    if (friend) {
      setFullName(friend.fullName !== friend.name ? friend.fullName : "");
      setFaculty(friend.faculty !== "Unknown Faculty" ? friend.faculty : "");
      setCourse(friend.course !== "Class of 2026" ? friend.course : "");
      setAvatarUrl(friend.imageSrc);
      setGradPhotoUrl(friend.graduationPhotoUrl);
      setGradDate(friend.graduation?.date || "");
      setGradCaption(friend.graduation?.caption || "");
    }
  });

  if (!friend) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "graduation") => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const file = e.target.files[0];
    const url = await uploadImage(file, type);
    if (url) {
      if (type === "avatar") setAvatarUrl(url);
      else setGradPhotoUrl(url);
    }
    setIsUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const updates = context === "profile" ? {
      full_name: fullName || friend.name,
      faculty: faculty || "Unknown Faculty",
      course: course || "Class of 2026",
      avatar_url: avatarUrl,
    } : {
      graduation_photo_url: gradPhotoUrl,
      graduation_date: gradDate,
      graduation_caption: gradCaption,
    };

    const { error } = await supabase
      .from("persons")
      .update(updates)
      .eq("id", friend.id);

    if (error) {
      alert("Lỗi khi cập nhật hồ sơ. Vui lòng thử lại.");
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
            className={`relative w-full ${context === "graduation" ? "max-w-2xl" : "max-w-md"} bg-white rounded-2xl shadow-xl overflow-hidden z-10`}
          >
            <div className="flex justify-between items-center py-3 px-5 border-b border-black/5">
              <h3 className="font-heading text-xl text-primary">
                Cập nhật {context === "profile" ? "Hồ sơ" : "Lễ Phục"} của {friend.name}
              </h3>
              <button onClick={onClose} className="p-2 text-secondary hover:text-primary bg-black/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className={`p-5 ${context === "graduation" ? "flex flex-col md:flex-row gap-6" : "flex flex-col gap-5"} max-h-[85vh] overflow-y-auto`}>
              {context === "profile" && (
                <div className="flex flex-col gap-5 w-full">
                  {/* Avatar Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-secondary">Ảnh đại diện</label>
                    <div className="flex items-center gap-4">
                      {avatarUrl && <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border" />}
                      <label className="flex-1 flex items-center justify-center gap-2 py-3 border border-dashed border-black/20 rounded-xl cursor-pointer hover:bg-black/5 transition-colors">
                        {isUploading ? <Loader2 size={18} className="animate-spin text-secondary" /> : <Upload size={18} className="text-secondary" />}
                        <span className="text-sm text-secondary">Tải ảnh đại diện</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "avatar")} disabled={isUploading} />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-secondary">Họ và tên</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={friend.name} className="px-3 py-2 text-sm bg-black/5 border border-transparent focus:border-black/20 rounded-xl outline-none" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-secondary">Khoa / Chuyên ngành</label>
                    <input type="text" value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="VD: Công nghệ Thông tin" className="px-3 py-2 text-sm bg-black/5 border border-transparent focus:border-black/20 rounded-xl outline-none" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-secondary">Khóa / Lớp</label>
                    <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="VD: Khóa 2026" className="px-3 py-2 text-sm bg-black/5 border border-transparent focus:border-black/20 rounded-xl outline-none" />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSaving || isUploading}
                    className="w-full py-2.5 mt-2 bg-primary text-white rounded-xl font-medium flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                    Lưu thay đổi
                  </button>
                </div>
              )}

              {context === "graduation" && (
                <>
                   {/* LEFT: Graduation Photo Upload */}
                   <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-medium text-secondary">Ảnh Lễ Phục</label>
                    <div className="flex flex-col gap-4 h-full">
                      {gradPhotoUrl ? (
                        <div className="relative w-full h-full min-h-[240px] group">
                          <img src={gradPhotoUrl} alt="Graduation" className="w-full h-full rounded-xl object-cover border" />
                          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer">
                             <span className="text-white font-medium flex items-center gap-2">
                               <Upload size={18} /> Đổi ảnh
                             </span>
                             <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "graduation")} disabled={isUploading} />
                          </label>
                        </div>
                      ) : (
                        <label className="w-full h-full min-h-[240px] flex flex-col items-center justify-center gap-3 py-4 border-2 border-dashed border-black/20 rounded-xl cursor-pointer hover:bg-black/5 transition-colors">
                          {isUploading ? <Loader2 size={24} className="animate-spin text-secondary" /> : <Upload size={32} className="text-secondary opacity-50" />}
                          <span className="text-sm text-secondary font-medium">Nhấn để tải ảnh lên</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "graduation")} disabled={isUploading} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Info Fields */}
                  <div className="flex-1 flex flex-col gap-5 justify-between">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Ngày nhận bằng</label>
                        <input type="text" value={gradDate} onChange={(e) => setGradDate(e.target.value)} placeholder="VD: Tháng 5 năm 2026" className="px-3 py-2 text-sm bg-black/5 border border-transparent focus:border-black/20 rounded-xl outline-none" />
                      </div>
                      
                      <div className="flex flex-col gap-2 h-full">
                        <label className="text-sm font-medium text-secondary">Cảm nghĩ</label>
                        <textarea value={gradCaption} onChange={(e) => setGradCaption(e.target.value)} placeholder="Viết vài dòng về khoảnh khắc này..." rows={5} className="px-3 py-2 text-sm bg-black/5 border border-transparent focus:border-black/20 rounded-xl outline-none resize-none flex-1" />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSaving || isUploading}
                      className="w-full py-2.5 mt-2 bg-primary text-white rounded-xl font-medium flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                      Lưu thay đổi
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
