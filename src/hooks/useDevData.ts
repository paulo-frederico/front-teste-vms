import { useMemo } from 'react'

/**
 * Hook para carregar dados de demonstração (fixtures)
 *
 * @example
 * const tenants = useDevData(() => mockTenants, [])
 */
export function useDevData<T>(fixtureLoader: () => T, fallback: T): T {
  return useMemo(() => {
    try {
      return fixtureLoader()
    } catch (error) {
      console.error('❌ Erro ao carregar fixture:', error)
      return fallback
    }
  }, [fixtureLoader, fallback])
}
