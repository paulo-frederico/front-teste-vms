import { useEffect, useMemo, useState } from 'react'

import { AuditActionBadge } from '@/modules/admin/audit/components/AuditActionBadge'
import { AuditEventDetailsDrawer } from '@/modules/admin/audit/components/AuditEventDetailsDrawer'
import { AuditEventsTable } from '@/modules/admin/audit/components/AuditEventsTable'
import { AuditFiltersBar, type AuditDateRange } from '@/modules/admin/audit/components/AuditFiltersBar'
import { AuditKpisHeader } from '@/modules/admin/audit/components/AuditKpisHeader'
import type { AuditActionType, AuditEvent, AuditSeverity } from '@/modules/admin/audit/mockAuditEvents'
import {
  AUDIT_ACTION_LABELS,
  AUDIT_REFERENCE_TIMESTAMP,
  buildAuditKpis,
  getUniqueAuditTenants
} from '@/modules/admin/audit/mockAuditEvents'
import { AuditSeverityBadge } from '@/modules/admin/audit/components/AuditSeverityBadge'
import type { SystemRole } from '@/modules/shared/types/auth'
type AuditFixturesModule = typeof import('@/fixtures')

let loadAuditFixtures: () => Promise<AuditFixturesModule>

if (import.meta.env.DEV) {
  let auditFixturesPromise: Promise<AuditFixturesModule> | null = null
  loadAuditFixtures = async () => {
    if (!auditFixturesPromise) {
      auditFixturesPromise = import('@/fixtures')
    }
    return auditFixturesPromise
  }
} else {
  loadAuditFixtures = async () => {
    throw new Error('Fixtures não estão disponíveis em produção')
  }
}

const DATE_RANGE_MS: Record<Exclude<AuditDateRange, 'custom'>, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
}

export function AdminAuditPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<SystemRole | 'all'>('all')
  const [severity, setSeverity] = useState<AuditSeverity | 'all'>('all')
  const [action, setAction] = useState<AuditActionType | 'all'>('all')
  const [tenant, setTenant] = useState<string | 'all'>('all')
  const [dateRange, setDateRange] = useState<AuditDateRange>('24h')
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])

  useEffect(() => {
    if (import.meta.env.PROD) {
      return
    }

    let isMounted = true

    loadAuditFixtures()
      .then(({ mockAuditEvents }) => {
        if (isMounted) {
          setAuditEvents(mockAuditEvents)
        }
      })
      .catch((error) => {
        console.error('❌ Erro ao carregar fixtures de auditoria:', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const stats = useMemo(() => buildAuditKpis(auditEvents, AUDIT_REFERENCE_TIMESTAMP), [auditEvents])
  const tenantOptions = useMemo(() => getUniqueAuditTenants(auditEvents), [auditEvents])
  const actionOptions = useMemo(() => {
    const unique = Array.from(new Set(auditEvents.map((event) => event.actionType)))
    return unique.sort((a, b) => AUDIT_ACTION_LABELS[a].localeCompare(AUDIT_ACTION_LABELS[b]))
  }, [auditEvents])

  const filteredEvents = useMemo(() => {
    const rangeLimit =
      dateRange === 'custom' ? null : AUDIT_REFERENCE_TIMESTAMP - DATE_RANGE_MS[dateRange]
    const searchTerm = search.trim().toLowerCase()

    return auditEvents.filter((event) => {
      if (rangeLimit && new Date(event.timestamp).getTime() < rangeLimit) {
        return false
      }
      if (role !== 'all' && event.actorRole !== role) {
        return false
      }
      if (severity !== 'all' && event.severity !== severity) {
        return false
      }
      if (action !== 'all' && event.actionType !== action) {
        return false
      }
      if (tenant !== 'all' && event.tenantId !== tenant) {
        return false
      }
      if (searchTerm) {
        const haystack = [
          event.actorName,
          event.actorEmail,
          event.description,
          event.resourceName,
          event.resourceType,
          AUDIT_ACTION_LABELS[event.actionType],
          event.tenantName,
          event.id,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(searchTerm)) {
          return false
        }
      }
      return true
    })
  }, [search, role, severity, action, tenant, dateRange, auditEvents])

  const handleResetFilters = () => {
    setSearch('')
    setRole('all')
    setSeverity('all')
    setAction('all')
    setTenant('all')
    setDateRange('24h')
  }

  const handleSelectEvent = (event: AuditEvent) => {
    setSelectedEvent(event)
    setDrawerOpen(true)
  }

  const handleDrawerChange = (open: boolean) => {
    setDrawerOpen(open)
    if (!open) {
      setSelectedEvent(null)
    }
  }

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Auditoria &amp; Trilhas</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Auditoria &amp; Trilhas de Ação</h1>
            <p className="text-sm text-slate-500">Registro detalhado de ações administrativas, infraestruturais e de IA sem expor dados sensíveis.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <AuditSeverityBadge severity="high" />
            <AuditActionBadge action="IA_CONFIG_CHANGED" resourceType="IA" />
            <p className="text-slate-600">Telemetria contínua alimentada pelos módulos da plataforma.</p>
          </div>
        </div>
      </header>

      <AuditKpisHeader stats={stats} />

      <AuditFiltersBar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        severity={severity}
        onSeverityChange={setSeverity}
        action={action}
        onActionChange={setAction}
        tenant={tenant}
        onTenantChange={setTenant}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        availableActions={actionOptions}
        availableTenants={tenantOptions}
        onReset={handleResetFilters}
      />

      <AuditEventsTable events={filteredEvents} onSelectEvent={handleSelectEvent} />

      <AuditEventDetailsDrawer event={selectedEvent} open={drawerOpen} onOpenChange={handleDrawerChange} />
    </section>
  )
}
