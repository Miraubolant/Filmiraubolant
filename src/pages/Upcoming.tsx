import React, { useEffect, useState } from 'react';
import { Movie } from '../types/tmdb';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, AlertCircle, ChevronDown } from 'lucide-react';

interface UpcomingMovie extends Movie {
  release_date: string;
}

export function Upcoming() {
  const [movies, setMovies] = useState<UpcomingMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleMovies, setVisibleMovies] = useState(10);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://misty-sea-02a2.victor-307.workers.dev/movie/upcoming?region=FR');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.results) {
          throw new Error('No results found in the response');
        }
        const sortedMovies = data.results
          .filter((movie: UpcomingMovie) => movie.backdrop_path && movie.release_date)
          .sort((a: UpcomingMovie, b: UpcomingMovie) => 
            new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
          );
        setMovies(sortedMovies);
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
        setError('Impossible de charger les prochaines sorties. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  const loadMore = () => {
    setVisibleMovies(prev => Math.min(prev + 10, movies.length));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-red-600 animate-spin"></div>
          <Calendar className="absolute inset-0 w-8 h-8 m-auto text-red-600" />
        </div>
        <p className="text-gray-400 animate-pulse">Chargement des prochaines sorties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-600" />
        <h2 className="text-2xl font-bold text-white">Oups !</h2>
        <p className="text-gray-400 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <Calendar className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-bold text-white">Aucune sortie prévue</h2>
        <p className="text-gray-400 max-w-md">
          Il n'y a pas de nouvelles sorties prévues pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="w-8 h-8 text-red-600" />
        <h1 className="text-4xl font-bold">
          <span className="text-white">Prochaines</span>
          <span className="ml-2 text-red-600">Sorties</span>
        </h1>
      </div>

      <div className="relative">
        {/* Ligne courbe verticale décorative */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1">
          <div className="h-full w-full bg-gradient-to-b from-red-600/20 via-red-500/20 to-red-600/20 rounded-full" />
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path
              d="M10,0 Q-20,500 10,1000"
              className="stroke-red-600/30"
              fill="none"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Timeline des films */}
        <div className="relative space-y-16 py-8">
          {movies.slice(0, visibleMovies).map((movie, index) => {
            const releaseDate = new Date(movie.release_date);
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Date */}
                <div className={`w-32 flex ${isEven ? 'justify-end' : 'justify-start'}`}>
                  <div className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm font-medium shadow-lg">
                    {releaseDate.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                {/* Connecteur */}
                <div className="relative flex-shrink-0 w-8 h-8">
                  <div className="absolute inset-0 bg-red-600 rounded-full shadow-lg transform scale-75" />
                  <div className="absolute inset-1 bg-[#141414] rounded-full" />
                  <div className="absolute inset-2 bg-red-600 rounded-full" />
                </div>

                {/* Carte du film */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 relative group bg-[#141414] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Image */}
                    <div className="relative w-full md:w-2/5 h-[200px] md:h-auto">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#141414]/80 via-[#141414]/40 to-transparent" />
                    </div>

                    {/* Contenu */}
                    <div className="relative flex-1 p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {movie.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-600/10 text-red-500">
                          <Clock className="w-4 h-4" />
                          <time className="text-sm font-medium">
                            {releaseDate.toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 line-clamp-3">
                        {movie.overview || "Aucune description disponible."}
                      </p>
                    </div>
                  </div>

                  {/* Effet de survol */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-red-600/5 to-red-500/5 transition-opacity duration-300" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bouton "Voir plus" */}
        {visibleMovies < movies.length && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-colors"
            >
              <span>Voir plus</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}