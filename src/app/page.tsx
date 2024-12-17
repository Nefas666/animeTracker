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
    <main className="container mx-auto px-4 py-10">
      <header className="flex-none p-4 sticky top-0 bg-white z-10 shadow-md transition-all duration-300 ease-in-out" id="app-header">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Anime Tracker</h1>
          <Search />
        </div>
      </header>
      <div className="py-4">
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

