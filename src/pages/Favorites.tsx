import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { MediaCard } from '../components/MediaCard';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Plus, Search, X, Filter, Heart, Calendar, Trash2, Grid, Layout, Settings, Film, Tv, Clock } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type SortOption = 'date' | 'name' | 'rating';
type MediaType = 'all' | 'movie' | 'tv';

export function Favorites() {
  const { favorites, customLists } = useStore();
  const [activeTab, setActiveTab] = useState<'favorites' | 'lists'>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [mediaType, setMediaType] = useState<MediaType>('all');

  const tabs = [
    { id: 'favorites', label: 'Favoris', icon: Heart },
    { id: 'lists', label: 'Mes Listes', icon: List }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'name', label: 'Nom', icon: List }
  ];

  const mediaTypes = [
    { value: 'all', label: 'Tous', icon: Heart },
    { value: 'movie', label: 'Films', icon: Film },
    { value: 'tv', label: 'Séries', icon: Tv }
  ];

  // Calculer le temps total de visionnage uniquement pour les films
  const calculateTotalWatchTime = () => {
    const movieTime = favorites.movies.reduce((total, movie) => total + (movie.runtime || 0), 0);
    const hours = Math.floor(movieTime / 60);
    const minutes = movieTime % 60;
    
    return {
      totalMinutes: movieTime,
      hours,
      formattedTime: `${hours}h ${minutes}min`
    };
  };

  const watchTime = calculateTotalWatchTime();

  // Filtrer les favoris en fonction du type de média sélectionné
  const filteredFavorites = [
    ...((mediaType === 'all' || mediaType === 'movie') ? favorites.movies.map(item => ({ item, type: 'movie' as const })) : []),
    ...((mediaType === 'all' || mediaType === 'tv') ? favorites.shows.map(item => ({ item, type: 'tv' as const })) : [])
  ].filter(({ item }) => {
    const title = item.title || (item as any).name;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et filtres */}
      <div className="sticky top-16 z-40 bg-[#141414]/95 backdrop-blur-lg -mx-4 px-4 py-4 border-b border-gray-800">
        <div className="flex flex-col gap-4">
          {/* Temps total de visionnage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-600" />
              <h1 className="text-4xl font-bold">
                <span className="text-white">Mes</span>
                <span className="ml-2 text-red-600">Favoris</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-lg">
                <Clock className="w-5 h-5 text-red-500" />
                <div className="text-sm">
                  <span className="font-medium text-white">{watchTime.formattedTime}</span>
                  <span className="text-gray-400 ml-2">de films vus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hidden pb-2">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-800 text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Barre de recherche et contrôles sur la même ligne */}
          <div className="flex items-center gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher..."
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

            {/* Type de média */}
            <div className="flex items-center gap-2">
              {mediaTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setMediaType(type.value as MediaType)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    mediaType === type.value
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              ))}
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
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <AnimatePresence mode="wait">
        {activeTab === 'favorites' && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {filteredFavorites.length > 0 ? (
              <div className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                  : 'space-y-4'
              }`}>
                {filteredFavorites.map(({ item, type }) => (
                  <MediaCard key={item.id} item={item} type={type} showProviders={true} />
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
          </motion.div>
        )}

        {activeTab === 'lists' && (
          <motion.div
            key="lists"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Mes Listes</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const name = prompt('Nom de la nouvelle liste');
                  if (name) {
                    useStore.getState().createList(name);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvelle Liste</span>
              </motion.button>
            </div>

            <div className="grid gap-8">
              {customLists
                .filter(list => list.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((list) => (
                  <motion.section
                    key={list.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="text-2xl font-semibold text-white">{list.name}</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => useStore.getState().deleteList(list.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="p-4">
                      <div className={`${
                        viewMode === 'grid'
                          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                          : 'space-y-4'
                      }`}>
                        {list.items.map(({ item, type }) => (
                          <MediaCard key={item.id} item={item} type={type} showProviders={true} />
                        ))}
                      </div>
                    </div>
                  </motion.section>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}