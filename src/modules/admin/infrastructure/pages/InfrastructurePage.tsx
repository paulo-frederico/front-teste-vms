import { useState } from 'react'
import {
  Server,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Users,
  Camera,
  Plus,
  Settings,
  Trash2,
  Scale
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { InfraKpisHeader } from '../components/InfraKpisHeader'
import { InfraHealthSummary } from '../components/InfraHealthSummary'
import { ServerTypeBadge } from '../components/ServerTypeBadge'
import { ServerStatusBadge } from '../components/ServerStatusBadge'
import { ServerForm } from '../components/ServerForm'
import { LoadBalancerConfig } from '../components/LoadBalancerConfig'
import {
  INFRA_SERVERS,
  buildInfraKpis,
  buildInfraHealthSummary,
  getServerTopTenants,
  type InfraServer,
  type InfraServerType,
  type InfraServerStatus
} from '../mockServers'

export function InfrastructurePage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('servers')
  const [servers, setServers] = useState<InfraServer[]>(INFRA_SERVERS)
  const [typeFilter, setTypeFilter] = useState<InfraServerType | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<InfraServerStatus | 'ALL'>('ALL')

  // Modal states
  const [showServerForm, setShowServerForm] = useState(false)
  const [editingServer, setEditingServer] = useState<InfraServer | undefined>()
  const [serverToDelete, setServerToDelete] = useState<InfraServer | null>(null)

  const filteredServers = servers.filter((server) => {
    const matchesType = typeFilter === 'ALL' || server.type === typeFilter
    const matchesStatus = statusFilter === 'ALL' || server.status === statusFilter
    return matchesType && matchesStatus
  })

  const kpis = buildInfraKpis(filteredServers)
  const health = buildInfraHealthSummary(filteredServers)

  const getUsageBadgeClass = (usage: number) => {
    if (usage >= 90) return 'text-red-600 font-semibold'
    if (usage >= 75) return 'text-orange-600 font-semibold'
    if (usage >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  const handleAddServer = () => {
    setEditingServer(undefined)
    setShowServerForm(true)
  }

  const handleEditServer = (server: InfraServer) => {
    setEditingServer(server)
    setShowServerForm(true)
  }

  const handleSaveServer = (server: InfraServer) => {
    if (editingServer) {
      setServers(servers.map((s) => (s.id === server.id ? server : s)))
    } else {
      setServers([...servers, server])
    }
    setShowServerForm(false)
    setEditingServer(undefined)
  }

  const handleDeleteServer = () => {
    if (serverToDelete) {
      setServers(servers.filter((s) => s.id !== serverToDelete.id))
      toast({
        title: 'Servidor removido',
        description: `O servidor ${serverToDelete.name} foi removido com sucesso.`
      })
      setServerToDelete(null)
    }
  }

  const handleSaveLoadBalancer = (config: unknown) => {
    console.log('Load balancer config:', config)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Infraestrutura</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie servidores, balanceamento de carga e recursos do sistema
          </p>
        </div>
        <Button onClick={handleAddServer}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Servidor
        </Button>
      </div>

      {/* KPIs */}
      <InfraKpisHeader kpis={kpis} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="servers" className="gap-2">
            <Server className="h-4 w-4" />
            Servidores
          </TabsTrigger>
          <TabsTrigger value="balancer" className="gap-2">
            <Scale className="h-4 w-4" />
            Balanceamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="mt-6 space-y-6">
          {/* Health Summary */}
          <InfraHealthSummary health={health} />

          {/* Filtros */}
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500">
                    Tipo de Servidor
                  </label>
                  <Select
                    value={typeFilter}
                    onValueChange={(value) => setTypeFilter(value as InfraServerType | 'ALL')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos os tipos</SelectItem>
                      <SelectItem value="IA">IA</SelectItem>
                      <SelectItem value="RECORDING">Gravacao</SelectItem>
                      <SelectItem value="STREAMING">Streaming</SelectItem>
                      <SelectItem value="CORE">Core</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500">Status</label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as InfraServerStatus | 'ALL')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos os status</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="degraded">Degradado</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="maintenance">Manutencao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Servidores */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredServers.map((server) => {
              const topTenants = getServerTopTenants(server.id)
              return (
                <Card
                  key={server.id}
                  className="border-0 bg-white shadow-sm ring-1 ring-slate-100"
                >
                  <CardContent className="p-6">
                    {/* Header do Servidor */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                          <Server className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{server.name}</h3>
                          <p className="text-xs text-slate-500">{server.host}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {server.ip} - {server.region}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => handleEditServer(server)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                            onClick={() => setServerToDelete(server)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <ServerTypeBadge type={server.type} />
                        <ServerStatusBadge status={server.status} />
                      </div>
                    </div>

                    {/* Metricas de Uso */}
                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-600">CPU</span>
                        </div>
                        <p className={`mt-1 text-xl font-bold ${getUsageBadgeClass(server.cpuUsage)}`}>
                          {server.cpuUsage}%
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                        <div className="flex items-center gap-2">
                          <MemoryStick className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-600">RAM</span>
                        </div>
                        <p className={`mt-1 text-xl font-bold ${getUsageBadgeClass(server.ramUsage)}`}>
                          {server.ramUsage}%
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-600">Disco</span>
                        </div>
                        <p className={`mt-1 text-xl font-bold ${getUsageBadgeClass(server.diskUsage)}`}>
                          {server.diskUsage}%
                        </p>
                      </div>

                      {server.gpuUsage !== undefined && (
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-medium text-slate-600">GPU</span>
                          </div>
                          <p className={`mt-1 text-xl font-bold ${getUsageBadgeClass(server.gpuUsage)}`}>
                            {server.gpuUsage}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Estatisticas */}
                    <div className="mb-4 flex items-center gap-4 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Tenants</p>
                          <p className="text-sm font-semibold text-slate-900">{server.tenantsCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Cameras</p>
                          <p className="text-sm font-semibold text-slate-900">{server.camerasCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Top Tenants */}
                    <div className="border-t border-slate-100 pt-4">
                      <p className="mb-2 text-xs font-medium text-slate-500">Top Tenants por Carga</p>
                      <div className="space-y-2">
                        {topTenants.map((tenant, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-xs text-slate-700">{tenant.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full bg-blue-500"
                                  style={{ width: `${tenant.share}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-xs font-medium text-slate-600">
                                {tenant.share}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ultimo Heartbeat */}
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-400">
                        Ultimo heartbeat:{' '}
                        {new Date(server.lastHeartbeat).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredServers.length === 0 && (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <Server className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum servidor encontrado com os filtros selecionados
                </p>
                <Button className="mt-4" onClick={handleAddServer}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Servidor
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="balancer" className="mt-6">
          <LoadBalancerConfig servers={servers} onSave={handleSaveLoadBalancer} />
        </TabsContent>
      </Tabs>

      {/* Dialog de Formulario do Servidor */}
      <Dialog open={showServerForm} onOpenChange={setShowServerForm}>
        <DialogContent className="max-w-3xl">
          <ServerForm
            server={editingServer}
            onSave={handleSaveServer}
            onCancel={() => setShowServerForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmacao de Exclusao */}
      <AlertDialog open={!!serverToDelete} onOpenChange={() => setServerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Servidor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o servidor{' '}
              <strong>{serverToDelete?.name}</strong>? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteServer}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
