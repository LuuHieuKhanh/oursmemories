"use client";

import { useState } from "react";
import { GALLERY_CATEGORIES, GALLERY_PHOTOS } from "@/lib/data";
import { GalleryPhoto } from "./GalleryPhoto";
import { GalleryModal } from "./GalleryModal";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/lib/DataProvider";
import { PhotoUploadModal } from "../forms/PhotoUploadModal";
import { Plus } from "lucide-react";

export function MemoryGallery() {
  const { gallery } = useData();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const filterCategories = ["Tất cả", "Khánh", "Nguyên", "Ngân", "Linh", "Châu"];

  const filteredPhotos = activeCategory === "Tất cả" 
    ? gallery 
    : gallery.filter(p => p.uploader === activeCategory);

  const displayPhotos = isCollapsed ? filteredPhotos.slice(0, 8) : filteredPhotos;

  return (
    <section className="relative w-full pt-8 pb-20 bg-background flex flex-col items-center overflow-hidden min-h-screen">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between px-4 mb-8 z-10 relative">
        <div className="hidden md:block md:w-[300px]" /> {/* Spacer */}
        
        <div className="text-center flex flex-col items-center">
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary tracking-tight">
            Thư viện Kỷ niệm
          </h2>
          <p className="mt-3 text-secondary/80 text-lg md:text-xl leading-relaxed">
            Mỗi khoảnh khắc bình dị <br className="md:hidden" />
            đều trở thành kỷ niệm khó quên.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-6 md:mt-0 md:w-[300px] justify-end">
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-full transition-all flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2.5} /> Thêm ảnh
          </button>
          
          {filteredPhotos.length > 8 && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="px-4 py-2.5 bg-black/5 hover:bg-black/10 text-primary rounded-full transition-colors text-sm font-medium whitespace-nowrap"
            >
              {isCollapsed ? "Xem thêm" : "Thu gọn"}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4 mb-8 z-10">
        {filterCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
              activeCategory === category 
                ? "bg-primary text-white border-primary shadow-md scale-105" 
                : "bg-white text-secondary border-black/5 hover:bg-black/5 hover:border-black/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Layout via CSS columns */}
      <div className="w-full max-w-[1400px] px-4 md:px-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {filteredPhotos.length > 0 ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {displayPhotos.map((photo, index) => {
                  const absoluteIndex = gallery.findIndex(p => p.id === photo.id);
                  return (
                    <div key={photo.id} className="break-inside-avoid mb-4">
                      <GalleryPhoto 
                        photo={photo}
                        index={index}
                        onClick={() => {
                          if (!photo.url) {
                            setIsUploadOpen(true);
                          } else {
                            setSelectedIndex(absoluteIndex);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-20 opacity-60">
                <span className="text-6xl mb-4">📷</span>
                <p className="text-xl text-primary font-medium tracking-wide">Chưa có ảnh nào, hãy tạo thêm nhé</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <GalleryModal 
        photoIndex={selectedIndex}
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />

      <PhotoUploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </section>
  );
}
