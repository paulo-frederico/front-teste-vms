import { Activity, BellRing, Camera, HardDrive, Layers, Shield, Users } from 'lucide-react'

import { EventsTable } from '@/modules/admin/dashboard/components/EventsTable'
import { KpiCard } from '@/modules/admin/dashboard/components/KpiCard'
import { StatusDistribution } from '@/modules/admin/dashboard/components/StatusDistribution'
import { StorageDonutChart } from '@/modules/admin/dashboard/components/StorageDonutChart'
import { TrendCard } from '@/modules/admin/dashboard/components/TrendCard'
import { AdminMasterDashboard } from '@/modules/admin/dashboard/pages/AdminMasterDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { SystemRole } from '@/modules/shared/types/auth'

const dashboardMock = {
  onlineCameras: 212,
  totalCameras: 230,
  recordingsActive: 182,
  eventsToday: 342,
  activeClients: 18,
  storage: { used: 2480, total: 3200 },
  status: {
    online: 212,
    unstable: 6,
    offline: 8,
    maintenance: 4,
  },
  aiDistribution: [
    { label: 'Intrusão', value: 124, trend: 8.3, direction: 'up' as const },
    { label: 'Linha virtual', value: 98, trend: -2.1, direction: 'down' as const },
    { label: 'Contagem inteligente', value: 76, trend: 5.4, direction: 'up' as const },
    { label: 'LPR', value: 58, trend: 3.1, direction: 'up' as const },
  ],
  events: [
    {
      id: 'evt-001',
      type: 'intrusion' as const,
      camera: 'Entrada Leste HQ',
      site: 'Unifique HQ',
      time: '07/12 · 08:45',
      severity: 'high' as const,
      summary: 'Movimento fora da janela autorizada',
    },
    {
      id: 'evt-002',
      type: 'lpr' as const,
      camera: 'Portão Norte',
      site: 'HQ',
      time: '07/12 · 08:40',
      severity: 'medium' as const,
      summary: 'Placa ABC-1234 identificada e registrada',
    },
    {
      id: 'evt-003',
      type: 'line' as const,
      camera: 'Perímetro Oeste',
      site: 'Cliente GigaMall',
      time: '07/12 · 08:35',
      severity: 'medium' as const,
      summary: 'Linha virtual ativada no estoque externo',
    },
    {
      id: 'evt-004',
      type: 'loitering' as const,
      camera: 'Lobby Elevadores',
      site: 'Cliente Beta Tower',
      time: '07/12 · 08:20',
      severity: 'low' as const,
      summary: 'Permanência acima do limite monitorada',
    },
  ],
}

export function AdminDashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white/70 p-6 text-sm text-slate-500">
        Carregando dados do usuário...
      </div>
    )
  }

  const isPlatformAdmin = user.role === SystemRole.ADMIN_MASTER || user.role === SystemRole.ADMIN

  if (user.role === SystemRole.ADMIN_MASTER) {
    return <AdminMasterDashboard />
  }

  const subtitle = isPlatformAdmin
    ? 'Visão geral consolidada de todos os clientes.'
    : `Visão geral do cliente: ${user.tenantName || 'Ambiente dedicado'}`

  const kpis = [
    {
      title: 'Câmeras online',
      value: String(dashboardMock.onlineCameras),
      helper: `${dashboardMock.totalCameras} totais`,
      trend: { value: 3.2, label: 'vs ontem' },
      icon: <Camera className="h-5 w-5" />, 
    },
    {
      title: 'Gravações ativas',
      value: String(dashboardMock.recordingsActive),
      helper: 'Streams monitorados',
      trend: { value: 1.8, label: 'últ. 24h' },
      icon: <HardDrive className="h-5 w-5" />, 
    },
    {
      title: 'Eventos hoje',
      value: String(dashboardMock.eventsToday),
      helper: 'IA + sensores',
      trend: { value: 5.1, label: 'vs média' },
      icon: <Activity className="h-5 w-5" />, 
    },
    {
      title: 'Clientes ativos',
      value: String(dashboardMock.activeClients),
      helper: 'Instâncias monitoradas',
      trend: { value: 0.8, label: 'mês' },
      icon: <Users className="h-5 w-5" />, 
    },
  ]

  const statusItems = [
    {
      label: 'Online',
      color: '#22c55e',
      value: dashboardMock.status.online,
      description: 'Streams saudáveis e gravando corretamente',
    },
    {
      label: 'Instáveis',
      color: '#eab308',
      value: dashboardMock.status.unstable,
      description: 'Oscilações de rede identificadas pela IA',
    },
    {
      label: 'Offline',
      color: '#ef4444',
      value: dashboardMock.status.offline,
      description: 'Sem telemetria em tempo real, ação sugerida',
    },
    {
      label: 'Manutenção',
      color: '#6b7280',
      value: dashboardMock.status.maintenance,
      description: 'Intervenções programadas ou aprovisionadas',
    },
  ]

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-100 bg-white/90 px-6 py-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Painel principal</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <StorageDonutChart usedGb={dashboardMock.storage.used} totalGb={dashboardMock.storage.total} />
          <StatusDistribution items={statusItems} />
          <TrendCard
            title="Distribuição de IA"
            description="Maior incidência nas monitorias externas"
            value="213 insights"
            trendValue={6.2}
            trendLabel="vs última semana"
            dataPoints={[68, 72, 74, 80, 77, 85]}
            icon={<Shield className="h-5 w-5" />}
          />
        </div>

        <div className="space-y-6">
          <EventsTable events={dashboardMock.events} />
          <TrendCard
            title="Câmeras instáveis"
            description="Monitoramento proativo de quedas"
            value="6 unidades"
            trendValue={-2.4}
            trendLabel="vs ontem"
            dataPoints={[9, 8, 7, 7, 6, 6]}
            trendDirection="down"
            icon={<Layers className="h-5 w-5" />}
          />
          <TrendCard
            title="Alertas priorizados"
            description="Fila de atendimento do SOC"
            value="14 ativos"
            trendValue={3.9}
            trendLabel="nas últimas 4h"
            dataPoints={[10, 11, 12, 13, 14, 15]}
            icon={<BellRing className="h-5 w-5" />}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Distribuição de IA</p>
            <p className="text-xs text-slate-500">Modelos aplicados nos últimos 7 dias</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMock.aiDistribution.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <Shield className="h-4 w-4 text-slate-300" />
              </div>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{item.value}</p>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500">
                {item.direction === 'down' ? (
                  <span className="text-rose-500">↓ {Math.abs(item.trend)}%</span>
                ) : (
                  <span className="text-emerald-500">↑ {item.trend}%</span>
                )}
                <span className="text-slate-400">vs semana</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
