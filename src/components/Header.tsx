import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Tv, Filter, Calendar, Clock, Monitor, Search, X, Tag } from 'lucide-react';

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

// Liste des genres
const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Famille' },
  { id: 14, name: 'Fantastique' },
  { id: 36, name: 'Histoire' },
  { id: 27, name: 'Horreur' },
  { id: 10402, name: 'Musique' },
  { id: 9648, name: 'Mystère' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science-Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerre' },
  { id: 37, name: 'Western' }
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
  const [showVodFilter, setShowVodFilter] = useState(false);
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const mediaTypes = [
    { value: 'all', label: 'Tout', icon: Film },
    { value: 'movie', label: 'Films', icon: Film },
    { value: 'tv', label: 'Séries', icon: Tv }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Popularité' },
    { value: 'date', label: 'Date de sortie' }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  // Fermer les menus lors d'un clic à l'extérieur
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.vod-filter') && !target.closest('.genre-filter')) {
        setShowVodFilter(false);
        setShowGenreFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-16 z-40 bg-[#141414]/95 backdrop-blur-xl border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Barre de recherche */}
          <div className="w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-10 py-2 bg-transparent text-white placeholder-gray-500 rounded-lg outline-none border border-gray-800"
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
          <div className="h-8 w-px bg-gray-700" />

          {/* Type de média */}
          <div className="flex items-center gap-2">
            {mediaTypes.map(type => (
              <button
                key={type.value}
                onClick={() => onFilterChange({ ...filters, mediaType: type.value as any })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  filters.mediaType === type.value
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

          {/* Tri */}
          <div className="flex items-center gap-2">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onFilterChange({ ...filters, sortBy: option.value as any })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  filters.sortBy === option.value
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {option.value === 'popularity' && <Film className="w-4 h-4" />}
                {option.value === 'date' && <Calendar className="w-4 h-4" />}
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          {/* Séparateur vertical */}
          <div className="h-8 w-px bg-gray-700" />

          {/* Filtre par genre */}
          <div className="relative genre-filter">
            <button
              onClick={() => {
                setShowGenreFilter(!showGenreFilter);
                setShowVodFilter(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                filters.selectedGenre !== null
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>
                {filters.selectedGenre 
                  ? GENRES.find(g => g.id === filters.selectedGenre)?.name 
                  : 'Genres'
                }
              </span>
            </button>

            {/* Menu déroulant des genres */}
            {showGenreFilter && (
              <div className="absolute top-full left-0 mt-2 p-4 bg-gray-800 rounded-lg shadow-xl w-[400px] grid grid-cols-2 gap-2 z-50">
                {GENRES.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => {
                      onFilterChange({
                        ...filters,
                        selectedGenre: filters.selectedGenre === genre.id ? null : genre.id
                      });
                      setShowGenreFilter(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.selectedGenre === genre.id
                        ? 'bg-red-600 text-white'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>{genre.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Séparateur vertical */}
          <div className="h-8 w-px bg-gray-700" />

          {/* Filtre VOD */}
          <div className="relative vod-filter">
            <button
              onClick={() => {
                setShowVodFilter(!showVodFilter);
                setShowGenreFilter(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                filters.showVodOnly
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Plateformes VOD</span>
            </button>

            {/* Menu déroulant des plateformes VOD */}
            {showVodFilter && (
              <div className="absolute top-full right-0 mt-2 p-4 bg-gray-800 rounded-lg shadow-xl w-[400px] z-50">
                <div className="grid grid-cols-3 gap-3">
                  {VOD_PROVIDERS.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        onFilterChange({
                          ...filters,
                          selectedProvider: filters.selectedProvider === provider.id ? null : provider.id,
                          showVodOnly: true
                        });
                        setShowVodFilter(false);
                      }}
                      className={`relative rounded-lg overflow-hidden group transition-transform hover:scale-105 ${
                        filters.selectedProvider === provider.id
                          ? 'ring-2 ring-red-600'
                          : ''
                      }`}
                    >
                      <div className="aspect-square bg-black/20 p-4 flex items-center justify-center">
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className={`absolute inset-0 transition-colors ${
                        filters.selectedProvider === provider.id
                          ? 'bg-red-600/20'
                          : 'group-hover:bg-black/20'
                      }`} />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-xs text-center text-white font-medium">
                          {provider.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}