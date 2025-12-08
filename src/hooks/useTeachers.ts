import { useState, useEffect, useCallback } from 'react'
import { teacherService, type Teacher } from '@/services/teacherService'

export function useTeachers() {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Teacher[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        setError(null)
        try {
            const results = await teacherService.search(query.trim(), 1, 10)
            setSearchResults(results)
        } catch (err: any) {
            console.error('Error searching teachers:', err)
            setError(err.message || 'Error searching teachers')
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
