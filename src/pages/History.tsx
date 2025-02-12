import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { MediaCard } from '../components/MediaCard';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Search, Trash2, Calendar, Grid, Layout, X } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'oldest' | 'name';

export function History() {
  const { watchHistory, clearHistory } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Filtrer et trier l'historique
  const filteredHistory = [...watchHistory]
    .filter(entry => {
      const title = entry.type === 'movie' 
        ? entry.item.title 
        : entry.item.name;
      return title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.watchedAt).getTime() - new Date(b.watchedAt).getTime();
        case 'name':
          const titleA = a.type === 'movie' ? a.item.title : a.item.name;
          const titleB = b.type === 'movie' ? b.item.title : b.item.name;
          return titleA.localeCompare(titleB);
        default: // recent
          return new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime();
      }
    });

  const sortOptions = [
    { value: 'recent', label: 'Plus récents', icon: Calendar },
    { value: 'oldest', label: 'Plus anciens', icon: HistoryIcon },
    { value: 'name', label: 'Nom', icon: Layout }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="sticky top-16 z-40 bg-[#141414]/95 backdrop-blur-xl border-b border-gray-800 shadow-lg -mx-4 px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-red-600" />
            <h2 className="text-4xl font-bold">
              <span className="text-white">Historique de</span>
              <span className="ml-2 text-red-600">Visionnage</span>
            </h2>
          </div>

          {/* Barre de recherche et contrôles sur la même ligne */}
          <div className="flex items-center gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher dans l'historique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-transparent text-white placeholder-gray-500 rounded-lg outline-none border border-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-[50%] -translate-y-[50%] w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Séparateur vertical */}
            <div className="h-8 w-px bg-gray-700" />

            {/* Options de tri */}
            <div className="flex items-center gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    sortBy === option.value
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>

            {/* Séparateur vertical */}
            <div className="h-8 w-px bg-gray-700" />

            {/* Vue grille/liste */}
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              {viewMode === 'grid' ? (
                <Layout className="w-5 h-5" />
              ) : (
                <Grid className="w-5 h-5" />
              )}
            </button>

            {/* Séparateur vertical */}
            <div className="h-8 w-px bg-gray-700" />

            {/* Bouton pour vider l'historique */}
            <button
              onClick={clearHistory}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Vider l'historique"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grille de médias */}
      {filteredHistory.length > 0 ? (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'
          : 'space-y-4'
        }>
          {filteredHistory.map(({ item, type, watchedAt }) => (
            <motion.div
              key={`${item.id}-${watchedAt}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <MediaCard item={item} type={type} showProviders={true} />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm text-white">
                  Vu le {new Date(watchedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <HistoryIcon className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun historique</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Commencez à regarder des films et des séries pour construire votre historique.
          </p>
        </div>
      )}
    </div>
  );
}