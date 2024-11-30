import { useState, useEffect } from 'react';
import { FormattedAnime } from '../components/AnimeList';

interface AnimeStorageHook {
  favorites: Record<AnimeStatus, FormattedAnime[]>;
  saveFavorite: (anime: FormattedAnime, status: AnimeStatus) => void;
  removeFavorite: (animeId: number, status: AnimeStatus) => void;
  updateFavoriteStatus: (animeId: number, oldStatus: AnimeStatus, newStatus: AnimeStatus) => void;
}

export type AnimeStatus = 'plan_to_watch' | 'watching' | 'completed';

const useAnimeStorage = (): AnimeStorageHook => {
  const [favorites, setFavorites] = useState<Record<AnimeStatus, FormattedAnime[]>>({
    plan_to_watch: [],
    watching: [],
    completed: [],
  });

  useEffect(() => {
    const storedFavorites = localStorage.getItem('animeFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const saveFavorite = (anime: FormattedAnime, status: AnimeStatus) => {
    const updatedFavorites = { ...favorites };
    const existingIndex = updatedFavorites[status].findIndex(a => a.mal_id === anime.mal_id);

    if (existingIndex !== -1) {
      updatedFavorites[status][existingIndex] = { ...anime, status };
    } else {
      updatedFavorites[status].push({ ...anime, status });
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('animeFavorites', JSON.stringify(updatedFavorites));
  };

  const removeFavorite = (animeId: number, status: AnimeStatus) => {
    const updatedFavorites = { ...favorites };
    updatedFavorites[status] = updatedFavorites[status].filter(a => a.mal_id !== animeId);
    setFavorites(updatedFavorites);
    localStorage.setItem('animeFavorites', JSON.stringify(updatedFavorites));
  };

  const updateFavoriteStatus = (animeId: number, oldStatus: AnimeStatus, newStatus: AnimeStatus) => {
    const updatedFavorites = { ...favorites };
    const animeToMove = updatedFavorites[oldStatus].find(a => a.mal_id === animeId);
    if (animeToMove) {
      updatedFavorites[oldStatus] = updatedFavorites[oldStatus].filter(a => a.mal_id !== animeId);
      updatedFavorites[newStatus].push({ ...animeToMove, status: newStatus });
      setFavorites(updatedFavorites);
      localStorage.setItem('animeFavorites', JSON.stringify(updatedFavorites));
    }
  };

  return { favorites, saveFavorite, removeFavorite, updateFavoriteStatus };
};

export default useAnimeStorage;

