"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import AnimeCard from "./AnimeCard"
import { searchAnime, type SearchParams } from "../utils/jikan"
import useAnimeStorage from "../hooks/useAnimeStorage"

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
  status: "completed" | "plan_to_watch" | "watching"
  currentEpisode?: number
}

export default function AnimeList() {
  const [animes, setAnimes] = useState<FormattedAnime[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const { isAnimeFavorite } = useAnimeStorage()

  const fetchAnime = useCallback(
    async (currentPage: number) => {
      if (!query) return

      setIsLoading(true)
      const searchParams: SearchParams = {
        q: query,
        page: currentPage,
        limit: 8, // Mostra 8 risultati per pagina
        order_by: "popularity",
        sort: "desc",
        genres_exclude: "12", // Esclude gli anime hentai
      }

      try {
        const data = await searchAnime(searchParams)
        if (Array.isArray(data.data)) {
          const formattedAnimes: FormattedAnime[] = data.data.map((anime: Anime) => ({
            mal_id: anime.mal_id,
            title: anime.title,
            synopsis: anime.synopsis,
            episodes: anime.episodes,
            seasons: `${anime.season} ${anime.year}`,
            image_url: anime.images.jpg.image_url,
            status: "plan_to_watch",
            currentEpisode: undefined,
          }))
          setAnimes((prevAnimes) => [...prevAnimes, ...formattedAnimes])
          setTotalPages(Math.ceil(data.pagination.items.total / searchParams.limit!))
        } else {
          console.error("Unexpected data structure:", data)
        }
      } catch (error) {
        console.error("Error fetching anime:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [query],
  )

  useEffect(() => {
    setAnimes([])
    setPage(1)
    if (query) {
      fetchAnime(1)
    }
  }, [query, fetchAnime])

  const loadMore = useCallback(() => {
    if (page < totalPages && !isLoading) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [page, totalPages, isLoading])

  useEffect(() => {
    if (page > 1) {
      fetchAnime(page)
    }
  }, [page, fetchAnime])

  if (!query) {
    return <div className="text-center mt-8">Inserisci un termine di ricerca per iniziare.</div>
  }

  return (
    <div className="container mx-auto px-4">
      {isLoading && page === 1 ? (
        <div className="text-center mt-8">Caricamento...</div>
      ) : animes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {animes.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} isFavorite={isAnimeFavorite(anime.mal_id)} />
            ))}
          </div>
          {page < totalPages && (
            <div className="text-center mt-8 mb-8">
              <button
                onClick={loadMore}
                className="cta"
                disabled={isLoading}
              >
                {isLoading ? "Caricamento..." : "Visualizza altro"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-8">Nessun risultato trovato per &quot;{query}&quot;.</div>
      )}
    </div>
  )
}

