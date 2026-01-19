import { Activity, BellRing, Camera, HardDrive, Layers, Shield, Users } from 'lucide-react'

import { EventsTable } from '@/modules/admin/dashboard/components/EventsTable'
import { StatusDistribution } from '@/modules/admin/dashboard/components/StatusDistribution'
import { StorageDonutChart } from '@/modules/admin/dashboard/components/StorageDonutChart'
import { AdminMasterDashboard } from '@/modules/admin/dashboard/pages/AdminMasterDashboard'
import { useAuth } from '@/contexts'
import { SystemRole } from '@/modules/shared/types/auth'
import {
  BentoGrid,
  BentoCard,
  BentoCardHeader,
  BentoCardContent,
  BentoMetric,
  BentoSparkline,
} from '@/components/ui/bento-grid'

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
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-3xl border border-slate-100 bg-white/90 px-6 py-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Painel principal</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </header>

      {/* Bento Grid Layout */}
      <BentoGrid columns={4} gap="md">
        {/* KPI - Câmeras Online */}
        <BentoCard size="sm" variant="elevated" delay={0}>
          <BentoCardHeader
            title="Câmeras online"
            icon={<Camera className="h-5 w-5" />}
          />
          <BentoCardContent>
            <BentoMetric
              value={dashboardMock.onlineCameras}
              label={`de ${dashboardMock.totalCameras} totais`}
              trend={{ value: 3.2, label: 'vs ontem' }}
            />
          </BentoCardContent>
        </BentoCard>

        {/* KPI - Gravações Ativas */}
        <BentoCard size="sm" variant="elevated" delay={1}>
          <BentoCardHeader
            title="Gravações ativas"
            icon={<HardDrive className="h-5 w-5" />}
          />
          <BentoCardContent>
            <BentoMetric
              value={dashboardMock.recordingsActive}
              label="Streams monitorados"
              trend={{ value: 1.8, label: 'últ. 24h' }}
            />
          </BentoCardContent>
        </BentoCard>

        {/* KPI - Eventos Hoje */}
        <BentoCard size="sm" variant="elevated" delay={2}>
          <BentoCardHeader
            title="Eventos hoje"
            icon={<Activity className="h-5 w-5" />}
          />
          <BentoCardContent>
            <BentoMetric
              value={dashboardMock.eventsToday}
              label="IA + sensores"
              trend={{ value: 5.1, label: 'vs média' }}
            />
          </BentoCardContent>
        </BentoCard>

        {/* KPI - Clientes Ativos */}
        <BentoCard size="sm" variant="elevated" delay={3}>
          <BentoCardHeader
            title="Clientes ativos"
            icon={<Users className="h-5 w-5" />}
          />
          <BentoCardContent>
            <BentoMetric
              value={dashboardMock.activeClients}
              label="Instâncias monitoradas"
              trend={{ value: 0.8, label: 'mês' }}
            />
          </BentoCardContent>
        </BentoCard>

        {/* Storage Chart - Larger card */}
        <BentoCard size="md" variant="glass" delay={4}>
          <StorageDonutChart usedGb={dashboardMock.storage.used} totalGb={dashboardMock.storage.total} />
        </BentoCard>

        {/* Status Distribution - Larger card */}
        <BentoCard size="md" variant="default" delay={5}>
          <StatusDistribution items={statusItems} />
        </BentoCard>

        {/* Events Table - Full width */}
        <BentoCard size="full" variant="default" delay={6}>
          <EventsTable events={dashboardMock.events} />
        </BentoCard>

        {/* Trend Card - IA Distribution */}
        <BentoCard size="md" variant="gradient" delay={7}>
          <BentoCardHeader
            title="Distribuição de IA"
            description="Maior incidência nas monitorias externas"
            icon={<Shield className="h-5 w-5" />}
          />
          <BentoCardContent className="flex items-end justify-between">
            <BentoMetric
              value="213"
              label="insights"
              trend={{ value: 6.2, label: 'vs semana' }}
              size="lg"
            />
            <div className="h-16 w-32">
              <BentoSparkline
                data={[68, 72, 74, 80, 77, 85]}
                color="hsl(var(--primary))"
                height={64}
              />
            </div>
          </BentoCardContent>
        </BentoCard>

        {/* Trend Card - Câmeras Instáveis */}
        <BentoCard size="sm" variant="default" delay={8}>
          <BentoCardHeader
            title="Câmeras instáveis"
            icon={<Layers className="h-5 w-5" />}
          />
          <BentoCardContent>
            <BentoMetric
              value="6"
              label="unidades"
              trend={{ value: -2.4, label: 'vs ontem' }}
            />
            <div className="mt-3 h-10">
              <BentoSparkline
                data={[9, 8, 7, 7, 6, 6]}
                color="hsl(var(--destructive))"
                height={40}
              />
            </div>
          </BentoCardContent>
        </BentoCard>

        {/* Trend Card - Alertas */}
        <BentoCard size="sm" variant="default" delay={9}>
          <BentoCardHeader
            title="Alertas priorizados"
            icon={<BellRing className="h-5 w-5" />}
          />
          <BentoCardContent>
            <BentoMetric
              value="14"
              label="ativos"
              trend={{ value: 3.9, label: 'nas últimas 4h' }}
            />
            <div className="mt-3 h-10">
              <BentoSparkline
                data={[10, 11, 12, 13, 14, 15]}
                color="hsl(var(--warning))"
                height={40}
              />
            </div>
          </BentoCardContent>
        </BentoCard>

        {/* AI Distribution Cards */}
        {dashboardMock.aiDistribution.map((item, index) => (
          <BentoCard key={item.label} size="sm" variant="elevated" delay={10 + index}>
            <BentoCardHeader
              title={item.label}
              icon={<Shield className="h-4 w-4" />}
            />
            <BentoCardContent>
              <BentoMetric
                value={item.value}
                trend={{
                  value: item.direction === 'down' ? -Math.abs(item.trend) : item.trend,
                  label: 'vs semana',
                }}
              />
            </BentoCardContent>
          </BentoCard>
        ))}
      </BentoGrid>
    </div>
  )
}
