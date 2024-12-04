'use client'
import { useState } from 'react';
import { Suspense } from 'react';
import Search from './components/Search'
import AnimeList from './components/AnimeList'
import FavoritesList from './components/FavoriteList'
import Dialog from './components/Dialog'
import Toast from './components/Toast'
import { Heart } from 'lucide-react'
import useAnimeStorage from './hooks/useAnimeStorage'


export default function Home() {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const { notification, clearNotification } = useAnimeStorage()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Anime Tracker</h1>
      <Search />
      <div className="py-4">
        <h2 className="text-2xl font-bold mb-4">Risultati della ricerca</h2>
        <Suspense fallback={<div>Caricamento...</div>}>
      <AnimeList />
    </Suspense>
      </div>
      <button
        onClick={() => setIsFavoritesOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg hover:bg-[#f9836a] transition-colors"
      >
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
        <Heart size={24} />
      </button>
      <Dialog isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} title="I tuoi preferiti">
        <FavoritesList />
      </Dialog>
    </main>
  )
}

