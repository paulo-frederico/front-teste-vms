import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useUsers } from '@/hooks/useUsers'
import { useTenants } from '@/hooks/useTenants'
import { UserFiltersBar } from '../components/UserFiltersBar'
import { UserKpisHeader } from '../components/UserKpisHeader'
import { UserListTable } from '../components/UserListTable'
import { UserDetailsDrawer } from '../UserDetailsDrawer'
import type { AdminUserRow } from '../mockUsers'
import type { SystemRole, UserStatus } from '@/modules/shared/types/auth'
import type { AdminUserStatus } from '../mockUsers'

export function UsersListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<SystemRole | 'all'>('all')
  const [status, setStatus] = useState<AdminUserStatus | 'all'>('all')
  const [tenantId, setTenantId] = useState<string | 'all'>('all')

  const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { data, isLoading } = useUsers({
    role: role === 'all' ? undefined : role,
    status: status === 'all' ? undefined : (status as UserStatus),
    tenantId: tenantId === 'all' ? undefined : tenantId,
    search,
  })
  
  const { data: tenantsData } = useTenants()
  const tenants = tenantsData?.tenants || []

  const handleSelectUser = (user: AdminUserRow) => {
    setSelectedUser(user)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedUser(null)
  }

  const handleCreateUser = () => {
    navigate('/admin/users/new')
  }

  const users = data?.users || []

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie todos os usuários da plataforma</p>
        </div>
        <Button onClick={handleCreateUser} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo usuário
        </Button>
      </div>

      <UserKpisHeader users={users as unknown as AdminUserRow[]} />

      <UserFiltersBar
        search={search}
        role={role}
        status={status}
        tenantId={tenantId}
        tenants={tenants.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name }))}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onStatusChange={setStatus}
        onTenantChange={setTenantId}
        onClear={() => {
          setSearch('')
          setRole('all')
          setStatus('all')
          setTenantId('all')
        }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-slate-500">Carregando usuários...</p>
        </div>
      ) : (
        <UserListTable
          users={users as unknown as AdminUserRow[]}
          onSelectUser={handleSelectUser}
        />
      )}

      <UserDetailsDrawer
        userId={selectedUser?.id ?? null}
        open={isDrawerOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDrawer()
        }}
        availableTenants={tenants.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name }))}
        currentUserRole={'ADMIN_MASTER' as import('@/modules/shared/types/auth').UserRole}
        onUserUpdated={() => {}}
      />
    </div>
  )
}
