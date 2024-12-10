'use client'

import React, { useState } from 'react'
import useAnimeStorage, { AnimeStatus } from '../hooks/useAnimeStorage'
import { Pencil, Trash2 } from 'lucide-react'

const FavoritesList: React.FC = () => {
  const { favorites, removeFavorite, updateFavoriteStatus } = useAnimeStorage()
  const [editingAnime, setEditingAnime] = useState<number | null>(null)
  const [editStatus, setEditStatus] = useState<AnimeStatus>('plan_to_watch')
  const [editEpisode, setEditEpisode] = useState<number>(0)

  const handleRemove = (animeId: number, status: AnimeStatus) => {
    removeFavorite(animeId, status)
  }

  const handleEdit = (animeId: number, status: AnimeStatus, currentEpisode?: number) => {
    setEditingAnime(animeId)
    setEditStatus(status)
    setEditEpisode(currentEpisode || 0)
  }

  const handleUpdate = (animeId: number, oldStatus: AnimeStatus) => {
    updateFavoriteStatus(animeId, oldStatus, editStatus, editEpisode)
    setEditingAnime(null)
  }

  const renderTable = (status: AnimeStatus) => (
    <div key={status} className="mb-8">
      <h2 className="text-2xl font-bold mb-4 capitalize">{status.replace('_', ' ')}</h2>
      {favorites[status].length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Episodio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {favorites[status].map((anime) => (
              <tr key={anime.mal_id}>
                <td className="px-6 py-4 whitespace-nowrap">{anime.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingAnime === anime.mal_id ? (
                    <input
                      type="number"
                      value={editEpisode}
                      onChange={(e) => setEditEpisode(Number(e.target.value))}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  ) : (
                    anime.currentEpisode || 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingAnime === anime.mal_id ? (
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as AnimeStatus)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="plan_to_watch">Da vedere</option>
                      <option value="watching">In corso</option>
                      <option value="completed">Completato</option>
                    </select>
                  ) : (
                    status
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingAnime === anime.mal_id ? (
                    <button
                      onClick={() => handleUpdate(anime.mal_id, status)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Salva
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(anime.mal_id, status, anime.currentEpisode)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Pencil size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(anime.mal_id, status)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nessun anime in questa lista.</p>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {(Object.keys(favorites) as AnimeStatus[]).map(renderTable)}
    </div>
  )
}

export default FavoritesList

