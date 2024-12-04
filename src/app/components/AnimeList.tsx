'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import AnimeCard from './AnimeCard'
import { searchAnime, SearchParams } from '../utils/jikan'
import useAnimeStorage from '../hooks/useAnimeStorage'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
  const { isAnimeFavorite } = useAnimeStorage()

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
        limit: 20,  // Increased to 20 for 5 slides of 4 cards each
        order_by: 'popularity',
        sort: 'desc',
        genres_exclude: '12'  // Esclude gli anime hentai
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
              status: 'plan_to_watch',
              currentEpisode: undefined
            }))
            setAnimes(prevAnimes => [...prevAnimes, ...formattedAnimes])
            setTotalPages(Math.ceil(data.pagination.items.total / (searchParams.limit || 20)))
          } else {
            console.error('Unexpected data structure:', data)
          }
        })
        .catch(error => console.error('Error fetching anime:', error))
        .finally(() => setIsLoading(false))
    }
  }, [query, page])

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1)
    }
  }

  if (!query) {
    return <div className="text-center mt-8">Inserisci un termine di ricerca per iniziare.</div>
  }

  return (
    <>
      {isLoading && page === 1 ? (
        <div className="text-center mt-8">Caricamento...</div>
      ) : animes.length > 0 ? (
        <>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            className="mySwiper"
          >
            {animes.map((anime, index) => (
              <SwiperSlide key={`${anime.mal_id}-${index}`}>
                <AnimeCard anime={anime} isFavorite={isAnimeFavorite(anime.mal_id)} />
              </SwiperSlide>
            ))}
          </Swiper>
          {page < totalPages && (
            <div className="text-center mt-4">
              <button
                onClick={loadMore}
                className="card__button w-1/2 border-3 border-black bg-black text-white py-2 px-4 text-lg font-bold uppercase cursor-pointer relative active:scale-95"
              >
                Visualizza altro
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-8">Nessun risultato trovato per &quot;{query}&quot;.</div>
      )}
      {isLoading && page > 1 && (
        <div className="text-center mt-4">Caricamento altri risultati...</div>
      )}
    </>
  )
}

