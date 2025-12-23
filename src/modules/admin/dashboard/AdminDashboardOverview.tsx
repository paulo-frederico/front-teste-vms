import { useMemo } from 'react'

import { AdminDashboardStatsCards } from './AdminDashboardStatsCards'
import { AdminDashboardCharts } from './AdminDashboardCharts'
import {
  getGlobalAdminDashboardData,
  getTenantAdminDashboardData,
  type AdminDashboardData,
} from '@/modules/admin/dashboard/adminDashboardMocks'
import { useAuth } from '@/contexts'
import { SystemRole } from '@/modules/shared/types/auth'

export function AdminDashboardOverview() {
  const { user } = useAuth()

  const isPlatformAdmin = user?.role === SystemRole.ADMIN_MASTER || user?.role === SystemRole.ADMIN
  const isClientMaster = user?.role === SystemRole.CLIENT_MASTER

  const data = useMemo<AdminDashboardData | null>(() => {
    if (isPlatformAdmin) {
      return getGlobalAdminDashboardData()
    }

    if (isClientMaster) {
      return getTenantAdminDashboardData(user?.tenantId || 'tenant-default')
    }

    return null
  }, [isPlatformAdmin, isClientMaster, user?.tenantId])

  if (!user) {
    return (
      <div className="rounded-xl border bg-white/70 p-6 text-sm text-muted-foreground">
        Carregando contexto do usuário...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-xl border bg-white/70 p-6 text-sm text-muted-foreground">
        Esta visão está disponível apenas para administradores globais ou do cliente.
      </div>
    )
  }

  const subtitle = isPlatformAdmin
    ? 'Visão geral consolidada de todos os clientes ativos.'
    : `Visão geral do cliente: ${user.tenantName || 'Ambiente dedicado'}`

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">{isPlatformAdmin ? 'Operação global' : 'Operação do cliente'}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <AdminDashboardStatsCards data={data} isGlobalAdmin={isPlatformAdmin} />
      <AdminDashboardCharts data={data} />
    </div>
  )
}
