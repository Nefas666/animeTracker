'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import DropDown from './DropDown'
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
  const { saveFavorite, removeFavorite, updateFavoriteStatus } = useAnimeStorage()

  useEffect(() => {
    if (isFavorite) {
      setStatus(anime.status)
      setCurrentEpisode(anime.currentEpisode || 0)
    }
  }, [isFavorite, anime.status, anime.currentEpisode])

  const handleStatusChange = (newStatus: AnimeStatus) => {
    if (isFavorite) {
      updateFavoriteStatus(anime.mal_id, status, newStatus)
    }
    setStatus(newStatus)
  }

  const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEpisode = Number(e.target.value)
    setCurrentEpisode(newEpisode)
    if (isFavorite) {
      saveFavorite({ ...anime, status, currentEpisode: newEpisode }, status)
    }
  }

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(anime.mal_id, status)
    } else {
      saveFavorite({ ...anime, status, currentEpisode }, status)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <Image src={anime.image_url} alt={anime.title} width={300} height={400} className="w-full" />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{anime.title}</h2>
        <p className="text-sm mb-2">{anime.synopsis}</p>
        <p className="mb-2">Stagioni: {anime.seasons}</p>
        <p className="mb-2">Episodi: {anime.episodes}</p>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Stato:</label>
          <DropDown
            options={statusOptions}
            value={status}
            onChange={(value) => handleStatusChange(value as AnimeStatus)}
          />
        </div>
        {status === 'watching' && (
          <div>
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
          className={`mt-4 px-4 py-2 rounded ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        </button>
      </div>
    </div>
  )
}

