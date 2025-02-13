import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, Film, Tv, Calendar, ChevronLeft, ChevronRight, Search, X, SortAsc, TrendingUp } from 'lucide-react';
import { fetchPopularActors, fetchActorDetails, searchActors } from '../api/tmdb';
import { Person } from '../types/tmdb';
import { Modal } from '../components/ui/Modal';
import { getZodiacSign } from '../utils/zodiac';

type SortOption = 'popularity' | 'name' | 'trending';
type FilterOption = 'all' | 'movie' | 'tv';

const ITEMS_PER_PAGE = 36;

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

  const sortOptions = [
    { value: 'popularity', label: 'Popularité', icon: Star },
    { value: 'trending', label: 'Tendances', icon: TrendingUp },
    { value: 'name', label: 'Nom', icon: SortAsc }
  ];

  const filterOptions = [
    { value: 'all', label: 'Tous', icon: Users },
    { value: 'movie', label: 'Films', icon: Film },
    { value: 'tv', label: 'Séries', icon: Tv }
  ];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="sticky top-16 z-40 bg-[#141414]/95 backdrop-blur-xl border-b border-theme shadow-lg -mx-4 px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-red-600" />
              <h1 className="text-4xl font-bold font-outfit">
                <span className="text-white">Acteurs</span>
                <span className="ml-2 text-red-600">Populaires</span>
              </h1>
            </div>
          </div>

          {/* Barre de recherche et contrôles */}
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

            {/* Séparateur vertical */}
            <div className="h-8 w-px bg-theme" />

            {/* Filtres par type */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-6">
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
      <AnimatePresence>
        {selectedActor && actorDetails && (
          <Modal
            isOpen={true}
            onClose={() => {
              setSelectedActor(null);
              setActorDetails(null);
            }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Photo et informations */}
              <div className="md:w-1/3">
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedActor.profile_path}`}
                    alt={selectedActor.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-outfit">{selectedActor.name}</h2>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-red-500" />
                      <span className="text-gray-400">Popularité: {selectedActor.popularity.toFixed(1)}</span>
                    </div>
                  </div>

                  {actorDetails.birthday && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <p className="text-gray-300">
                          {new Date(actorDetails.birthday).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <p className="text-gray-300">
                          {getZodiacSign(actorDetails.birthday).symbol} {getZodiacSign(actorDetails.birthday).name}
                          <span className="text-sm text-gray-500 ml-2">
                            ({getZodiacSign(actorDetails.birthday).dates})
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {actorDetails.biography && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Biographie</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {actorDetails.biography}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Filmographie */}
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold text-white mb-4">Filmographie</h3>
                <div className="space-y-4">
                  {actorDetails.credits
                    .filter((credit: any) => credit.poster_path)
                    .map((credit: any, index: number) => (
                      <motion.div
                        key={`${credit.id}-${credit.media_type}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w154${credit.poster_path}`}
                          alt={credit.title || credit.name}
                          className="w-16 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-semibold group-hover:text-red-500 transition-colors font-outfit">
                                {credit.title || credit.name}
                              </h4>
                              <p className="text-gray-400 text-sm">{credit.character}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {credit.media_type === 'movie' ? (
                                <Film className="w-4 h-4 text-red-500" />
                              ) : (
                                <Tv className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-sm text-gray-400">
                                {credit.release_date || credit.first_air_date ? 
                                  new Date(credit.release_date || credit.first_air_date).getFullYear() : 
                                  'Date inconnue'
                                }
                              </span>
                            </div>
                          </div>
                          {credit.overview && (
                            <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                              {credit.overview}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}