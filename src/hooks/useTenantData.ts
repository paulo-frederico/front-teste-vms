/**
 * Hook para filtrar dados pelo tenant do usuário logado
 * Garante que o Cliente Master só veja dados do seu próprio tenant
 */

import { useMemo } from 'react'
import { useAuth } from '@/contexts'
import { SystemRole } from '@/modules/shared/types/auth'
import { mockLocations } from '@/fixtures/locations.fixture'
import { mockCameras } from '@/fixtures/cameras.fixture'
import type { AdminLocation } from '@/modules/admin/locations/mockLocations'
import type { AdminCamera } from '@/modules/admin/locations/mockCameras'

interface TenantDataResult {
  /** Locais filtrados pelo tenant */
  locations: AdminLocation[]
  /** Câmeras filtradas pelo tenant */
  cameras: AdminCamera[]
  /** ID do tenant do usuário logado */
  tenantId: string | undefined
  /** Nome do tenant do usuário logado */
  tenantName: string | undefined
  /** Se o usuário é admin (vê todos os dados) */
  isAdmin: boolean
  /** Se o usuário é cliente (vê apenas dados do tenant) */
  isClientUser: boolean
  /** Estatísticas agregadas */
  stats: {
    totalCameras: number
    onlineCameras: number
    offlineCameras: number
    unstableCameras: number
    maintenanceCameras: number
    totalSites: number
  }
}

/**
 * Hook que retorna dados filtrados pelo tenant do usuário logado
 *
 * - Admin Master e Admin veem TODOS os dados
 * - Cliente Master, Gerente e Visualizador veem apenas dados do próprio tenant
 */
export function useTenantData(): TenantDataResult {
  const { user } = useAuth()

  // Determinar se é admin ou cliente
  const isAdmin = useMemo(() => {
    if (!user) return false
    return user.role === SystemRole.ADMIN_MASTER || user.role === SystemRole.ADMIN
  }, [user])

  const isClientUser = useMemo(() => {
    if (!user) return false
    return (
      user.role === SystemRole.CLIENT_MASTER ||
      user.role === SystemRole.MANAGER ||
      user.role === SystemRole.VIEWER
    )
  }, [user])

  // Filtrar locais pelo tenant
  const locations = useMemo(() => {
    if (!user) return []

    // Admin vê tudo
    if (isAdmin) {
      return mockLocations
    }

    // Cliente vê apenas do seu tenant
    if (user.tenantId) {
      return mockLocations.filter((loc) => loc.tenantId === user.tenantId)
    }

    return []
  }, [user, isAdmin])

  // Filtrar câmeras pelos locais do tenant
  const cameras = useMemo(() => {
    if (!user) return []

    // Admin vê tudo
    if (isAdmin) {
      return mockCameras
    }

    // Cliente vê apenas câmeras dos seus locais
    const locationIds = locations.map((loc) => loc.id)
    return mockCameras.filter((cam) => locationIds.includes(cam.locationId))
  }, [user, isAdmin, locations])

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalCameras = locations.reduce((sum, loc) => sum + loc.cameras, 0)
    const onlineCameras = locations.reduce((sum, loc) => sum + loc.onlineCameras, 0)
    const offlineCameras = locations.reduce((sum, loc) => sum + loc.offlineCameras, 0)
    const unstableCameras = locations.reduce((sum, loc) => sum + loc.unstableCameras, 0)
    const maintenanceCameras = locations.reduce((sum, loc) => sum + loc.maintenanceCameras, 0)
    const totalSites = locations.length

    return {
      totalCameras,
      onlineCameras,
      offlineCameras,
      unstableCameras,
      maintenanceCameras,
      totalSites,
    }
  }, [locations])

  return {
    locations,
    cameras,
    tenantId: user?.tenantId,
    tenantName: user?.tenantName,
    isAdmin,
    isClientUser,
    stats,
  }
}

/**
 * Hook para verificar se o usuário tem acesso a um recurso específico
 */
export function useCanAccessResource(resourceTenantId?: string): boolean {
  const { user } = useAuth()

  return useMemo(() => {
    if (!user) return false

    // Admin pode acessar tudo
    if (user.role === SystemRole.ADMIN_MASTER || user.role === SystemRole.ADMIN) {
      return true
    }

    // Cliente só pode acessar recursos do seu tenant
    if (!resourceTenantId) return false
    return user.tenantId === resourceTenantId
  }, [user, resourceTenantId])
}

/**
 * Hook para obter o filtro de tenant para queries
 */
export function useTenantFilter(): { tenantId?: string } {
  const { user } = useAuth()

  return useMemo(() => {
    if (!user) return {}

    // Admin não filtra por tenant
    if (user.role === SystemRole.ADMIN_MASTER || user.role === SystemRole.ADMIN) {
      return {}
    }

    // Cliente filtra pelo seu tenant
    return { tenantId: user.tenantId }
  }, [user])
}
