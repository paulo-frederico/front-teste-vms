import { Search, SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { SystemRole } from '@/modules/shared/types/auth'
import { ROLE_LABELS } from '@/modules/shared/types/roleLabels'
import type { AuditActionType, AuditSeverity } from '@/modules/admin/audit/mockAuditEvents'
import { AUDIT_ACTION_LABELS } from '@/modules/admin/audit/mockAuditEvents'

export type AuditDateRange = '24h' | '7d' | '30d' | 'custom'

const SEVERITY_OPTIONS: Array<{ value: AuditSeverity | 'all'; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
]

const ROLE_OPTIONS: Array<{ value: SystemRole | 'all'; label: string }> = (
  [
    { value: 'all', label: 'Todos os papéis' },
    { value: SystemRole.ADMIN_MASTER, label: ROLE_LABELS[SystemRole.ADMIN_MASTER] },
    { value: SystemRole.ADMIN, label: ROLE_LABELS[SystemRole.ADMIN] },
    { value: SystemRole.TECHNICIAN, label: ROLE_LABELS[SystemRole.TECHNICIAN] },
    { value: SystemRole.CLIENT_MASTER, label: ROLE_LABELS[SystemRole.CLIENT_MASTER] },
    { value: SystemRole.MANAGER, label: ROLE_LABELS[SystemRole.MANAGER] },
    { value: SystemRole.VIEWER, label: ROLE_LABELS[SystemRole.VIEWER] },
  ] satisfies Array<{ value: SystemRole | 'all'; label: string }>
)

const DATE_RANGE_OPTIONS: Array<{ value: AuditDateRange; label: string }> = [
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: 'custom', label: 'Intervalo customizado' },
]

export type AuditFiltersBarProps = {
  search: string
  onSearchChange: (value: string) => void
  role: SystemRole | 'all'
  onRoleChange: (value: SystemRole | 'all') => void
  severity: AuditSeverity | 'all'
  onSeverityChange: (value: AuditSeverity | 'all') => void
  action: AuditActionType | 'all'
  onActionChange: (value: AuditActionType | 'all') => void
  tenant: string | 'all'
  onTenantChange: (value: string | 'all') => void
  dateRange: AuditDateRange
  onDateRangeChange: (value: AuditDateRange) => void
  availableActions: AuditActionType[]
  availableTenants: Array<{ id: string; name: string }>
  onReset: () => void
}

export function AuditFiltersBar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  severity,
  onSeverityChange,
  action,
  onActionChange,
  tenant,
  onTenantChange,
  dateRange,
  onDateRangeChange,
  availableActions,
  availableTenants,
  onReset,
}: AuditFiltersBarProps) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        <SlidersHorizontal className="h-4 w-4" /> Filtros avançados
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Busca</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por usuário, recurso ou descrição"
              className="border-0 p-0 text-sm focus-visible:ring-0"
            />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Papel</label>
          <Select value={role} onValueChange={(value) => onRoleChange(value as SystemRole | 'all')}>
            <SelectTrigger className="mt-2 rounded-2xl border-slate-200 text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Severidade</label>
          <Select value={severity} onValueChange={(value) => onSeverityChange(value as AuditSeverity | 'all')}>
            <SelectTrigger className="mt-2 rounded-2xl border-slate-200 text-sm">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {SEVERITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Tipo de ação</label>
          <Select value={action} onValueChange={(value) => onActionChange(value as AuditActionType | 'all')}>
            <SelectTrigger className="mt-2 rounded-2xl border-slate-200 text-sm">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">Todas</SelectItem>
              {availableActions.map((actionType) => (
                <SelectItem key={actionType} value={actionType}>
                  {AUDIT_ACTION_LABELS[actionType]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Cliente</label>
          <Select value={tenant} onValueChange={(value) => onTenantChange(value)}>
            <SelectTrigger className="mt-2 rounded-2xl border-slate-200 text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">Todos</SelectItem>
              {availableTenants.map((tenantOption) => (
                <SelectItem key={tenantOption.id} value={tenantOption.id}>
                  {tenantOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Período</label>
          <Select value={dateRange} onValueChange={(value) => onDateRangeChange(value as AuditDateRange)}>
            <SelectTrigger className="mt-2 rounded-2xl border-slate-200 text-sm">
              <SelectValue placeholder="Últimas 24h" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col justify-end gap-2 lg:col-span-3 lg:flex-row lg:items-end lg:justify-end">
          <p className="text-xs text-slate-400">Intervalo customizado disponível na próxima sprint.</p>
          <Button variant="ghost" className="rounded-2xl border border-slate-200 text-slate-600" onClick={onReset}>
            Limpar filtros
          </Button>
        </div>
      </div>
    </section>
  )
}
