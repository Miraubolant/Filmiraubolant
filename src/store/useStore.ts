import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  removeFromHistory: (itemId: number) => void;
}

const initialState = {
  theme: 'dark' as const,
  fontSize: 'medium' as const,
  layout: 'grid' as const,
  animations: true,
  searchHistory: [],
  savedFilters: [],
  isSidebarExpanded: true,
  favorites: { movies: [], shows: [] },
  watchProgress: [],
  customLists: [],
  ratings: {},
  watchHistory: [],
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
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
        set((state) => {
          const existingIndex = state.watchHistory.findIndex(
            (entry) => entry.item.id === item.id && entry.type === type
          );

          const newEntry = {
            item,
            type,
            watchedAt: new Date().toISOString()
          };

          const updatedHistory = existingIndex !== -1
            ? [
                newEntry,
                ...state.watchHistory.filter((_, index) => index !== existingIndex)
              ]
            : [newEntry, ...state.watchHistory];

          return {
            watchHistory: updatedHistory.slice(0, 100)
          };
        }),
      clearHistory: () => set({ watchHistory: [] }),
      removeFromHistory: (itemId) =>
        set((state) => ({
          watchHistory: state.watchHistory.filter((entry) => entry.item.id !== itemId)
        })),
    }),
    {
      name: 'cinema-preferences',
      version: 3, // Incrémentation de la version
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...initialState,
            ...persistedState,
            watchHistory: [],
          };
        }
        if (version === 1) {
          return {
            ...persistedState,
            watchHistory: persistedState.watchHistory || [],
            ratings: persistedState.ratings || {},
          };
        }
        if (version === 2) {
          return {
            ...persistedState,
            watchHistory: Array.isArray(persistedState.watchHistory) 
              ? persistedState.watchHistory 
              : [],
          };
        }
        return persistedState;
      },
    }
  )
);