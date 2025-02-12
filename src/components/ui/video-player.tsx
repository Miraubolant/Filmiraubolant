import React from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  // Extraire l'ID de la vidéo de l'URL YouTube
  const videoId = src.split('embed/')[1]?.split('?')[0];
  
  if (!videoId) return null;
  
  // Construire l'URL de la vignette et de la vidéo
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-video rounded-xl overflow-hidden group"
    >
      <img
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
      </div>
    </a>
  );
}