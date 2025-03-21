'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function Search() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`?q=${encodeURIComponent(query.trim())}`)
    }
  }, [query, router])

  const handleClear = useCallback(() => {
    setQuery('')
    router.push('/')
  }, [router])

  return (
    <form onSubmit={handleSearch} className="relative w-96">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca un anime..."
        className="input"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      )}
      <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-black- text-white hover:bg-slate-600">
        🔍
      </button>
    </form>
  )
}

