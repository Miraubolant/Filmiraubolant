import React, { useEffect, useState } from 'react';
import { Movie, TVShow } from '../types/tmdb';
import { fetchTrendingWithProviders, searchWithProviders } from '../api/tmdb';
import { MediaCard } from '../components/MediaCard';
import { motion } from 'framer-motion';
import { Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Header } from '../components/Header';

const ITEMS_PER_PAGE = 48;

export function Home() {
  const [media, setMedia] = useState<(Movie | TVShow & { mediaType: 'movie' | 'tv'; page: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(Movie | TVShow & { mediaType: 'movie' | 'tv' })[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    mediaType: 'all' as 'all' | 'movie' | 'tv',
    sortBy: 'popularity' as 'popularity' | 'rating' | 'date',
    showVodOnly: false,
    selectedProvider: null as number | null,
    selectedGenre: null as number | null
  });

  // Charger les médias tendance
  useEffect(() => {
    const loadMedia = async () => {
      if (searchQuery) return;
      
      setIsLoading(true);
      try {
        const [movieData, tvData] = await Promise.all([
          fetchTrendingWithProviders('movie', currentPage),
          fetchTrendingWithProviders('tv', currentPage),
        ]);

        const newMedia = [
          ...movieData.results.map((item: Movie) => ({ ...item, mediaType: 'movie' as const, page: currentPage })),
          ...tvData.results.map((item: TVShow) => ({ ...item, mediaType: 'tv' as const, page: currentPage }))
        ];

        setMedia(newMedia);
        setTotalPages(Math.max(movieData.total_pages, tvData.total_pages));
      } catch (error) {
        console.error('Error loading media:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedia();
  }, [currentPage, searchQuery]);

  // Recherche
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const [movieResults, tvResults] = await Promise.all([
            searchWithProviders(searchQuery, 'movie'),
            searchWithProviders(searchQuery, 'tv')
          ]);

          const combinedResults = [
            ...movieResults.results.map((item: Movie) => ({ ...item, mediaType: 'movie' as const })),
            ...tvResults.results.map((item: TVShow) => ({ ...item, mediaType: 'tv' as const }))
          ];

          setSearchResults(combinedResults);
          setTotalPages(Math.ceil(combinedResults.length / ITEMS_PER_PAGE));
        } catch (error) {
          console.error('Error searching:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Filtrer les médias
  const filteredMedia = (searchQuery ? searchResults : media).filter(item => {
    if (filters.mediaType !== 'all' && item.mediaType !== filters.mediaType) return false;
    if (filters.showVodOnly && filters.selectedProvider) {
      const providers = item.providers?.flatrate || [];
      if (!providers.some(p => p.provider_id === filters.selectedProvider)) return false;
    }
    if (filters.selectedGenre !== null) {
      if (!item.genre_ids.includes(filters.selectedGenre)) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'date': {
        const dateA = a.mediaType === 'movie' ? a.release_date : (a as TVShow).first_air_date;
        const dateB = b.mediaType === 'movie' ? b.release_date : (b as TVShow).first_air_date;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
      default: // popularity
        return b.vote_average - a.vote_average;
    }
  });

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMedia = filteredMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <Header
        onSearch={setSearchQuery}
        onFilterChange={setFilters}
        filters={filters}
      />

      {/* État de chargement */}
      {(isLoading || isSearching) && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-16 h-16">
            {/* Cercle de chargement externe */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-red-600 animate-spin"></div>
            
            {/* Logo au centre */}
            <Film className="absolute inset-0 w-8 h-8 m-auto text-red-600" />
          </div>
          <p className="mt-4 text-gray-400 animate-pulse">
            {isSearching ? 'Recherche en cours...' : 'Chargement des films et séries...'}
          </p>
        </div>
      )}

      {/* Message si aucun résultat */}
      {searchQuery && !isSearching && filteredMedia.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Film className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-400">
            Aucun film ou série ne correspond à votre recherche.
          </p>
        </div>
      )}

      {/* Grille de médias */}
      {!isLoading && !isSearching && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-6">
          {paginatedMedia.map((item) => (
            <MediaCard
              key={`${item.id}-${item.mediaType}`}
              item={item}
              type={item.mediaType}
              showProviders={true}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !searchQuery && filteredMedia.length > 0 && (
        <div className="flex justify-center items-center gap-4 py-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-white hover:bg-red-600'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-white hover:bg-red-600'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}