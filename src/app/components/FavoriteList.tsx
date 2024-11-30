import React from 'react'
import useAnimeStorage, { AnimeStatus } from '../hooks/useAnimeStorage'
import AnimeCard from './AnimeCard'

const FavoritesList: React.FC = () => {
  const { favorites } = useAnimeStorage()

  const renderList = (status: AnimeStatus) => (
    <div key={status}>
      <h2 className="text-2xl font-bold mb-4 capitalize">{status.replace('_', ' ')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites[status].map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} isFavorite={true} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {Object.keys(favorites).map((status) => renderList(status as AnimeStatus))}
    </div>
  )
}

export default FavoritesList

