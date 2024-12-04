import { useState, useEffect, useCallback } from 'react';
import { FormattedAnime } from '../components/AnimeList';

interface AnimeStorageHook {
  favorites: Record<AnimeStatus, FormattedAnime[]>;
  saveFavorite: (anime: FormattedAnime, status: AnimeStatus) => void;
  removeFavorite: (animeId: number, status: AnimeStatus) => void;
  updateFavoriteStatus: (animeId: number, oldStatus: AnimeStatus, newStatus: AnimeStatus) => void;
  isAnimeFavorite: (animeId: number) => boolean;
}

export type AnimeStatus = 'plan_to_watch' | 'watching' | 'completed';

const useAnimeStorage = (): AnimeStorageHook => {
  const [favorites, setFavorites] = useState<Record<AnimeStatus, FormattedAnime[]>>({
    plan_to_watch: [],
    watching: [],
    completed: [],
  });

  const loadFavorites = useCallback(() => {
    const storedFavorites = localStorage.getItem('animeFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const saveFavorite = useCallback((anime: FormattedAnime, status: AnimeStatus) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = { ...prevFavorites };
      const existingIndex = updatedFavorites[status].findIndex(a => a.mal_id === anime.mal_id);

      if (existingIndex !== -1) {
        updatedFavorites[status][existingIndex] = { ...anime, status };
      } else {
        updatedFavorites[status].push({ ...anime, status });
      }

      localStorage.setItem('animeFavorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const removeFavorite = useCallback((animeId: number, status: AnimeStatus) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = { ...prevFavorites };
      updatedFavorites[status] = updatedFavorites[status].filter(a => a.mal_id !== animeId);
      localStorage.setItem('animeFavorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const updateFavoriteStatus = useCallback((animeId: number, oldStatus: AnimeStatus, newStatus: AnimeStatus) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = { ...prevFavorites };
      const animeToMove = updatedFavorites[oldStatus].find(a => a.mal_id === animeId);
      if (animeToMove) {
        updatedFavorites[oldStatus] = updatedFavorites[oldStatus].filter(a => a.mal_id !== animeId);
        updatedFavorites[newStatus].push({ ...animeToMove, status: newStatus });
        localStorage.setItem('animeFavorites', JSON.stringify(updatedFavorites));
      }
      return updatedFavorites;
    });
  }, []);

  const isAnimeFavorite = useCallback((animeId: number): boolean => {
    return Object.values(favorites).some(list => list.some(anime => anime.mal_id === animeId));
  }, [favorites]);

  return { favorites, saveFavorite, removeFavorite, updateFavoriteStatus, isAnimeFavorite };
};

export default useAnimeStorage;

