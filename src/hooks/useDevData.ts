import { useMemo } from 'react'

/**
 * Hook para carregar dados de desenvolvimento (fixtures)
 * Em produção, sempre retorna o fallback informado
 *
 * @example
 * const tenants = useDevData(() => mockTenants, [])
 */
export function useDevData<T>(fixtureLoader: () => T, fallback: T): T {
  return useMemo(() => {
    if (import.meta.env.PROD) {
      console.warn('⚠️ useDevData chamado em produção - retornando fallback')
      return fallback
    }

    try {
      return fixtureLoader()
    } catch (error) {
      console.error('❌ Erro ao carregar fixture:', error)
      return fallback
    }
  }, [])
}
