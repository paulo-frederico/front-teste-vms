import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { AiAlertsKpisHeader } from '@/modules/admin/ai-alerts/components/AiAlertsKpisHeader'
import { AiEventsByTypeChart } from '@/modules/admin/ai-alerts/components/AiEventsByTypeChart'
import { AiEventsTimelineChart } from '@/modules/admin/ai-alerts/components/AiEventsTimelineChart'
import { AiEventsByTenantTable } from '@/modules/admin/ai-alerts/components/AiEventsByTenantTable'
import { AlertRuleDetailsDrawer } from '@/modules/admin/ai-alerts/components/AlertRuleDetailsDrawer'
import { AlertRulesList } from '@/modules/admin/ai-alerts/components/AlertRulesList'
import {
  aggregateEventsByType,
  buildAiAlertsKpis,
  buildEventsTimeline,
  buildTenantEventStats,
  type AiEvent
} from '@/modules/admin/ai-alerts/mockAiEvents'
import type { AlertRule } from '@/modules/admin/ai-alerts/mockAlertRules'
type AiAlertsFixturesModule = typeof import('@/fixtures')

let loadAiAlertsFixtures: () => Promise<AiAlertsFixturesModule>

if (import.meta.env.DEV) {
  let aiAlertsFixturesPromise: Promise<AiAlertsFixturesModule> | null = null
  loadAiAlertsFixtures = async () => {
    if (!aiAlertsFixturesPromise) {
      aiAlertsFixturesPromise = import('@/fixtures')
    }
    return aiAlertsFixturesPromise
  }
} else {
  loadAiAlertsFixtures = async () => {
    throw new Error('Fixtures não estão disponíveis em produção')
  }
}

export function AdminAiAlertsPage() {
  const [aiEvents, setAiEvents] = useState<AiEvent[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])

  useEffect(() => {
    if (import.meta.env.PROD) {
      return
    }

    let isMounted = true

    loadAiAlertsFixtures()
      .then(({ mockAiEvents, mockAlerts }) => {
        if (isMounted) {
          setAiEvents(mockAiEvents)
          setAlertRules(mockAlerts)
        }
      })
      .catch((error) => {
        console.error('❌ Erro ao carregar fixtures de IA:', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const kpiStats = useMemo(() => buildAiAlertsKpis(aiEvents), [aiEvents])
  const eventsByType = useMemo(() => aggregateEventsByType(aiEvents), [aiEvents])
  const timelineData = useMemo(() => buildEventsTimeline(aiEvents), [aiEvents])
  const tenantRows = useMemo(() => buildTenantEventStats(aiEvents).slice(0, 6), [aiEvents])
  const [selectedRule, setSelectedRule] = useState<AlertRule | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleSelectRule = (rule: AlertRule) => {
    setSelectedRule(rule)
    setIsDrawerOpen(true)
  }

  const handleDrawerChange = (open: boolean) => {
    setIsDrawerOpen(open)
    if (!open) {
      setSelectedRule(null)
    }
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">IA &amp; Alertas</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Visão consolidada</h1>
          <p className="text-sm text-slate-500">
            Acompanhe volumes, severidade e templates globais de inteligência artificial sem expor imagens ou gravações.
          </p>
        </div>
        <Button type="button" className="h-11 rounded-2xl bg-slate-900 text-white" disabled>
          Nova regra global
        </Button>
      </header>

      <AiAlertsKpisHeader stats={kpiStats} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <AiEventsByTypeChart data={eventsByType} />
          <AiEventsTimelineChart data={timelineData} />
        </div>
        <AiEventsByTenantTable rows={tenantRows} />
      </div>

      <div className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Regras globais de alerta</p>
          <h2 className="text-2xl font-semibold text-slate-900">Templates e severidades padrão</h2>
          <p className="text-sm text-slate-500">
            Ajustes macro definidos pelo Admin Master. Clientes Masters herdam e refinam conforme cada ambiente.
          </p>
        </div>
        <AlertRulesList rules={alertRules} onSelectRule={handleSelectRule} />
      </div>

      <AlertRuleDetailsDrawer rule={selectedRule} open={isDrawerOpen} onOpenChange={handleDrawerChange} />
    </section>
  )
}
