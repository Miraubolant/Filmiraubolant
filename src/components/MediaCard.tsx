import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Monitor, History, Info, X, User, Calendar, Clock, Film, Play } from 'lucide-react';
import { Movie, TVShow, Cast } from '../types/tmdb';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDetails, fetchVideos, fetchWatchProviders, fetchCredits, fetchPersonDetails } from '../api/tmdb';
import { Modal } from './ui/Modal';
import { getZodiacSign } from '../utils/zodiac';

interface MediaCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  showProviders?: boolean;
}

export function MediaCard({ item, type, showProviders = false }: MediaCardProps) {
  const { favorites, addFavorite, removeFavorite, addToHistory } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [providers, setProviders] = useState<any>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [selectedActor, setSelectedActor] = useState<Cast | null>(null);
  const [actorDetails, setActorDetails] = useState<any>(null);
  
  const isFavorite = favorites[type === 'movie' ? 'movies' : 'shows'].some(
    (f) => f.id === item.id
  );

  // Charger les détails, providers et cast au survol
  useEffect(() => {
    if (isHovered && !details) {
      const loadDetails = async () => {
        const [detailsData, providersData, creditsData] = await Promise.all([
          fetchDetails(item.id, type),
          fetchWatchProviders(item.id, type),
          fetchCredits(item.id, type)
        ]);
        setDetails(detailsData);
        setProviders(providersData.results?.FR || {});
        setCast(creditsData.cast?.slice(0, 10) || []);
      };
      loadDetails();
    }
  }, [isHovered, item.id, type, details]);

  // Charger la bande-annonce quand on ouvre le popup
  useEffect(() => {
    if (showDetails && !trailer) {
      const loadTrailer = async () => {
        const videosData = await fetchVideos(item.id, type);
        const trailerVideo = videosData.results?.find(
          (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailerVideo) {
          setTrailer(trailerVideo.key);
        }
      };
      loadTrailer();
    }
  }, [showDetails, item.id, type, trailer]);

  // Charger les détails de l'acteur sélectionné
  const handleShowActorDetails = async (actor: Cast) => {
    setSelectedActor(actor);
    const details = await fetchPersonDetails(actor.id);
    setActorDetails(details);
  };

  // Gérer l'ouverture des détails
  const handleShowDetails = () => {
    setShowDetails(true);
    // Ajouter à l'historique quand on ouvre les détails
    addToHistory(item, type);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="cursor-pointer" 
          onClick={handleShowDetails}
        >
          <div className="relative overflow-hidden rounded-xl">
            <motion.img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={type === 'movie' ? item.title : (item as TVShow).name}
              className="w-full h-[400px] object-cover"
              loading="lazy"
              decoding="async"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-bold movie-title mb-2 font-outfit">
                  {type === 'movie' ? item.title : (item as TVShow).name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-red-600 text-white text-sm rounded-lg flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {Math.round(item.vote_average * 10) / 10}
                  </span>
                  {details && (
                    <span className="px-2 py-1 bg-red-600/50 text-white text-sm rounded-lg flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {type === 'movie' ? `${details.runtime} min` : `${details.number_of_seasons} saisons`}
                    </span>
                  )}
                </div>
                {providers?.flatrate && providers.flatrate.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {providers.flatrate.map((provider: any) => (
                      <a
                        key={provider.provider_id}
                        href={providers.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="block"
                        aria-label={`Regarder sur ${provider.provider_name}`}
                      >
                        <motion.img
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-8 h-8 rounded-lg"
                          loading="lazy"
                          decoding="async"
                          whileHover={{ scale: 1.1 }}
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bouton Favori */}
        <div className="absolute top-2 right-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              isFavorite
                ? removeFavorite(item.id, type)
                : addFavorite(item, type);
            }}
            className="p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors backdrop-blur-sm"
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-white'
              }`}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Modal de détails */}
      <AnimatePresence>
        {showDetails && (
          <Modal
            isOpen={true}
            onClose={() => setShowDetails(false)}
          >
            {/* Contenu de la modal */}
            <div className="space-y-8">
              {/* En-tête avec image de fond */}
              <div className="relative h-[40vh] -m-4 mb-4">
                <img
                  src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                  alt={type === 'movie' ? item.title : (item as TVShow).name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 p-8">
                    <h2 className="text-4xl font-bold movie-title mb-4">
                      {type === 'movie' ? item.title : (item as TVShow).name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1.5 rounded-lg">
                        <Star className="w-5 h-5 text-red-500" />
                        <span className="text-white font-medium">{Math.round(item.vote_average * 10) / 10}/10</span>
                      </div>
                      {details && (
                        <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1.5 rounded-lg">
                          <Clock className="w-5 h-5 text-red-500" />
                          <span className="text-white font-medium">
                            {type === 'movie' ? `${details.runtime} min` : `${details.number_of_seasons} saisons`}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1.5 rounded-lg">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <span className="text-white font-medium">
                          {new Date(type === 'movie' ? item.release_date : (item as TVShow).first_air_date).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Synopsis</h3>
                <p className="text-gray-300 leading-relaxed">
                  {item.overview || "Aucun synopsis disponible."}
                </p>
              </div>

              {/* Bande-annonce */}
              {trailer && (
                <div>
                  <h3 className="text-2xl font-bold mb-4">Bande-annonce</h3>
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video rounded-xl overflow-hidden group"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${trailer}/maxresdefault.jpg`}
                      alt="Trailer thumbnail"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* Distribution */}
              {cast.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Distribution</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {cast.map((actor) => (
                      <motion.button
                        key={actor.id}
                        whileHover={{ scale: 1.05 }}
                        className="group cursor-pointer"
                        onClick={() => handleShowActorDetails(actor)}
                      >
                        <div className="relative overflow-hidden rounded-lg mb-2">
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <p className="text-white text-sm">{actor.character}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-center text-white group-hover:text-red-500 transition-colors">
                          {actor.name}
                        </p>
                      </motion.button>
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
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
                            aria-label={`Regarder sur ${provider.provider_name}`}
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="w-16 h-16 rounded-xl shadow-lg transition-transform group-hover:scale-110"
                              loading="lazy"
                              decoding="async"
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

      {/* Modal pour les détails de l'acteur */}
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
              loading="lazy"
              decoding="async"
            />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{selectedActor.name}</h3>
                <p className="text-red-500">
                  {selectedActor.character}
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
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}