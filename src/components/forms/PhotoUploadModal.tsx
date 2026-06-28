"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";
import { useData } from "@/lib/DataProvider";
import { uploadImage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ["Film", "Kỹ thuật số", "Sự kiện", "Polaroid"];

export function PhotoUploadModal({ isOpen, onClose }: Props) {
  const { friends } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Kỹ thuật số");
  const [uploader, setUploader] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !uploader) {
      alert("Vui lòng điền đủ thông tin và chọn ảnh.");
      return;
    }
    
    setIsSaving(true);
    setIsUploading(true);
    
    const imageUrl = await uploadImage(file, 'gallery');
    
    if (!imageUrl) {
      alert("Tải ảnh lên thất bại.");
      setIsSaving(false);
      setIsUploading(false);
      return;
    }

    // Attempt to determine aspect ratio (this is simplistic, ideally done via Image object, but 'aspect-square' is safe fallback)
    // We'll just assign aspect-square by default or aspect-[3/4] randomly for masonry feeling. 
    // Let's do a simple random aspect ratio for the masonry layout to look good.
    const aspects = ["aspect-[3/4]", "aspect-[4/3]", "aspect-square"];
    const randomAspect = aspects[Math.floor(Math.random() * aspects.length)];

    const { error } = await supabase
      .from("gallery_images")
      .insert({
        title,
        description,
        category,
        uploader_name: uploader,
        image_url: imageUrl,
        aspect_ratio: randomAspect
      });

    if (error) {
      alert("Lỗi khi lưu ảnh. Vui lòng thử lại.");
      console.error(error);
    } else {
      window.location.reload(); 
    }
    
    setIsUploading(false);
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
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden z-10"
          >
            <div className="flex justify-between items-center py-3 px-5 border-b border-black/5">
              <h3 className="font-heading text-xl text-primary">Tải ảnh lên</h3>
              <button onClick={onClose} className="p-2 text-secondary hover:text-primary bg-black/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 flex flex-col md:flex-row gap-6 max-h-[85vh] overflow-y-auto">
              
              {/* LEFT: Image Picker */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-secondary">Tải ảnh</label>
                <div className="flex flex-col gap-4 h-full">
                  {previewUrl ? (
                    <div className="relative w-full h-full min-h-[240px] group">
                      <img src={previewUrl} alt="Preview" className="w-full h-full rounded-xl object-cover border" />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer">
                         <span className="text-white font-medium flex items-center gap-2">
                           <Upload size={18} /> Đổi ảnh
                         </span>
                         <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isSaving} />
                      </label>
                    </div>
                  ) : (
                    <label className="w-full h-full min-h-[240px] flex flex-col items-center justify-center gap-3 py-4 border-2 border-dashed border-black/20 rounded-xl cursor-pointer hover:bg-black/5 transition-colors">
                      <Upload size={32} className="text-secondary opacity-50" />
                      <span className="text-sm text-secondary font-medium">Nhấn để chọn ảnh</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isSaving} />
                    </label>
                  )}
                </div>
              </div>

              {/* RIGHT: Fields */}
              <div className="flex-1 flex flex-col gap-5 justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-secondary">Tiêu đề *</label>
                    <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Một khoảnh khắc đáng nhớ..." className="px-3 py-2 text-sm bg-black/5 border border-transparent focus:border-black/20 rounded-xl outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-secondary">Phân loại</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 text-sm bg-black/5 border border-transparent focus:border-black/20 rounded-xl outline-none">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-secondary">Tải lên bởi *</label>
                      <select required value={uploader} onChange={(e) => setUploader(e.target.value)} className="px-3 py-2 text-sm bg-black/5 border border-transparent focus:border-black/20 rounded-xl outline-none">
                        <option value="" disabled>Chọn</option>
                        {friends.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 h-full">
                    <label className="text-sm font-medium text-secondary">Mô tả</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ảnh này ở đâu? Chúng mình đang làm gì?" rows={4} className="px-3 py-2 text-sm bg-black/5 border border-transparent focus:border-black/20 rounded-xl outline-none resize-none flex-1" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving || !file}
                  className="w-full py-2.5 mt-2 bg-primary text-white rounded-xl font-medium flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                  {isUploading ? "Đang tải lên..." : "Lưu ảnh"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
