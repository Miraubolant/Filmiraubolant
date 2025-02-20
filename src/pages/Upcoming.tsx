import React, { useEffect, useState } from 'react';
import { Movie } from '../types/tmdb';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Star, AlertCircle, Monitor, Play, X } from 'lucide-react';
import { fetchDetails, fetchWatchProviders, fetchVideos, fetchCredits } from '../api/tmdb';
import { Modal } from '../components/ui/Modal';
import VideoPlayer from '../components/ui/video-player';

interface UpcomingMovie extends Movie {
  release_date: string;
}

export function Upcoming() {
  const [movies, setMovies] = useState<UpcomingMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<UpcomingMovie | null>(null);
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [providers, setProviders] = useState<any>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      setError(null);
      try {
        // Charger plusieurs pages en parallèle
        const pages = await Promise.all([
          fetch('https://misty-sea-02a2.victor-307.workers.dev/movie/upcoming?region=FR&page=1').then(r => r.json()),
          fetch('https://misty-sea-02a2.victor-307.workers.dev/movie/upcoming?region=FR&page=2').then(r => r.json()),
          fetch('https://misty-sea-02a2.victor-307.workers.dev/movie/upcoming?region=FR&page=3').then(r => r.json())
        ]);

        // Combiner et dédupliquer les résultats
        const allMovies = pages.flatMap(page => page.results)
          .filter((movie: UpcomingMovie) => movie.backdrop_path && movie.release_date)
          .reduce((unique: UpcomingMovie[], movie: UpcomingMovie) => {
            return unique.some(m => m.id === movie.id) ? unique : [...unique, movie];
          }, [])
          .sort((a: UpcomingMovie, b: UpcomingMovie) => 
            new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
          );

        setMovies(allMovies);
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
        setError('Impossible de charger les prochaines sorties. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (selectedMovie) {
        try {
          const [details, providersData, videosData, creditsData] = await Promise.all([
            fetchDetails(selectedMovie.id, 'movie'),
            fetchWatchProviders(selectedMovie.id, 'movie'),
            fetchVideos(selectedMovie.id, 'movie'),
            fetchCredits(selectedMovie.id, 'movie')
          ]);

          setMovieDetails(details);
          setProviders(providersData.results?.FR || {});
          
          const trailerVideo = videosData.results?.find(
            (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
          );
          setTrailer(trailerVideo?.key || null);
          
          setCast(creditsData.cast?.slice(0, 10) || []);
        } catch (error) {
          console.error('Error loading movie details:', error);
        }
      }
    };

    loadMovieDetails();
  }, [selectedMovie]);

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

  // Grouper les films par mois
  const moviesByMonth = movies.reduce((acc: { [key: string]: UpcomingMovie[] }, movie) => {
    const date = new Date(movie.release_date);
    const monthKey = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(movie);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="relative">
        {/* Version mobile : liste par mois */}
        <div className="md:hidden space-y-8">
          {Object.entries(moviesByMonth).map(([month, monthMovies]) => (
            <section key={month} className="space-y-4">
              <h2 className="text-xl font-bold text-red-600 sticky top-[4.5rem] bg-[#141414]/95 backdrop-blur-sm py-2 z-10">
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </h2>
              <div className="space-y-4">
                {monthMovies.map((movie, index) => {
                  const releaseDate = new Date(movie.release_date);
                  return (
                    <motion.button
                      key={movie.id}
                      onClick={() => setSelectedMovie(movie)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-1/3 aspect-[2/3]">
                          <img
                            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="flex-1 p-4 text-left">
                          <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-600/20 rounded-lg">
                              <Calendar className="w-4 h-4 text-red-500" />
                              <time className="text-sm">
                                {releaseDate.toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </time>
                            </div>
                            {movie.vote_average > 0 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-3">
                            {movie.overview || "Aucune description disponible."}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Version desktop : timeline */}
        <div className="hidden md:block">
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
            {movies.map((movie, index) => {
              const releaseDate = new Date(movie.release_date);
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.1, 2) }}
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
                  <motion.button
                    onClick={() => setSelectedMovie(movie)}
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
                        <h3 className="text-2xl font-bold movie-title mb-3">
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
                          {movie.vote_average > 0 && (
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                              <Star className="w-4 h-4" />
                              <span className="text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-400 line-clamp-3">
                          {movie.overview || "Aucune description disponible."}
                        </p>
                      </div>
                    </div>

                    {/* Effet de survol */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-red-600/5 to-red-500/5 transition-opacity duration-300" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de détails du film */}
      <AnimatePresence>
        {selectedMovie && movieDetails && (
          <Modal
            isOpen={true}
            onClose={() => {
              setSelectedMovie(null);
              setMovieDetails(null);
              setProviders(null);
              setTrailer(null);
              setCast([]);
            }}
          >
            <div className="space-y-8">
              {/* En-tête avec image de fond */}
              <div className="relative h-[40vh] -m-4 mb-4">
                <img
                  src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 p-8">
                    <h2 className="text-4xl font-bold movie-title mb-4">
                      {selectedMovie.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1.5 rounded-lg">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <span className="text-white font-medium">
                          {new Date(selectedMovie.release_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {movieDetails.runtime && (
                        <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1.5 rounded-lg">
                          <Clock className="w-5 h-5 text-red-500" />
                          <span className="text-white font-medium">
                            {movieDetails.runtime} min
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1.5 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-white font-medium">
                          {selectedMovie.vote_average.toFixed(1)}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Synopsis</h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedMovie.overview || "Aucun synopsis disponible."}
                </p>
              </div>

              {/* Bande-annonce */}
              {trailer && (
                <div>
                  <h3 className="text-2xl font-bold mb-4">Bande-annonce</h3>
                  <VideoPlayer src={`https://www.youtube.com/embed/${trailer}`} />
                </div>
              )}

              {/* Distribution */}
              {cast.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-4">Distribution</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {cast.map((actor) => (
                      <div key={actor.id} className="text-center">
                        <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-semibold text-white">{actor.name}</p>
                        <p className="text-sm text-gray-400">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plateformes de streaming */}
              {providers && (providers.flatrate || providers.rent || providers.buy) && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Où regarder</h3>
                  
                  {providers.flatrate && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-red-500" />
                        Streaming
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {providers.flatrate.map((provider: any) => (
                          <a
                            key={provider.provider_id}
                            href={providers.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="w-16 h-16 rounded-xl shadow-lg transition-transform group-hover:scale-110"
                            />
                            <span className="mt-2 text-sm text-gray-400 group-hover:text-white transition-colors">
                              {provider.provider_name}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}