import { useState, useCallback } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

interface UseRestApiOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  initialData?: any
}

interface UseRestApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (body?: any, queryParams?: Record<string, string | number | boolean>, customPath?: string) => Promise<T>
  reset: () => void
}

/**
 * A custom hook to call API Gateway REST APIs directly.
 * Automatically attaches the Cognito JWT token to the Authorization header.
 */
export function useRestApi<T = any>({
  url,
  method = 'GET',
  initialData = null,
}: UseRestApiOptions): UseRestApiResult<T> {
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (body?: any, queryParams?: Record<string, string | number | boolean>, customPath?: string): Promise<T> => {
      try {
        setLoading(true)
        setError(null)

        // 1. Get the Cognito Auth Token
        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString()

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        // 2. Append custom path and query parameters if provided
        let fetchUrl = customPath ? `${url}${customPath}` : url
        if (queryParams) {
          const params = new URLSearchParams()
          Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, String(value))
            }
          })
          const queryString = params.toString()
          if (queryString) {
            fetchUrl += `?${queryString}`
          }
        }

        // 3. Make the API Call
        const response = await fetch(fetchUrl, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        })

        // 4. Parse JSON Response
        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData?.error || responseData?.message || `HTTP error! status: ${response.status}`)
        }

        setData(responseData as T)
        return responseData as T
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [url, method]
  )

  const reset = useCallback(() => {
    setData(initialData)
    setError(null)
    setLoading(false)
  }, [initialData])

  return { data, loading, error, execute, reset }
}
