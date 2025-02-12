import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Movie, TVShow, Cast, WatchProvider, Video } from '../types/tmdb';
import { fetchDetails, fetchCredits, fetchWatchProviders, fetchVideos, fetchPersonDetails } from '../api/tmdb';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Monitor, ShoppingCart } from 'lucide-react';
import VideoPlayer from '../components/ui/video-player';
import { Modal } from '../components/ui/Modal';

interface PersonDetails {
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  known_for_department: string;
}

export function Details() {
  const { mediaType, id } = useParams();
  const [details, setDetails] = useState<Movie | TVShow | null>(null);
  const [credits, setCredits] = useState<Cast[]>([]);
  const [providers, setProviders] = useState<{
    flatrate: WatchProvider[];
    rent: WatchProvider[];
    buy: WatchProvider[];
  }>({ flatrate: [], rent: [], buy: [] });
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedActor, setSelectedActor] = useState<Cast | null>(null);
  const [actorDetails, setActorDetails] = useState<PersonDetails | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      if (id && mediaType) {
        const [detailsData, creditsData, providersData, videosData] = await Promise.all([
          fetchDetails(Number(id), mediaType as 'movie' | 'tv'),
          fetchCredits(Number(id), mediaType as 'movie' | 'tv'),
          fetchWatchProviders(Number(id), mediaType as 'movie' | 'tv'),
          fetchVideos(Number(id), mediaType as 'movie' | 'tv'),
        ]);
        setDetails(detailsData);
        setCredits(creditsData.cast?.slice(0, 10) || []);
        
        const allProviders = providersData.results?.FR || {};
        setProviders({
          flatrate: (allProviders.flatrate || []).map(provider => ({
            ...provider,
            link: allProviders.link
          })),
          rent: (allProviders.rent || []).map(provider => ({
            ...provider,
            link: allProviders.link
          })),
          buy: (allProviders.buy || []).map(provider => ({
            ...provider,
            link: allProviders.link
          }))
        });
        
        const trailer = videosData.results?.find(
          (video: Video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        const otherVideos = videosData.results?.filter(
          (video: Video) => video.site === 'YouTube'
        ) || [];
        setVideos(trailer ? [trailer, ...otherVideos] : otherVideos);
      }
    };
    loadDetails();
  }, [id, mediaType]);

  useEffect(() => {
    const loadActorDetails = async () => {
      if (selectedActor) {
        const details = await fetchPersonDetails(selectedActor.id);
        setActorDetails(details);
      }
    };
    loadActorDetails();
  }, [selectedActor]);

  if (!details) return null;

  const title = mediaType === 'movie' ? (details as Movie).title : (details as TVShow).name;
  const trailer = videos[0];
  const rating = Math.round(details.vote_average * 10) / 10;

  return (
    <div className="space-y-8">
      <div className="relative h-[60vh] overflow-hidden rounded-xl">
        <img
          src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 p-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              {title}
            </motion.h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1.5 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{rating}/10</span>
              </div>
            </div>
            <p className="text-lg max-w-2xl mb-6">{details.overview}</p>
          </div>
        </div>
      </div>

      {trailer && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Bande-annonce</h2>
          <VideoPlayer src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`} />
        </section>
      )}

      {(providers.flatrate.length > 0 || providers.rent.length > 0 || providers.buy.length > 0) && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Où regarder</h2>
          
          {providers.flatrate.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-semibold">Streaming</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {providers.flatrate.map((provider) => (
                  <motion.a
                    href={provider.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={provider.provider_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      className="w-16 h-16 rounded-lg mb-2"
                    />
                    <p className="text-sm text-center group-hover:text-purple-400 transition-colors">
                      {provider.provider_name}
                    </p>
                    <ExternalLink className="w-4 h-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {providers.rent.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-semibold">Location</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {providers.rent.map((provider) => (
                  <motion.a
                    href={provider.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={provider.provider_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      className="w-16 h-16 rounded-lg mb-2"
                    />
                    <p className="text-sm text-center group-hover:text-green-400 transition-colors">
                      {provider.provider_name}
                    </p>
                    <ExternalLink className="w-4 h-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {providers.buy.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold">Achat</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {providers.buy.map((provider) => (
                  <motion.a
                    href={provider.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={provider.provider_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      className="w-16 h-16 rounded-lg mb-2"
                    />
                    <p className="text-sm text-center group-hover:text-blue-400 transition-colors">
                      {provider.provider_name}
                    </p>
                    <ExternalLink className="w-4 h-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {credits.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {credits.map((cast) => (
              <motion.button
                key={cast.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedActor(cast)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                  alt={cast.name}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <p className="font-semibold">{cast.name}</p>
                <p className="text-sm text-gray-400">{cast.character}</p>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      <Modal
        isOpen={!!selectedActor}
        onClose={() => {
          setSelectedActor(null);
          setActorDetails(null);
        }}
      >
        {selectedActor && (
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={`https://image.tmdb.org/t/p/w342${selectedActor.profile_path}`}
              alt={selectedActor.name}
              className="w-full md:w-64 h-96 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{selectedActor.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {selectedActor.character}
              </p>
              
              {actorDetails && (
                <>
                  {actorDetails.birthday && (
                    <p className="mb-2">
                      <span className="font-semibold">Date de naissance:</span>{' '}
                      {new Date(actorDetails.birthday).toLocaleDateString()}
                      {actorDetails.place_of_birth && ` à ${actorDetails.place_of_birth}`}
                    </p>
                  )}
                  {actorDetails.deathday && (
                    <p className="mb-2">
                      <span className="font-semibold">Date de décès:</span>{' '}
                      {new Date(actorDetails.deathday).toLocaleDateString()}
                    </p>
                  )}
                  {actorDetails.known_for_department && (
                    <p className="mb-4">
                      <span className="font-semibold">Connu(e) pour:</span>{' '}
                      {actorDetails.known_for_department}
                    </p>
                  )}
                  {actorDetails.biography && (
                    <div>
                      <h4 className="font-semibold mb-2">Biographie</h4>
                      <p className="text-sm leading-relaxed">{actorDetails.biography}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}