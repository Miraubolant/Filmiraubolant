import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie, TVShow } from '../../types/tmdb';
import { Star, Calendar, Monitor } from 'lucide-react';

interface QuickPreviewProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  isVisible: boolean;
  position: { x: number; y: number };
}

export function QuickPreview({ item, type, isVisible, position }: QuickPreviewProps) {
  if (!isVisible) return null;

  const title = type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const date = type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            zIndex: 1000,
          }}
          className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4"
        >
          <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-500">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-500">
                  {new Date(date).getFullYear()}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {item.overview}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}