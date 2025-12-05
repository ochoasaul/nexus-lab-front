import { useState, useEffect, useCallback } from 'react'
import { personService, type Person } from '@/services/personService'

export function usePersonSearch() {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Person[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = useCallback(async (query: string) => {
        if (!query.trim() || query.length <= 2) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        setError(null)
        try {
            const results = await personService.search(query.trim(), 1, 20)
            setSearchResults(results)
        } catch (err: any) {
            console.error('Error searching persons:', err)
            setError(err.message || 'Error searching persons')
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }, [])

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                search(searchQuery)
            } else {
                setSearchResults([])
            }
        }, 400)

        return () => clearTimeout(timer)
    }, [searchQuery, search])

    const clearSearch = useCallback(() => {
        setSearchQuery('')
        setSearchResults([])
        setError(null)
    }, [])

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearching,
        error,
        clearSearch
    }
}
