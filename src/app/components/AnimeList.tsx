'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import AnimeCard from './AnimeCard'
import { searchAnime, SearchParams } from '../utils/jikan'

export interface Anime {
  mal_id: number
  title: string
  synopsis: string
  episodes: number
  season: string
  year: number
  images: {
    jpg: {
      image_url: string
    }
  }
}

export interface FormattedAnime {
  mal_id: number
  title: string
  synopsis: string
  episodes: number
  seasons: string
  image_url: string
  status: 'completed' | 'plan_to_watch' | 'watching'
  currentEpisode?: number
}

export default function AnimeList() {
  const [animes, setAnimes] = useState<FormattedAnime[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  useEffect(() => {
    setAnimes([])  // Clear previous results when query changes
    setPage(1)     // Reset to first page when query changes
  }, [query])

  useEffect(() => {
    if (query) {
      setIsLoading(true)
      const searchParams: SearchParams = {
        q: query,
        page,
        limit: 21,
        order_by: 'title',
        sort: 'asc'
      }

      searchAnime(searchParams)
        .then(data => {
          if (Array.isArray(data.data)) {
            const formattedAnimes: FormattedAnime[] = data.data.map((anime: Anime) => ({
              mal_id: anime.mal_id,
              title: anime.title,
              synopsis: anime.synopsis,
              episodes: anime.episodes,
              seasons: `${anime.season} ${anime.year}`,
              image_url: anime.images.jpg.image_url,
              status: 'plan_to_watch'
            }))
            setAnimes(formattedAnimes)
            setTotalPages(Math.ceil(data.pagination.items.total / (searchParams?.limit || 21)))
          } else {
            console.error('Unexpected data structure:', data)
            setAnimes([])
            setTotalPages(1)
          }
        })
        .catch(error => console.error('Error fetching anime:', error))
        .finally(() => setIsLoading(false))
    }
  }, [query, page])

  if (!query) {
    return <div className="text-center mt-8">Inserisci un termine di ricerca per iniziare.</div>
  }

  return (
    <>
      {isLoading ? (
        <div className="text-center mt-8">Caricamento...</div>
      ) : animes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animes.map((anime, index) => (
              <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
            ))}
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Precedente
            </button>
            <span className="px-4 py-2">Pagina {page} di {totalPages}</span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Successiva
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-8">Nessun risultato trovato per "{query}".</div>
      )}
    </>
  )
}

