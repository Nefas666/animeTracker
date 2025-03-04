"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import Dropdown from "./Dropdown"
import useAnimeStorage, { type AnimeStatus } from "../hooks/useAnimeStorage"
import type { FormattedAnime } from "./AnimeList"

interface AnimeProps {
  anime: FormattedAnime
  isFavorite?: boolean
}

const statusOptions = [
  { value: "plan_to_watch", label: "Da vedere" },
  { value: "watching", label: "In corso" },
  { value: "completed", label: "Completato" },
]

export default function AnimeCard({ anime, isFavorite = false }: AnimeProps) {
  const [status, setStatus] = useState<AnimeStatus>(anime.status)
  const [currentEpisode, setCurrentEpisode] = useState(anime.currentEpisode || 0)
  const [isFavoriteLocal, setIsFavorite] = useState(isFavorite)
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
      removeFavorite(anime.mal_id, status)
    } else {
      saveFavorite({ ...anime, status, currentEpisode }, status)
    }
    setIsFavorite(!isFavoriteLocal)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      <div className="relative w-full pb-[56.25%]">
        <Image
          src={anime.image_url || "/placeholder.svg"}
          alt={anime.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
            <Dropdown
              options={statusOptions}
              value={status}
              onChange={(value) => handleStatusChange(value as AnimeStatus)}
            />
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{anime.title}</h2>
        <p className="text-sm mb-2 flex-grow line-clamp-3">{anime.synopsis}</p>
        <div className="mt-auto">
          <div className="mb-2">
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Episodi: {anime.episodes}</span>
            <span>{anime.seasons}</span>
          </div>
          {status === "watching" && (
            <div className="mt-2">
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
            className="cta"
          >
            {isFavoriteLocal ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          </button>
        </div>
      </div>
    </div>
  )
}

