import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { MediaCard } from '../components/MediaCard';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Plus, Search, X, Filter, Heart, Calendar, Trash2, Grid, Layout, Settings, Film, Tv, Clock } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type SortOption = 'date' | 'name' | 'rating';
type MediaFilter = 'all' | 'movies' | 'shows';

export function Favorites() {
  const { favorites } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [showSettings, setShowSettings] = useState(false);

  const watchTime = favorites.movies.reduce((total, movie) => total + (movie.runtime || 0), 0);
  const hours = Math.floor(watchTime / 60);
  const minutes = watchTime % 60;

  // Combiner et filtrer les médias
  const allMedia = [
    ...favorites.movies.map(movie => ({ item: movie, type: 'movie' as const })),
    ...favorites.shows.map(show => ({ item: show, type: 'tv' as const }))
  ].filter(({ item }) => {
    const title = 'title' in item ? item.title : item.name;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  }).filter(({ type }) => {
    if (mediaFilter === 'all') return true;
    if (mediaFilter === 'movies') return type === 'movie';
    return type === 'tv';
  }).sort((a, b) => {
    const titleA = 'title' in a.item ? a.item.title : a.item.name;
    const titleB = 'title' in b.item ? b.item.title : b.item.name;
    
    switch (sortBy) {
      case 'name':
        return titleA.localeCompare(titleB);
      case 'rating':
        return b.item.vote_average - a.item.vote_average;
      case 'date':
      default:
        const dateA = 'release_date' in a.item ? a.item.release_date : a.item.first_air_date;
        const dateB = 'release_date' in b.item ? b.item.release_date : b.item.first_air_date;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    }
  });

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres intégrés */}
      <div className="sticky top-16 z-40 bg-[#141414]/95 backdrop-blur-xl border-b border-theme shadow-lg -mx-4 px-4">
        <div className="flex flex-col gap-4 py-4">
          {/* Barre de recherche et filtres */}
          <div className="flex items-center gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher dans vos favoris..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-transparent text-white placeholder-gray-500 rounded-lg outline-none border border-theme border-theme-focus transition-colors"
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

            {/* Séparateur */}
            <div className="h-8 w-px bg-theme" />

            {/* Filtres par type */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMediaFilter('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  mediaFilter === 'all'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Tout</span>
              </button>
              <button
                onClick={() => setMediaFilter('movies')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  mediaFilter === 'movies'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Films</span>
              </button>
              <button
                onClick={() => setMediaFilter('shows')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  mediaFilter === 'shows'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Séries</span>
              </button>
            </div>

            {/* Séparateur */}
            <div className="h-8 w-px bg-theme" />

            {/* Options de tri */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy('date')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  sortBy === 'date'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  sortBy === 'name'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Nom</span>
              </button>
            </div>

            {/* Séparateur */}
            <div className="h-8 w-px bg-theme" />

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
          </div>
        </div>
      </div>

      {/* Grille de médias */}
      {allMedia.length > 0 ? (
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-6'
            : 'space-y-4'
        }`}>
          {allMedia.map(({ item, type }) => (
            <MediaCard
              key={`${type}-${item.id}`}
              item={item}
              type={type}
              showProviders={true}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun favori</h3>
          <p className="text-gray-400">
            Ajoutez des films et des séries à vos favoris pour les retrouver ici.
          </p>
        </div>
      )}
    </div>
  );
}