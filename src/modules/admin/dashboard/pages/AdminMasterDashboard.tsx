import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import { AlertTriangle, Camera, HardDrive, Server, TrendingUp, Users } from 'lucide-react'

import { dashboardService, type AlertaCritico, type ClientesPorPlano, type DashboardMetrics, type EventosIA, type ServidorIA, type TopCliente } from '@/services/api/dashboard.service'

type DashboardFixturesModule = typeof import('@/fixtures/dashboard.fixture')
type ChartDatum = Record<string, string | number>

let loadDashboardFixtures: () => Promise<DashboardFixturesModule>

if (import.meta.env.DEV) {
  let dashboardFixturesPromise: Promise<DashboardFixturesModule> | null = null
  loadDashboardFixtures = async () => {
    if (!dashboardFixturesPromise) {
      dashboardFixturesPromise = import('@/fixtures/dashboard.fixture')
    }
    return dashboardFixturesPromise
  }
} else {
  loadDashboardFixtures = async () => {
    throw new Error('Fixtures não estão disponíveis em produção')
  }
}

export const AdminMasterDashboard = () => {
  const isDev = import.meta.env.DEV

  const { data: metricas } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metricas'],
    queryFn: async () => {
      if (import.meta.env.PROD) {
        return dashboardService.obterMetricas()
      }
      const { mockDashboardMetrics } = await loadDashboardFixtures()
      return mockDashboardMetrics
    },
    refetchInterval: 30_000,
  })

  const { data: clientesPorPlano } = useQuery<ClientesPorPlano[]>({
    queryKey: ['dashboard-clientes-plano'],
    queryFn: async () => {
      if (import.meta.env.PROD) {
        return dashboardService.obterClientesPorPlano()
      }
      const { mockClientesPorPlano } = await loadDashboardFixtures()
      return mockClientesPorPlano
    },
    refetchInterval: 60_000,
  })

  const { data: eventosIA } = useQuery<EventosIA[]>({
    queryKey: ['dashboard-eventos-ia'],
    queryFn: async () => {
      if (import.meta.env.PROD) {
        return dashboardService.obterEventosIA(7)
      }
      const { mockEventosIA } = await loadDashboardFixtures()
      return mockEventosIA
    },
    refetchInterval: 60_000,
  })

  const { data: topClientes } = useQuery<TopCliente[]>({
    queryKey: ['dashboard-top-clientes'],
    queryFn: async () => {
      if (import.meta.env.PROD) {
        return dashboardService.obterTopClientes(5)
      }
      const { mockTopClientes } = await loadDashboardFixtures()
      return mockTopClientes
    },
    refetchInterval: 60_000,
  })

  const { data: alertasCriticos } = useQuery<AlertaCritico[]>({
    queryKey: ['dashboard-alertas'],
    queryFn: async () => {
      if (import.meta.env.PROD) {
        return dashboardService.obterAlertasCriticos()
      }
      const { mockAlertasCriticos } = await loadDashboardFixtures()
      return mockAlertasCriticos
    },
    refetchInterval: 15_000,
  })

  const { data: servidoresIA } = useQuery<ServidorIA[]>({
    queryKey: ['dashboard-servidores'],
    queryFn: async () => {
      if (import.meta.env.PROD) {
        return dashboardService.obterServidoresIA()
      }
      const { mockServidoresIA } = await loadDashboardFixtures()
      return mockServidoresIA
    },
    refetchInterval: 10_000,
  })

  const clientesPorPlanoData: ChartDatum[] = (clientesPorPlano ?? []).map((item) => ({ ...item }))
  const eventosIaData: ChartDatum[] = (eventosIA ?? []).map((item) => ({ ...item }))

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin Master</h1>
        <div className="text-sm text-gray-500">Última atualização: {new Date().toLocaleTimeString('pt-BR')}</div>
      </div>

      {isDev && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          ⚠️ Modo desenvolvimento - usando dados de fixture
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Clientes"
          value={metricas?.totalClientes ?? 0}
          subtitle={`${metricas?.clientesAtivos ?? 0} ativos`}
          change={metricas?.clientesHoje ?? 0}
          changeLabel="hoje"
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <KpiCard
          title="Câmeras"
          value={metricas?.totalCameras ?? 0}
          subtitle={`${Math.round(((metricas?.camerasOnline ?? 0) / Math.max(metricas?.totalCameras ?? 1, 1)) * 100)}% online`}
          icon={<Camera className="h-6 w-6" />}
          color="green"
        />
        <KpiCard
          title="Eventos (24h)"
          value={metricas?.eventos24h ?? 0}
          change={metricas?.eventosHoje ?? 0}
          changeLabel="hoje"
          icon={<AlertTriangle className="h-6 w-6" />}
          color="purple"
        />
        <KpiCard
          title="Storage"
          value={`${metricas?.storageUsado ?? 0}TB`}
          subtitle={`de ${metricas?.storageTotal ?? 0}TB (${metricas?.storagePercentual ?? 0}%)`}
          icon={<HardDrive className="h-6 w-6" />}
          color="orange"
          progress={metricas?.storagePercentual ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Clientes por Plano</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientesPorPlanoData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {clientesPorPlano?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Eventos de IA (últimos 7 dias)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={eventosIaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lpr" stroke="#3b82f6" strokeWidth={2} name="LPR" />
              <Line type="monotone" dataKey="intrusao" stroke="#ef4444" strokeWidth={2} name="Intrusão" />
              <Line type="monotone" dataKey="contagem" stroke="#10b981" strokeWidth={2} name="Contagem" />
              <Line type="monotone" dataKey="outros" stroke="#f59e0b" strokeWidth={2} name="Outros" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <TrendingUp className="h-5 w-5" />
            Top 5 Clientes (mais câmeras)
          </h2>
          <div className="space-y-3">
            {topClientes?.map((cliente, index) => (
              <div
                key={cliente.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{cliente.nome}</div>
                    <div className="text-sm text-gray-500">{cliente.plano}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{cliente.cameras} câmeras</div>
                  <div className="text-sm text-gray-500">{cliente.eventos.toLocaleString()} eventos</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <AlertTriangle className="h-5 w-5" />
            Alertas Críticos (últimas 24h)
          </h2>
          <div className="space-y-3">
            {(alertasCriticos?.length ?? 0) === 0 ? (
              <div className="py-8 text-center text-gray-500">✅ Nenhum alerta crítico no momento</div>
            ) : (
              alertasCriticos?.map((alerta) => (
                <div
                  key={alerta.id}
                  className={`rounded-lg border-l-4 p-3 ${
                    alerta.severidade === 'HIGH'
                      ? 'border-red-500 bg-red-50'
                      : alerta.severidade === 'MEDIUM'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{alerta.tipo}</div>
                      <div className="mt-1 text-sm text-gray-600">{alerta.mensagem}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {alerta.clienteNome}
                        {alerta.cameraNome ? ` • ${alerta.cameraNome}` : ''}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(alerta.timestamp).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
          <Server className="h-5 w-5" />
          Status dos Servidores de IA
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servidoresIA?.map((servidor) => (
            <div key={servidor.id} className="rounded-lg border p-4 transition hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">{servidor.nome}</div>
                  <div className="text-sm text-gray-500">{servidor.camerasProcessando} câmeras</div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    servidor.status === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {servidor.status}
                </span>
              </div>
              <div className="space-y-2">
                <ProgressBar label="CPU" value={servidor.cargaCPU} />
                <ProgressBar label="GPU" value={servidor.cargaGPU} />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Memória</span>
                  <span className="font-medium">
                    {servidor.memoriaUsada}GB / {servidor.memoriaTotal}GB
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(servidor.memoriaUsada / servidor.memoriaTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface KpiCardProps {
  title: string
  value: number | string
  subtitle?: string
  change?: number
  changeLabel?: string
  icon: ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange'
  progress?: number
}

const colorClasses: Record<KpiCardProps['color'], string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
}

const KpiCard = ({ title, value, subtitle, change, changeLabel, icon, color, progress }: KpiCardProps) => (
  <div className="rounded-lg bg-white p-6 shadow">
    <div className="mb-4 flex items-center justify-between">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClasses[color]}`}>{icon}</div>
      {change !== undefined && (
        <div className="text-right">
          <div className="text-sm font-medium text-green-600">+{change}</div>
          {changeLabel && <div className="text-xs text-gray-500">{changeLabel}</div>}
        </div>
      )}
    </div>
    <div className="mb-1 text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-600">{title}</div>
    {subtitle && <div className="mt-1 text-xs text-gray-500">{subtitle}</div>}
    {progress !== undefined && (
      <div className="mt-3">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-full ${progress > 80 ? 'bg-red-500' : progress > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )}
  </div>
)

interface ProgressBarProps {
  label: string
  value: number
}

const ProgressBar = ({ label, value }: ProgressBarProps) => (
  <div>
    <div className="mb-1 flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className={`h-2 rounded-full ${value > 80 ? 'bg-red-500' : value > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
)
