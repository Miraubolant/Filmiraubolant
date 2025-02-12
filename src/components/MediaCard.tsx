import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Monitor, Plus, List, History, Info, X, User, Calendar, Clock, Film, Play } from 'lucide-react';
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
  const { favorites, addFavorite, removeFavorite } = useStore();
  const [showListMenu, setShowListMenu] = useState(false);
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

  const handleShowActorDetails = async (actor: Cast) => {
    setSelectedActor(actor);
    const details = await fetchPersonDetails(actor.id);
    setActorDetails(details);
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
          onClick={() => setShowDetails(true)}
        >
          <div className="relative overflow-hidden rounded-xl">
            <motion.img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={type === 'movie' ? item.title : (item as TVShow).name}
              className="w-full h-[400px] object-cover"
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
                      >
                        <motion.img
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-8 h-8 rounded-lg"
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

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
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
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-white'
              }`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowListMenu(!showListMenu);
            }}
            className="p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors backdrop-blur-sm"
          >
            <Plus className="w-5 h-5 text-white" />
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
            {/* Contenu du modal */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold movie-title font-outfit">
                {type === 'movie' ? item.title : (item as TVShow).name}
              </h2>
              <p className="text-gray-400">{item.overview}</p>
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
      >
        {selectedActor && actorDetails && (
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={`https://image.tmdb.org/t/p/w342${selectedActor.profile_path}`}
              alt={selectedActor.name}
              className="w-full md:w-64 h-96 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold movie-title font-outfit mb-2">
                {selectedActor.name}
              </h3>
              <p className="text-gray-400">{selectedActor.character}</p>
              {/* Autres détails de l'acteur */}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}