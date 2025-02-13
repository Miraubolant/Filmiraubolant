import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/tmdb';
import { fetchTrendingWithProviders, searchWithProviders } from '../api/tmdb';
import { MediaCard } from '../components/MediaCard';
import { motion } from 'framer-motion';
import { Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';

const ITEMS_PER_PAGE = 48;

export function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    mediaType: 'movie' as 'all' | 'movie' | 'tv',
    sortBy: 'popularity' as 'popularity' | 'rating' | 'date',
    showVodOnly: false,
    selectedProvider: null as number | null,
    selectedGenre: null as number | null
  });

  useEffect(() => {
    const loadMovies = async () => {
      if (searchQuery) return;
      
      setIsLoading(true);
      try {
        const data = await fetchTrendingWithProviders('movie', currentPage);
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500));
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, [currentPage, searchQuery]);

  // Effet pour la recherche
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const data = await searchWithProviders(searchQuery, 'movie');
          setSearchResults(data.results);
        } catch (error) {
          console.error('Error searching movies:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleFilterChange = (newFilters: typeof filters) => {
    // Si le type de média change pour 'tv', naviguer vers la page des séries
    if (newFilters.mediaType === 'tv') {
      navigate('/tv');
      return;
    }
    // Sinon, mettre à jour les filtres normalement
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtrer les films en fonction des critères
  const filteredMovies = (searchQuery ? searchResults : movies).filter(movie => {
    // Filtre par genre
    if (filters.selectedGenre && !movie.genre_ids.includes(filters.selectedGenre)) {
      return false;
    }

    // Filtre par plateforme VOD
    if (filters.showVodOnly && filters.selectedProvider) {
      const providers = movie.providers?.flatrate || [];
      if (!providers.some(p => p.provider_id === filters.selectedProvider)) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Tri des résultats
    switch (filters.sortBy) {
      case 'date':
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      case 'rating':
        return b.vote_average - a.vote_average;
      default: // popularity
        return b.popularity - a.popularity;
    }
  });

  // Pagination des films filtrés
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <Header
        onSearch={setSearchQuery}
        onFilterChange={handleFilterChange}
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
            {isSearching ? 'Recherche en cours...' : 'Chargement des films...'}
          </p>
        </div>
      )}

      {/* Message si aucun résultat */}
      {searchQuery && !isSearching && filteredMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Film className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-400">
            Aucun film ne correspond à votre recherche.
          </p>
        </div>
      )}

      {/* Grille de films */}
      {!isLoading && !isSearching && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-6">
          {paginatedMovies.map((movie) => (
            <MediaCard key={movie.id} item={movie} type="movie" showProviders={true} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !searchQuery && filteredMovies.length > 0 && (
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