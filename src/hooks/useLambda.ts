import { useState, useCallback } from 'react'

interface UseLambdaResult<T, Args extends any[]> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: Args) => Promise<T>
  reset: () => void
}

/**
 * A custom hook to wrap Lambda/API calls (like the ones from src/api/client.ts)
 * and manage loading, error, and data states automatically.
 * 
 * @example
 * ```tsx
 * import { getUsers } from '../api/client'
 * import { useLambda } from '../hooks/useLambda'
 * 
 * export function UserList() {
 *   // Pass the API function (getUsers) to the hook
 *   const { data: users, loading, error, execute: fetchUsers } = useLambda(getUsers, [])
 * 
 *   // Call fetchUsers() when the component mounts
 *   useEffect(() => { fetchUsers() }, [fetchUsers])
 * 
 *   if (loading) return <Spinner />
 *   if (error) return <div>Error: {error}</div>
 *   
 *   return <div>{users?.map(u => <div key={u.id}>{u.firstName}</div>)}</div>
 * }
 * ```
 * 
 * @param lambdaFunc The async function that calls the Lambda (e.g. getUsers)
 * @param initialData Optional initial state for data
 */
export function useLambda<T, Args extends any[]>(
  lambdaFunc: (...args: Args) => Promise<T>,
  initialData: T | null = null
): UseLambdaResult<T, Args> {
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      try {
        setLoading(true)
        setError(null)
        const result = await lambdaFunc(...args)
        setData(result)
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [lambdaFunc]
  )

  const reset = useCallback(() => {
    setData(initialData)
    setError(null)
    setLoading(false)
  }, [initialData])

  return { data, loading, error, execute, reset }
}
