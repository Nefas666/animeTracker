'use client'

import React from 'react'
import useAnimeStorage, { AnimeStatus } from '../hooks/useAnimeStorage'
import AnimeCard from './AnimeCard'

const FavoriteList: React.FC = () => {
  const { favorites } = useAnimeStorage()

  const renderList = (status: AnimeStatus) => (
    <div key={status} className="mb-8">
      <h2 className="text-2xl font-bold mb-4 capitalize">{status.replace('_', ' ')}</h2>
      {favorites[status].length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites[status].map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} isFavorite={true} />
          ))}
        </div>
      ) : (
        <p>Nessun anime in questa lista.</p>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {(Object.keys(favorites) as AnimeStatus[]).map(renderList)}
    </div>
  )
}

export default FavoriteList

