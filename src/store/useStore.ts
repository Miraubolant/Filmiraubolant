import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie, TVShow } from '../types/tmdb';

interface StoreState {
  theme: 'dark';
  fontSize: 'small' | 'medium' | 'large';
  layout: 'grid' | 'list';
  animations: boolean;
  searchHistory: string[];
  savedFilters: Array<{
    id: string;
    name: string;
    filters: Record<string, any>;
  }>;
  isSidebarExpanded: boolean;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setLayout: (layout: 'grid' | 'list') => void;
  setAnimations: (enabled: boolean) => void;
  setIsSidebarExpanded: (expanded: boolean) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  saveFilter: (name: string, filters: Record<string, any>) => void;
  deleteFilter: (id: string) => void;
  favorites: { movies: Movie[]; shows: TVShow[] };
  watchProgress: Array<{
    id: number;
    type: 'movie' | 'tv';
    progress: number;
    lastWatched: string;
  }>;
  customLists: Array<{
    id: string;
    name: string;
    items: Array<{ item: Movie | TVShow; type: 'movie' | 'tv' }>;
  }>;
  ratings: { [key: string]: number };
  watchHistory: Array<{ item: Movie | TVShow; type: 'movie' | 'tv'; watchedAt: string }>;
  addFavorite: (item: Movie | TVShow, type: 'movie' | 'tv') => void;
  removeFavorite: (id: number, type: 'movie' | 'tv') => void;
  updateProgress: (progress: { id: number; type: 'movie' | 'tv'; progress: number; lastWatched: string }) => void;
  createList: (name: string) => void;
  addToList: (listId: string, item: Movie | TVShow, type: 'movie' | 'tv') => void;
  removeFromList: (listId: string, itemId: number) => void;
  deleteList: (listId: string) => void;
  addRating: (itemId: number, type: 'movie' | 'tv', rating: number) => void;
  addToHistory: (item: Movie | TVShow, type: 'movie' | 'tv') => void;
  clearHistory: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 'medium',
      layout: 'grid',
      animations: true,
      searchHistory: [],
      savedFilters: [],
      isSidebarExpanded: true,
      favorites: { movies: [], shows: [] },
      watchProgress: [],
      customLists: [],
      ratings: {},
      watchHistory: [],
      setFontSize: (fontSize) => set({ fontSize }),
      setLayout: (layout) => set({ layout }),
      setAnimations: (animations) => set({ animations }),
      setIsSidebarExpanded: (isSidebarExpanded) => set({ isSidebarExpanded }),
      addToSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [
            query,
            ...state.searchHistory.filter((q) => q !== query),
          ].slice(0, 10),
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
      saveFilter: (name, filters) =>
        set((state) => ({
          savedFilters: [
            ...state.savedFilters,
            { id: crypto.randomUUID(), name, filters },
          ],
        })),
      deleteFilter: (id) =>
        set((state) => ({
          savedFilters: state.savedFilters.filter((f) => f.id !== id),
        })),
      addFavorite: (item, type) =>
        set((state) => ({
          favorites: {
            ...state.favorites,
            [type === 'movie' ? 'movies' : 'shows']: [
              ...state.favorites[type === 'movie' ? 'movies' : 'shows'],
              item,
            ],
          },
        })),
      removeFavorite: (id, type) =>
        set((state) => ({
          favorites: {
            ...state.favorites,
            [type === 'movie' ? 'movies' : 'shows']: state.favorites[
              type === 'movie' ? 'movies' : 'shows'
            ].filter((item) => item.id !== id),
          },
        })),
      updateProgress: (progress) =>
        set((state) => ({
          watchProgress: [
            ...state.watchProgress.filter((p) => p.id !== progress.id),
            progress,
          ],
        })),
      createList: (name) =>
        set((state) => ({
          customLists: [
            ...state.customLists,
            { id: crypto.randomUUID(), name, items: [] },
          ],
        })),
      addToList: (listId, item, type) =>
        set((state) => ({
          customLists: state.customLists.map((list) =>
            list.id === listId
              ? { ...list, items: [...list.items, { item, type }] }
              : list
          ),
        })),
      removeFromList: (listId, itemId) =>
        set((state) => ({
          customLists: state.customLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.filter((i) => i.item.id !== itemId),
                }
              : list
          ),
        })),
      deleteList: (listId) =>
        set((state) => ({
          customLists: state.customLists.filter((list) => list.id !== listId),
        })),
      addRating: (itemId, type, rating) =>
        set((state) => ({
          ratings: {
            ...state.ratings,
            [`${type}-${itemId}`]: rating,
          },
        })),
      addToHistory: (item, type) =>
        set((state) => ({
          watchHistory: [
            { item, type, watchedAt: new Date().toISOString() },
            ...state.watchHistory,
          ].slice(0, 100),
        })),
      clearHistory: () => set({ watchHistory: [] }),
    }),
    {
      name: 'cinema-preferences',
    }
  )
);