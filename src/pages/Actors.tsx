import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, Film, Tv, Calendar, ChevronLeft, ChevronRight, Search, X, SortAsc, TrendingUp, Filter } from 'lucide-react';
import { fetchPopularActors, fetchActorDetails, searchActors } from '../api/tmdb';
import { Person } from '../types/tmdb';
import { Modal } from '../components/ui/Modal';
import { getZodiacSign } from '../utils/zodiac';

type SortOption = 'popularity' | 'name' | 'trending';
type FilterOption = 'all' | 'movie' | 'tv';

const ITEMS_PER_PAGE = 42;

export function Actors() {
  const [actors, setActors] = useState<Person[]>([]);
  const [selectedActor, setSelectedActor] = useState<Person | null>(null);
  const [actorDetails, setActorDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const sortOptions = [
    { value: 'popularity', label: 'Popularité', icon: Star },
    { value: 'trending', label: 'Tendances', icon: TrendingUp },
    { value: 'name', label: 'Nom', icon: SortAsc }
  ];

  const filterOptions = [
    { value: 'all', label: 'Tout', icon: Users },
    { value: 'movie', label: 'Films', icon: Film },
    { value: 'tv', label: 'Séries', icon: Tv }
  ];

  // Charger les acteurs populaires ou rechercher des acteurs
  useEffect(() => {
    const loadActors = async () => {
      if (searchQuery) return;
      
      setLoading(true);
      try {
        // Charger plusieurs pages en parallèle
        const pages = await Promise.all([
          fetchPopularActors(currentPage),
          fetchPopularActors(currentPage + 1)
        ]);

        // Combiner et dédupliquer les résultats
        const allActors = pages.flatMap(page => page.results)
          .reduce((unique: Person[], actor: Person) => {
            return unique.some(a => a.id === actor.id) ? unique : [...unique, actor];
          }, []);

        setActors(allActors);
        setTotalPages(Math.min(pages[0].total_pages, 500));
      } catch (error) {
        console.error('Error loading actors:', error);
      } finally {
        setLoading(false);
      }
    };

    const searchTimeout = setTimeout(loadActors, 300);
    return () => clearTimeout(searchTimeout);
  }, [currentPage, searchQuery]);

  // Effet pour la recherche
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const data = await searchActors(searchQuery);
          setActors(data.results);
          setTotalPages(Math.min(data.total_pages, 500));
        } catch (error) {
          console.error('Error searching actors:', error);
        } finally {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleActorClick = async (actor: Person) => {
    setSelectedActor(actor);
    try {
      const details = await fetchActorDetails(actor.id);
      setActorDetails(details);
    } catch (error) {
      console.error('Error loading actor details:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filtrer et trier les acteurs
  const filteredActors = actors
    .filter(actor => {
      if (filterBy !== 'all') {
        return actor.known_for.some(media => 
          (media as any).media_type === filterBy
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'trending':
          return b.popularity - a.popularity;
        default:
          return b.popularity - a.popularity;
      }
    });

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedActors = filteredActors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="sticky top-16 z-40 bg-[#141414]/95 backdrop-blur-xl border-b border-theme shadow-lg -mx-4 px-4">
        <div className="flex flex-col gap-4 py-4">
          {/* Barre de recherche et filtres */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un acteur..."
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

            {/* Bouton filtres mobile */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden p-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filtres version desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Type de média */}
            <div className="flex items-center gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilterBy(option.value as FilterOption)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    filterBy === option.value
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
            <div className="h-8 w-px bg-theme" />

            {/* Options de tri */}
            <div className="flex items-center gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    sortBy === option.value
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <option.icon className="w-5 h-5" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtres version mobile */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden space-y-4"
              >
                {/* Type de média */}
                <div className="grid grid-cols-3 gap-2">
                  {filterOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFilterBy(option.value as FilterOption)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filterBy === option.value
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <option.icon className="w-5 h-5" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>

                {/* Options de tri */}
                <div className="grid grid-cols-3 gap-2">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as SortOption)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        sortBy === option.value
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <option.icon className="w-5 h-5" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* État de chargement */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : paginatedActors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-400">
            Aucun acteur ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-6">
          {paginatedActors.map((actor) => (
            <motion.button
              key={actor.id}
              onClick={() => handleActorClick(actor)}
              className="group cursor-pointer"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative overflow-hidden rounded-xl mb-3">
                <img
                  src={`https://image.tmdb.org/t/p/w342${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="text-white text-lg font-bold font-outfit">{actor.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-600/20 rounded-lg">
                        <Star className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-white">{actor.popularity.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !searchQuery && paginatedActors.length > 0 && (
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

      {/* Modal de détails de l'acteur */}
      <Modal
        isOpen={!!selectedActor && !!actorDetails}
        onClose={() => {
          setSelectedActor(null);
          setActorDetails(null);
        }}
        title="Détails de l'acteur"
      >
        {selectedActor && actorDetails && (
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={`https://image.tmdb.org/t/p/w342${selectedActor.profile_path}`}
              alt={selectedActor.name}
              className="w-full md:w-64 h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{selectedActor.name}</h3>
                <p className="text-red-500">
                  {selectedActor.known_for_department}
                </p>
              </div>
              
              {actorDetails.birthday && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <p>
                      <span className="font-semibold">Naissance:</span>{' '}
                      {new Date(actorDetails.birthday).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                      {actorDetails.place_of_birth && ` à ${actorDetails.place_of_birth}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <p>
                      <span className="font-semibold">Signe:</span>{' '}
                      {getZodiacSign(actorDetails.birthday).symbol} {getZodiacSign(actorDetails.birthday).name}
                      <span className="text-sm text-gray-500 ml-2">
                        ({getZodiacSign(actorDetails.birthday).dates})
                      </span>
                    </p>
                  </div>
                </div>
              )}
              
              {actorDetails.deathday && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Décès:</span>{' '}
                  {new Date(actorDetails.deathday).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}
              
              {actorDetails.biography && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">Biographie</h4>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {actorDetails.biography || "Aucune biographie disponible."}
                  </p>
                </div>
              )}

              {/* Filmographie */}
              {actorDetails.known_for && actorDetails.known_for.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">Films notables</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {actorDetails.known_for.map((media: any) => (
                      <div key={media.id} className="space-y-1">
                        <img
                          src={`https://image.tmdb.org/t/p/w185${media.poster_path}`}
                          alt={media.title || media.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <p className="font-medium text-sm">
                          {media.title || media.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(media.release_date || media.first_air_date).getFullYear()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}