import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdminUserStatus } from '@/modules/admin/users/mockUsers'
import { SystemRole } from '@/modules/shared/types/auth'
import { ROLE_LABELS } from '@/modules/shared/types/roleLabels'

const STATUS_OPTIONS: Array<{ value: AdminUserStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos os status' },
  { value: 'active', label: 'Ativos' },
  { value: 'suspended', label: 'Suspensos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'invited', label: 'Convite enviado' },
]

const ROLE_OPTIONS: Array<{ value: SystemRole | 'all'; label: string }> = [
  { value: 'all', label: 'Todos os papéis' },
  { value: SystemRole.ADMIN_MASTER, label: ROLE_LABELS[SystemRole.ADMIN_MASTER] },
  { value: SystemRole.ADMIN, label: ROLE_LABELS[SystemRole.ADMIN] },
  { value: SystemRole.TECHNICIAN, label: ROLE_LABELS[SystemRole.TECHNICIAN] },
  { value: SystemRole.CLIENT_MASTER, label: ROLE_LABELS[SystemRole.CLIENT_MASTER] },
  { value: SystemRole.MANAGER, label: ROLE_LABELS[SystemRole.MANAGER] },
  { value: SystemRole.VIEWER, label: ROLE_LABELS[SystemRole.VIEWER] },
]

export type UserFiltersBarProps = {
  search: string
  role: SystemRole | 'all'
  status: AdminUserStatus | 'all'
  tenantId: string | 'all'
  tenants: Array<{ id: string; name: string }>
  onSearchChange: (value: string) => void
  onRoleChange: (value: SystemRole | 'all') => void
  onStatusChange: (value: AdminUserStatus | 'all') => void
  onTenantChange: (value: string | 'all') => void
  onClear: () => void
}

export function UserFiltersBar({
  search,
  role,
  status,
  tenantId,
  tenants,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onTenantChange,
  onClear,
}: UserFiltersBarProps) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nome ou e-mail"
            className="h-11 rounded-2xl border-slate-200 pl-10"
          />
        </div>
        <Select value={role} onValueChange={(value) => onRoleChange(value as SystemRole | 'all')}>
          <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 xl:w-[220px]">
            <SelectValue placeholder="Papel" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => onStatusChange(value as AdminUserStatus | 'all')}>
          <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 xl:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tenantId} onValueChange={(value) => onTenantChange(value as string | 'all')}>
          <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 xl:w-[240px]">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>
                {tenant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="ghost" className="h-11 rounded-2xl border border-slate-200 text-slate-600" onClick={onClear}>
          Limpar filtros
        </Button>
      </div>
    </div>
  )
}
