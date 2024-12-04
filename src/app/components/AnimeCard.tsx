'use client'

import Image from 'next/image'
import { useState } from 'react'
import Dropdown from './Dropdown'
import useAnimeStorage, { AnimeStatus } from '../hooks/useAnimeStorage'
import { FormattedAnime } from './AnimeList'

interface AnimeProps {
  anime: FormattedAnime
  isFavorite?: boolean
}

const statusOptions = [
  { value: 'plan_to_watch', label: 'Da vedere' },
  { value: 'watching', label: 'In corso' },
  { value: 'completed', label: 'Completato' },
];

export default function AnimeCard({ anime, isFavorite = false }: AnimeProps) {
  const [status, setStatus] = useState<AnimeStatus>(anime.status)
  const [currentEpisode, setCurrentEpisode] = useState(anime.currentEpisode || 0)
  const [isFavoriteLocal, setIsFavorite] = useState(isFavorite);
  const { saveFavorite, removeFavorite, updateFavoriteStatus } = useAnimeStorage()

  const handleStatusChange = (newStatus: AnimeStatus) => {
    if (isFavoriteLocal) {
      updateFavoriteStatus(anime.mal_id, status, newStatus)
    }
    setStatus(newStatus)
  }

  const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEpisode = Number(e.target.value)
    setCurrentEpisode(newEpisode)
    if (isFavoriteLocal) {
      saveFavorite({ ...anime, status, currentEpisode: newEpisode }, status)
    }
  }

  const handleToggleFavorite = () => {
    if (isFavoriteLocal) {
      removeFavorite(anime.mal_id, status);
    } else {
      saveFavorite({ ...anime, status, currentEpisode }, status);
    }
    setIsFavorite(!isFavoriteLocal);
  };

  return (
    <div className="card group w-[300px] p-5 bg-white border-6 border-black shadow-[12px_12px_0_#000] transition-all duration-300 hover:translate-x-[-5px] hover:translate-y-[-5px] hover:shadow-[17px_17px_0_#000]">
      <div className="relative h-40 mb-4 overflow-hidden">
        <Image 
          src={anime.image_url} 
          alt={anime.title} 
          layout="fill" 
          objectFit="cover" 
          className="transition-transform duration-300 hover:scale-110"
        />
      </div>
      <h2 className="card__title text-2xl font-black text-black uppercase mb-4 block relative overflow-hidden">
        {anime.title}
      </h2>
      <div className="card__content text-base leading-relaxed text-black mb-5 h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300">
        {anime.synopsis}
      </div>
      <div className="mb-4">
        <p className="text-sm">Stagioni: {anime.seasons}</p>
        <p className="text-sm">Episodi: {anime.episodes}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Stato:</label>
        <Dropdown
          options={statusOptions}
          value={status}
          onChange={(value) => handleStatusChange(value as AnimeStatus)}
        />
      </div>
      {status === 'watching' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Episodio corrente:</label>
          <input
            type="number"
            min={0}
            max={anime.episodes}
            value={currentEpisode}
            onChange={handleEpisodeChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      )}
      <button
        onClick={handleToggleFavorite}
        className={`card__button w-1/2 border-3 border-black bg-black text-white py-2 px-4 text-lg font-bold uppercase cursor-pointer relative overflow-hidden transition-transform duration-300 hover:before:translate-y-0 before:content-['Sure?'] before:absolute before:top-0 before:left-0 before:w-full before:h-[105%] before:bg-[#5ad641] before:text-black before:flex before:items-center before:justify-center before:transform before:translate-y-full before:transition-transform before:duration-300 active:scale-95
             ${isFavoriteLocal ? 'bg-red-500' : 'bg-black'
          }`}
        >
        {isFavoriteLocal ? 'Rimuovi' : 'Aggiungi'}
      </button>
    </div>
  )
}

