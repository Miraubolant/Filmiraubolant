import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Tv, Filter, Calendar, Clock, Monitor, Search, X, Tag, ChevronDown, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';

// Logos des plateformes VOD avec des URLs vérifiées
const VOD_PROVIDERS = [
  {
    id: 8,
    name: 'Netflix',
    logo: 'https://m.media-amazon.com/images/I/41Ix1vMUK7L.png'
  },
  {
    id: 337,
    name: 'Disney Plus',
    logo: 'https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg'
  },
  {
    id: 119,
    name: 'Amazon Prime',
    logo: 'https://m.media-amazon.com/images/I/417jywf7ZAL.png'
  },
  {
    id: 350,
    name: 'Apple TV+',
    logo: 'https://image.tmdb.org/t/p/original/6uhKBfmtzFqOcLousHwZuzcrScK.jpg'
  },
  {
    id: 2184,
    name: 'TF1+',
    logo: 'https://m.media-amazon.com/images/I/519zXiqP9OL.png'
  },
  {
    id: 381,
    name: 'Canal+',
    logo: 'https://m.media-amazon.com/images/I/21bOpPU9bNL.png'
  }
];

// Liste des genres avec leurs icônes
const GENRES = [
  { id: 28, name: 'Action', icon: '🎬' },
  { id: 12, name: 'Aventure', icon: '🗺️' },
  { id: 16, name: 'Animation', icon: '🎨' },
  { id: 35, name: 'Comédie', icon: '😂' },
  { id: 80, name: 'Crime', icon: '🔍' },
  { id: 99, name: 'Documentaire', icon: '📚' },
  { id: 18, name: 'Drame', icon: '🎭' },
  { id: 10751, name: 'Famille', icon: '👨‍👩‍👧‍👦' },
  { id: 14, name: 'Fantastique', icon: '🔮' },
  { id: 36, name: 'Histoire', icon: '📜' },
  { id: 27, name: 'Horreur', icon: '👻' },
  { id: 10402, name: 'Musique', icon: '🎵' },
  { id: 9648, name: 'Mystère', icon: '🔎' },
  { id: 10749, name: 'Romance', icon: '❤️' },
  { id: 878, name: 'Science-Fiction', icon: '🚀' },
  { id: 53, name: 'Thriller', icon: '🎯' },
  { id: 10752, name: 'Guerre', icon: '⚔️' },
  { id: 37, name: 'Western', icon: '🤠' }
];

interface HeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    mediaType: 'all' | 'movie' | 'tv';
    sortBy: 'popularity' | 'rating' | 'date';
    showVodOnly: boolean;
    selectedProvider: number | null;
    selectedGenre: number | null;
  }) => void;
  filters: {
    mediaType: 'all' | 'movie' | 'tv';
    sortBy: 'popularity' | 'rating' | 'date';
    showVodOnly: boolean;
    selectedProvider: number | null;
    selectedGenre: number | null;
  };
}

export function Header({ onSearch, onFilterChange, filters }: HeaderProps) {
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreSearchQuery, setGenreSearchQuery] = useState('');

  const mediaTypes = [
    { value: 'all', label: 'Tout', icon: Film },
    { value: 'movie', label: 'Films', icon: Film },
    { value: 'tv', label: 'Séries', icon: Tv }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Popularité', icon: TrendingUp },
    { value: 'date', label: 'Date de sortie', icon: CalendarIcon }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  // Filtrer les genres en fonction de la recherche
  const filteredGenres = GENRES.filter(genre =>
    genre.name.toLowerCase().includes(genreSearchQuery.toLowerCase())
  );

  // Fermer les menus lors d'un clic à l'extérieur
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.genre-filter')) {
        setShowGenreFilter(false);
      }
      if (!target.closest('.date-filter')) {
        setShowDateFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedGenre = GENRES.find(g => g.id === filters.selectedGenre);

  return (
    <div className="sticky top-16 z-40 bg-[#141414] shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center h-16 px-4 border-b border-theme">
          {/* Barre de recherche */}
          <div className="w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-10 py-2.5 bg-transparent text-white placeholder-gray-500 rounded-lg outline-none border border-theme border-theme-focus transition-colors text-base"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-[50%] -translate-y-[50%] w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Séparateur vertical */}
          <div className="h-8 w-px bg-theme mx-4" />

          {/* Type de média */}
          <div className="flex items-center gap-2">
            {mediaTypes.map(type => (
              <button
                key={type.value}
                onClick={() => onFilterChange({ ...filters, mediaType: type.value as any })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  filters.mediaType === type.value
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <type.icon className="w-5 h-5" />
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Séparateur vertical */}
          <div className="h-8 w-px bg-theme mx-4" />

          {/* Tri */}
          <div className="flex items-center gap-2">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onFilterChange({ ...filters, sortBy: option.value as any })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  filters.sortBy === option.value
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <option.icon className="w-5 h-5" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          {/* Séparateur vertical */}
          <div className="h-8 w-px bg-theme mx-4" />

          {/* Filtre par genre */}
          <div className="relative genre-filter">
            <motion.button
              onClick={() => {
                setShowGenreFilter(!showGenreFilter);
                setShowDateFilter(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                filters.selectedGenre !== null
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedGenre ? (
                <>
                  <span className="text-lg">{selectedGenre.icon}</span>
                  <span>{selectedGenre.name}</span>
                </>
              ) : (
                <>
                  <Tag className="w-5 h-5" />
                  <span>Genres</span>
                </>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showGenreFilter ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Menu déroulant des genres */}
            <AnimatePresence>
              {showGenreFilter && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-[#1a1a1a] rounded-xl shadow-xl w-[400px] backdrop-blur-xl border border-theme z-50"
                >
                  {/* Barre de recherche des genres */}
                  <div className="p-3 border-b border-theme">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={genreSearchQuery}
                        onChange={(e) => setGenreSearchQuery(e.target.value)}
                        placeholder="Rechercher un genre..."
                        className="w-full pl-9 pr-9 py-2 bg-transparent text-white placeholder-gray-500 rounded-lg outline-none border border-theme border-theme-focus transition-colors text-sm"
                      />
                      {genreSearchQuery && (
                        <button
                          onClick={() => setGenreSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Liste des genres */}
                  <div className="grid grid-cols-2 gap-2 p-3 max-h-[400px] overflow-y-auto scrollbar-custom">
                    {filteredGenres.map(genre => (
                      <motion.button
                        key={genre.id}
                        onClick={() => {
                          onFilterChange({
                            ...filters,
                            selectedGenre: filters.selectedGenre === genre.id ? null : genre.id
                          });
                          setShowGenreFilter(false);
                          setGenreSearchQuery('');
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          filters.selectedGenre === genre.id
                            ? 'bg-red-600 text-white'
                            : 'hover:bg-gray-800 text-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-lg">{genre.icon}</span>
                        <span>{genre.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Séparateur vertical */}
          <div className="h-8 w-px bg-theme mx-4" />

          {/* Logos VOD */}
          <div className="flex items-center gap-3">
            {VOD_PROVIDERS.map(provider => (
              <motion.button
                key={provider.id}
                onClick={() => {
                  onFilterChange({
                    ...filters,
                    selectedProvider: filters.selectedProvider === provider.id ? null : provider.id,
                    showVodOnly: true
                  });
                }}
                className={`relative group ${
                  filters.selectedProvider === provider.id
                    ? 'ring-2 ring-red-600'
                    : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={provider.logo}
                  alt={provider.name}
                  className="w-8 h-8 rounded-lg"
                />
                <div className={`absolute inset-0 rounded-lg transition-colors ${
                  filters.selectedProvider === provider.id
                    ? 'bg-red-600/20'
                    : 'group-hover:bg-black/20'
                }`} />
                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {provider.name}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}