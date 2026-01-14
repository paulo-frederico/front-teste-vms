/**
 * Dashboard do Cliente Master
 * Visão completa do tenant com todas as funcionalidades permitidas
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  BellRing,
  Camera,
  MapPin,
  Shield,
  Users,
  Video,
  Settings,
  AlertTriangle,
  Play,
  Clock,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts'
import { mockLocations } from '@/fixtures/locations.fixture'
import { mockCameras } from '@/fixtures/cameras.fixture'

import { KpiCard } from '@/modules/admin/dashboard/components/KpiCard'
import { StatusDistribution } from '@/modules/admin/dashboard/components/StatusDistribution'
import { StorageDonutChart } from '@/modules/admin/dashboard/components/StorageDonutChart'
import { EventsTable } from '@/modules/admin/dashboard/components/EventsTable'

export function ClientMasterDashboard() {
  const { user } = useAuth()

  // Filtrar locais e câmeras pelo tenant do usuário
  const tenantLocations = useMemo(() => {
    if (!user?.tenantId) return []
    return mockLocations.filter((loc) => loc.tenantId === user.tenantId)
  }, [user?.tenantId])

  const tenantCameras = useMemo(() => {
    if (!user?.tenantId) return []
    const locationIds = tenantLocations.map((loc) => loc.id)
    return mockCameras.filter((cam) => locationIds.includes(cam.locationId))
  }, [user?.tenantId, tenantLocations])

  // Estatísticas do tenant
  const stats = useMemo(() => {
    const totalCameras = tenantLocations.reduce((sum, loc) => sum + loc.cameras, 0)
    const onlineCameras = tenantLocations.reduce((sum, loc) => sum + loc.onlineCameras, 0)
    const offlineCameras = tenantLocations.reduce((sum, loc) => sum + loc.offlineCameras, 0)
    const unstableCameras = tenantLocations.reduce((sum, loc) => sum + loc.unstableCameras, 0)
    const maintenanceCameras = tenantLocations.reduce((sum, loc) => sum + loc.maintenanceCameras, 0)

    return {
      totalCameras,
      onlineCameras,
      offlineCameras,
      unstableCameras,
      maintenanceCameras,
      totalSites: tenantLocations.length,
      storageUsed: Math.round(totalCameras * 8.5), // Mock: ~8.5GB por câmera
      storageTotal: Math.round(totalCameras * 15), // Mock: ~15GB alocado por câmera
    }
  }, [tenantLocations])

  // Eventos mock filtrados pelo tenant
  const tenantEvents = useMemo(
    () => [
      {
        id: 'evt-001',
        type: 'intrusion' as const,
        camera: tenantCameras[0]?.name || 'Câmera Principal',
        site: tenantLocations[0]?.name || 'Local Principal',
        time: 'Agora',
        severity: 'high' as const,
        summary: 'Movimento detectado fora do horário autorizado',
      },
      {
        id: 'evt-002',
        type: 'line' as const,
        camera: tenantCameras[1]?.name || 'Câmera Secundária',
        site: tenantLocations[0]?.name || 'Local Principal',
        time: '5 min atrás',
        severity: 'medium' as const,
        summary: 'Cruzamento de linha virtual registrado',
      },
      {
        id: 'evt-003',
        type: 'lpr' as const,
        camera: tenantCameras[0]?.name || 'Câmera Principal',
        site: tenantLocations[0]?.name || 'Local Principal',
        time: '12 min atrás',
        severity: 'low' as const,
        summary: 'Placa identificada e registrada no sistema',
      },
    ],
    [tenantCameras, tenantLocations]
  )

  // KPIs específicos do cliente
  const kpis = [
    {
      title: 'Câmeras Online',
      value: String(stats.onlineCameras),
      helper: `${stats.totalCameras} totais`,
      trend: { value: 2.1, label: 'vs ontem' },
      icon: <Camera className="h-5 w-5" />,
    },
    {
      title: 'Locais Monitorados',
      value: String(stats.totalSites),
      helper: 'Sites ativos',
      trend: { value: 0, label: 'estável' },
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      title: 'Eventos Hoje',
      value: String(Math.round(stats.totalCameras * 1.5)),
      helper: 'IA + sensores',
      trend: { value: 4.2, label: 'vs média' },
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: 'Alertas Pendentes',
      value: String(Math.round(stats.totalCameras * 0.1)),
      helper: 'Aguardando análise',
      trend: { value: -1.5, label: 'vs ontem' },
      icon: <BellRing className="h-5 w-5" />,
    },
  ]

  // Status das câmeras
  const statusItems = [
    {
      label: 'Online',
      color: '#22c55e',
      value: stats.onlineCameras,
      description: 'Transmitindo e gravando normalmente',
    },
    {
      label: 'Instáveis',
      color: '#eab308',
      value: stats.unstableCameras,
      description: 'Oscilações de conexão detectadas',
    },
    {
      label: 'Offline',
      color: '#ef4444',
      value: stats.offlineCameras,
      description: 'Sem comunicação, ação necessária',
    },
    {
      label: 'Manutenção',
      color: '#6b7280',
      value: stats.maintenanceCameras,
      description: 'Em manutenção programada',
    },
  ]

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header do Cliente */}
      <header className="rounded-3xl border border-slate-100 bg-white/90 px-6 py-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Painel do Cliente
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{user.tenantName}</h1>
            <p className="text-sm text-slate-500">
              Bem-vindo(a), {user.name}. Você tem acesso completo ao seu ambiente de monitoramento.
            </p>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            Cliente Master
          </Badge>
        </div>
      </header>

      {/* Ações Rápidas */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/client/videowall">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Video Wall</p>
                <p className="text-xs text-muted-foreground">Monitorar ao vivo</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/client/cameras">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Câmeras</p>
                <p className="text-xs text-muted-foreground">Gerenciar dispositivos</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/client/playback">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
                <Play className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Gravações</p>
                <p className="text-xs text-muted-foreground">Playback e exportação</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/client/users">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Usuários</p>
                <p className="text-xs text-muted-foreground">Gerenciar acessos</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </section>

      {/* Conteúdo Principal */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Coluna Esquerda */}
        <div className="space-y-6">
          {/* Armazenamento */}
          <StorageDonutChart usedGb={stats.storageUsed} totalGb={stats.storageTotal} />

          {/* Status das Câmeras */}
          <StatusDistribution items={statusItems} />

          {/* Locais */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Meus Locais</CardTitle>
                  <CardDescription>Sites monitorados no seu tenant</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/client/sites">Ver todos</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {tenantLocations.slice(0, 4).map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{location.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {location.cameras} câmeras
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={location.offlineCameras > 0 ? 'destructive' : 'default'}
                      className="text-[10px]"
                    >
                      {location.onlineCameras}/{location.cameras} online
                    </Badge>
                  </div>
                </div>
              ))}
              {tenantLocations.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Nenhum local encontrado para este tenant
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita */}
        <div className="space-y-6">
          {/* Eventos Recentes */}
          <EventsTable events={tenantEvents} />

          {/* Ações de IA */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Configuração de IA</CardTitle>
                  <CardDescription>Módulos de inteligência artificial</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/client/ai-config">Configurar</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: 'Detecção de Intrusão', active: true, icon: Shield },
                  { name: 'Linha Virtual', active: true, icon: Activity },
                  { name: 'LPR (Placas)', active: true, icon: Camera },
                  { name: 'Contagem de Pessoas', active: false, icon: Users },
                ].map((module) => (
                  <div
                    key={module.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <module.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{module.name}</span>
                    </div>
                    <Badge variant={module.active ? 'default' : 'secondary'}>
                      {module.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suporte */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Suporte e Manutenção</CardTitle>
              <CardDescription>Solicite ajuda ou manutenção técnica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/client/support">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Abrir Chamado Técnico
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/client/technician-access">
                  <Clock className="h-4 w-4 mr-2" />
                  Aprovar Acesso de Técnico
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/client/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações do Tenant
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
