import { Movie, TVShow, Person } from '../types/tmdb';
import { cache } from '../utils/cache';

const API_BASE = 'https://misty-sea-02a2.victor-307.workers.dev';

// Durées de cache personnalisées
const CACHE_DURATIONS = {
  TRENDING: 5 * 60 * 1000,    // 5 minutes
  SEARCH: 10 * 60 * 1000,     // 10 minutes
  DETAILS: 30 * 60 * 1000,    // 30 minutes
  PROVIDERS: 60 * 60 * 1000,  // 1 heure
  ACTORS: 15 * 60 * 1000      // 15 minutes
};

export async function fetchTrending(mediaType: 'movie' | 'tv', page: number = 1) {
  // Récupérer plusieurs pages en parallèle
  const pages = await Promise.all([
    fetch(`${API_BASE}/trending/${mediaType}/week?page=${page}`).then(r => r.json()),
    fetch(`${API_BASE}/trending/${mediaType}/week?page=${page + 1}`).then(r => r.json()),
    fetch(`${API_BASE}/discover/${mediaType}?sort_by=popularity.desc&page=${page}`).then(r => r.json())
  ]);

  // Combiner les résultats
  const combinedResults = [
    ...pages[0].results,
    ...pages[1].results,
    ...pages[2].results
  ].filter((item, index, self) => 
    index === self.findIndex((t) => t.id === item.id)
  );

  // Si c'est un film, récupérer la durée pour chaque film
  if (mediaType === 'movie') {
    const moviesWithRuntime = await Promise.all(
      combinedResults.map(async (movie: Movie) => {
        const details = await fetchDetails(movie.id, 'movie');
        return { ...movie, runtime: details.runtime };
      })
    );
    return { results: moviesWithRuntime, total_pages: Math.max(...pages.map(p => p.total_pages)) };
  }
  
  return { results: combinedResults, total_pages: Math.max(...pages.map(p => p.total_pages)) };
}

export async function fetchTrendingWithProviders(mediaType: 'movie' | 'tv', page: number = 1) {
  const data = await fetchTrending(mediaType, page);
  const results = await Promise.all(
    data.results.map(async (item: Movie | TVShow) => {
      const providers = await fetchWatchProviders(item.id, mediaType);
      return {
        ...item,
        providers: providers.results?.FR || null,
        mediaType
      };
    })
  );
  return { ...data, results };
}

export async function searchWithProviders(query: string, mediaType: 'movie' | 'tv') {
  // Rechercher dans plusieurs sources
  const [searchResults, discoverResults] = await Promise.all([
    fetch(`${API_BASE}/search/${mediaType}?query=${encodeURIComponent(query)}`).then(r => r.json()),
    fetch(`${API_BASE}/discover/${mediaType}?with_keywords=${encodeURIComponent(query)}`).then(r => r.json())
  ]);

  // Combiner et dédupliquer les résultats
  const combinedResults = [
    ...searchResults.results,
    ...discoverResults.results
  ].filter((item, index, self) => 
    index === self.findIndex((t) => t.id === item.id)
  );

  if (!combinedResults) return { results: [] };
  
  const results = await Promise.all(
    combinedResults.map(async (item: Movie | TVShow) => {
      const [providers, details] = await Promise.all([
        fetchWatchProviders(item.id, mediaType),
        mediaType === 'movie' ? fetchDetails(item.id, mediaType) : Promise.resolve({})
      ]);
      return {
        ...item,
        ...(mediaType === 'movie' ? { runtime: details.runtime } : {}),
        providers: providers.results?.FR || null,
        mediaType
      };
    })
  );
  return { results };
}

export async function fetchDetails(id: number, mediaType: 'movie' | 'tv') {
  const cacheKey = `details_${mediaType}_${id}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE}/${mediaType}/${id}`);
  const data = await response.json();
  
  cache.set(cacheKey, data, CACHE_DURATIONS.DETAILS);
  
  return data;
}

export async function fetchWatchProviders(id: number, mediaType: 'movie' | 'tv') {
  const cacheKey = `providers_${mediaType}_${id}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE}/${mediaType}/${id}/watch/providers`);
  const data = await response.json();
  
  cache.set(cacheKey, data, CACHE_DURATIONS.PROVIDERS);
  
  return data;
}

export async function fetchCredits(id: number, mediaType: 'movie' | 'tv') {
  const cacheKey = `credits_${mediaType}_${id}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE}/${mediaType}/${id}/credits`);
  const data = await response.json();
  
  cache.set(cacheKey, data, CACHE_DURATIONS.DETAILS);
  
  return data;
}

export async function fetchVideos(id: number, mediaType: 'movie' | 'tv') {
  const cacheKey = `videos_${mediaType}_${id}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE}/${mediaType}/${id}/videos`);
  const data = await response.json();
  
  cache.set(cacheKey, data, CACHE_DURATIONS.DETAILS);
  
  return data;
}

export async function searchActors(query: string) {
  const cacheKey = `search_person_${query}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(
    `${API_BASE}/search/person?query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  
  cache.set(cacheKey, data, CACHE_DURATIONS.SEARCH);
  
  return data;
}

export async function fetchPersonDetails(personId: number) {
  const cacheKey = `person_${personId}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE}/person/${personId}`);
  const data = await response.json();
  
  cache.set(cacheKey, data, CACHE_DURATIONS.DETAILS);
  
  return data;
}

export async function fetchPopularActors(page: number = 1) {
  const cacheKey = `popular_actors_${page}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE}/person/popular?page=${page}`);
  const data = await response.json();
  
  cache.set(cacheKey, data, CACHE_DURATIONS.ACTORS);
  
  return data;
}

export async function fetchActorMovies(personId: number) {
  const cacheKey = `actor_movies_${personId}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE}/person/${personId}/combined_credits`);
  const data = await response.json();
  
  // Trier les films par popularité
  data.cast = data.cast.sort((a: any, b: any) => b.popularity - a.popularity);
  
  cache.set(cacheKey, data, CACHE_DURATIONS.ACTORS);
  
  return data;
}

export async function fetchActorDetails(personId: number) {
  const cacheKey = `actor_details_${personId}`;
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const [details, credits] = await Promise.all([
    fetchPersonDetails(personId),
    fetchActorMovies(personId)
  ]);

  const enrichedData = {
    ...details,
    credits: credits.cast
  };
  
  cache.set(cacheKey, enrichedData, CACHE_DURATIONS.ACTORS);
  
  return enrichedData;
}