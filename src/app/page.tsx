import { Suspense } from 'react';
import Search from './components/Search'
import AnimeList from './components/AnimeList'
import FavoritesList from './components/FavoriteList'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Anime Tracker</h1>
      <Search />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Risultati della ricerca</h2>
        <Suspense fallback={<div>Caricamento...</div>}>
      <AnimeList />
    </Suspense>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">I tuoi preferiti</h2>
        <FavoritesList />
      </div>
    </main>
  )
}

