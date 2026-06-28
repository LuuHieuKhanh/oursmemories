"use client";

import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { GalleryPhotoData } from "@/lib/queries";

interface Props {
  photo: GalleryPhotoData;
  index: number;
  onClick: () => void;
}

export function GalleryPhoto({ photo, index, onClick }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1, ease: "easeOut" }}
      onClick={onClick}
      className={`relative w-full ${photo.aspectRatio} rounded-[20px] overflow-hidden bg-white shadow-sm hover:shadow-lg cursor-pointer group transition-shadow duration-300`}
    >
      {/* Image container */}
      <div className="absolute inset-0 bg-background-secondary p-1.5 rounded-[20px]">
        <div className="w-full h-full rounded-[16px] overflow-hidden relative">
          {photo.url ? (
            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-105" />
          ) : (
             <div className="w-full h-full flex flex-col items-center justify-center bg-background-secondary border border-black/5 transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-105">
                <span className="text-3xl opacity-30 mb-2">📷</span>
                <span className="text-caption text-[10px] uppercase tracking-widest">Ảnh trống</span>
             </div>
          )}

          {/* Expand Icon */}
          <div className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm translate-y-2 group-hover:translate-y-0">
            <Maximize2 size={16} strokeWidth={2} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
