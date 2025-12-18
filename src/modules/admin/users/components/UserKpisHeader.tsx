import { Card, CardContent } from '@/components/ui/card'
import type { AdminUserRow } from '../mockUsers'

export type UserKpiStats = {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  technicians: number
  clientMasters: number
}

const KPI_METADATA = [
  { key: 'totalUsers', label: 'Total de usuários' },
  { key: 'activeUsers', label: 'Usuários ativos' },
  { key: 'suspendedUsers', label: 'Usuários suspensos' },
  { key: 'technicians', label: 'Técnicos' },
  { key: 'clientMasters', label: 'Clientes master' },
] as const

function calculateStats(users: AdminUserRow[] | undefined): UserKpiStats {
  if (!users) {
    return {
      totalUsers: 0,
      activeUsers: 0,
      suspendedUsers: 0,
      technicians: 0,
      clientMasters: 0,
    }
  }

  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'ACTIVE').length,
    suspendedUsers: users.filter(u => u.status === 'SUSPENDED').length,
    technicians: users.filter(u => u.role === 'TECHNICIAN').length,
    clientMasters: users.filter(u => u.role === 'CLIENT_MASTER').length,
  }
}

export function UserKpisHeader({ users }: { users: AdminUserRow[] | undefined }) {
  const stats = calculateStats(users)

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {KPI_METADATA.map((kpi) => (
        <Card key={kpi.key} className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{kpi.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{stats[kpi.key].toLocaleString('pt-BR')}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
