import React from 'react';
import { motion } from 'framer-motion';
import { Type, Grid, List, Zap, Eye } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function AccessibilityMenu() {
  const {
    fontSize,
    setFontSize,
    layout,
    setLayout,
    animations,
    setAnimations,
  } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl"
    >
      <div className="space-y-6">
        {/* Taille de police */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
            <Type className="w-4 h-4" />
            Taille du texte
          </h3>
          <div className="flex items-center gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  fontSize === size
                    ? 'bg-purple-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className={size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''}>
                  {size === 'small' ? 'Petit' : size === 'medium' ? 'Moyen' : 'Grand'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Disposition */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
            <Eye className="w-4 h-4" />
            Affichage
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayout('grid')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                layout === 'grid'
                  ? 'bg-purple-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
              Grille
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                layout === 'list'
                  ? 'bg-purple-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
              Liste
            </button>
          </div>
        </div>

        {/* Animations */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
            <Zap className="w-4 h-4" />
            Animations
          </h3>
          <button
            onClick={() => setAnimations(!animations)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              animations
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            {animations ? 'Activées' : 'Désactivées'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}