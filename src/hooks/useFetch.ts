import type { AxiosRequestConfig } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'

type UseFetchOptions<TBody, TParams> = {
  url: string
  method?: AxiosRequestConfig['method']
  params?: TParams
  body?: TBody
  skip?: boolean
}

type UseFetchReturn<TData> = {
  data: TData | null
  isLoading: boolean
  error: unknown
  refetch: () => Promise<TData>
}

export function useFetch<TData = unknown, TBody = unknown, TParams = Record<string, unknown>>(
  options: UseFetchOptions<TBody, TParams>,
): UseFetchReturn<TData> {
  const { url, method = 'get', params, body, skip = false } = options
  const [data, setData] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const executeRequest = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.request<TData>({
        url,
        method,
        params,
        data: body,
      })
      setData(response.data)
      return response.data
    } catch (requestError) {
      setError(requestError)
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }, [url, method, params, body])

  useEffect(() => {
    if (!skip) {
      void executeRequest()
    }
  }, [executeRequest, skip])

  return { data, isLoading, error, refetch: executeRequest }
}
