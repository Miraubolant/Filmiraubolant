import React, { useEffect, useState } from 'react';
import { TVShow } from '../types/tmdb';
import { fetchTrendingWithProviders, searchWithProviders } from '../api/tmdb';
import { MediaCard } from '../components/MediaCard';
import { motion } from 'framer-motion';
import { Tv, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';

const ITEMS_PER_PAGE = 35;

export function TVShows() {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [searchResults, setSearchResults] = useState<TVShow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    mediaType: 'tv' as 'all' | 'movie' | 'tv',
    sortBy: 'popularity' as 'popularity' | 'rating' | 'date',
    showVodOnly: false,
    selectedProvider: null as number | null,
    selectedGenre: null as number | null
  });

  useEffect(() => {
    const loadShows = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTrendingWithProviders('tv', currentPage);
        setShows(data.results);
        setTotalPages(Math.min(data.total_pages, 500));
      } catch (error) {
        console.error('Error loading TV shows:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadShows();
  }, [currentPage]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      try {
        const data = await searchWithProviders(query, 'tv');
        setSearchResults(data.results);
      } catch (error) {
        console.error('Error searching TV shows:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage: number;
    let endPage: number;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const filteredShows = searchQuery ? searchResults : shows;

  // Pagination des séries filtrées
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedShows = filteredShows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <Header
        onSearch={handleSearch}
        onFilterChange={setFilters}
        filters={filters}
      />

      {(isSearching || isLoading) && (
        <div className="flex justify-center items-center py-8">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {searchQuery && !isSearching && filteredShows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Tv className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-400">
            Aucune série ne correspond à votre recherche.
          </p>
        </div>
      )}

      {!isLoading && !isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {paginatedShows.map((show) => (
            <MediaCard key={show.id} item={show} type="tv" showProviders={true} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !searchQuery && filteredShows.length > 0 && (
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
            {getPageNumbers().map((pageNumber) => (
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
            ))}
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