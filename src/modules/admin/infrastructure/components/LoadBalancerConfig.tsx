import { useState } from 'react'
import { Save, Scale, Server, Zap, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import type { InfraServer } from '../mockServers'

type LoadBalancingMode = 'round_robin' | 'least_connections' | 'least_load' | 'priority' | 'weighted'

type LoadBalancerConfigProps = {
  servers: InfraServer[]
  onSave: (config: LoadBalancerSettings) => void
}

interface LoadBalancerSettings {
  mode: LoadBalancingMode
  enabled: boolean
  autoFailover: boolean
  healthCheckInterval: number
  maxCamerasPerServer: number
  gpuThreshold: number
  cpuThreshold: number
  serverWeights: Record<string, number>
}

const MODE_OPTIONS: { value: LoadBalancingMode; label: string; description: string }[] = [
  {
    value: 'round_robin',
    label: 'Round Robin',
    description: 'Distribui requests sequencialmente entre servidores'
  },
  {
    value: 'least_connections',
    label: 'Menos Conexoes',
    description: 'Envia para o servidor com menos conexoes ativas'
  },
  {
    value: 'least_load',
    label: 'Menor Carga',
    description: 'Envia para o servidor com menor uso de CPU/GPU'
  },
  {
    value: 'priority',
    label: 'Prioridade',
    description: 'Usa servidores em ordem de prioridade definida'
  },
  {
    value: 'weighted',
    label: 'Peso Ponderado',
    description: 'Distribui baseado em pesos configurados por servidor'
  }
]

export function LoadBalancerConfig({ servers, onSave }: LoadBalancerConfigProps) {
  const { toast } = useToast()

  const [settings, setSettings] = useState<LoadBalancerSettings>({
    mode: 'least_load',
    enabled: true,
    autoFailover: true,
    healthCheckInterval: 30,
    maxCamerasPerServer: 100,
    gpuThreshold: 85,
    cpuThreshold: 90,
    serverWeights: servers.reduce((acc, s) => ({ ...acc, [s.id]: 1 }), {})
  })

  const iaServers = servers.filter((s) => s.type === 'IA')

  const handleSave = () => {
    onSave(settings)
    toast({
      title: 'Configuracao salva',
      description: 'As configuracoes de balanceamento foram atualizadas.'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Scale className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Balanceamento de Carga
            </h3>
            <p className="text-sm text-slate-500">
              Configure como as cameras sao distribuidas entre servidores de IA
            </p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuracao Principal */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuracao Principal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Balanceamento Ativo</Label>
                <p className="text-xs text-slate-500">
                  Habilita distribuicao automatica de carga
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Failover Automatico</Label>
                <p className="text-xs text-slate-500">
                  Redireciona cameras se servidor falhar
                </p>
              </div>
              <Switch
                checked={settings.autoFailover}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoFailover: checked })
                }
              />
            </div>

            <div>
              <Label className="text-xs">Modo de Balanceamento</Label>
              <Select
                value={settings.mode}
                onValueChange={(value: LoadBalancingMode) =>
                  setSettings({ ...settings, mode: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-xs text-slate-500">{opt.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Intervalo Health Check (seg)</Label>
                <Badge variant="outline">{settings.healthCheckInterval}s</Badge>
              </div>
              <Slider
                value={[settings.healthCheckInterval]}
                onValueChange={(value) =>
                  setSettings({ ...settings, healthCheckInterval: value[0] })
                }
                min={10}
                max={120}
                step={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* Limites */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Limites e Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Max Cameras por Servidor</Label>
                <Badge variant="outline">{settings.maxCamerasPerServer}</Badge>
              </div>
              <Slider
                value={[settings.maxCamerasPerServer]}
                onValueChange={(value) =>
                  setSettings({ ...settings, maxCamerasPerServer: value[0] })
                }
                min={10}
                max={500}
                step={10}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Threshold GPU (%)</Label>
                <Badge variant="outline" className="text-orange-600">
                  {settings.gpuThreshold}%
                </Badge>
              </div>
              <Slider
                value={[settings.gpuThreshold]}
                onValueChange={(value) =>
                  setSettings({ ...settings, gpuThreshold: value[0] })
                }
                min={50}
                max={100}
                step={5}
              />
              <p className="text-xs text-slate-400 mt-1">
                Novas cameras nao serao atribuidas acima deste limite
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Threshold CPU (%)</Label>
                <Badge variant="outline" className="text-red-600">
                  {settings.cpuThreshold}%
                </Badge>
              </div>
              <Slider
                value={[settings.cpuThreshold]}
                onValueChange={(value) =>
                  setSettings({ ...settings, cpuThreshold: value[0] })
                }
                min={50}
                max={100}
                step={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pesos por Servidor (se modo weighted) */}
        {settings.mode === 'weighted' && (
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Pesos por Servidor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {iaServers.map((server) => (
                  <div
                    key={server.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
                  >
                    <Server className="h-5 w-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{server.name}</p>
                      <p className="text-xs text-slate-400">{server.ip}</p>
                    </div>
                    <div className="w-20">
                      <Slider
                        value={[settings.serverWeights[server.id] || 1]}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            serverWeights: {
                              ...settings.serverWeights,
                              [server.id]: value[0]
                            }
                          })
                        }
                        min={0}
                        max={10}
                        step={1}
                      />
                      <p className="text-center text-xs text-slate-500 mt-1">
                        Peso: {settings.serverWeights[server.id] || 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Atual */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Status Atual dos Servidores IA
              </span>
              <Badge variant={settings.enabled ? 'default' : 'secondary'}>
                {settings.enabled ? 'Balanceamento Ativo' : 'Desativado'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {iaServers.map((server) => {
                const gpuOverload = (server.gpuUsage || 0) > settings.gpuThreshold
                const cpuOverload = server.cpuUsage > settings.cpuThreshold
                return (
                  <div
                    key={server.id}
                    className={`rounded-lg border p-3 ${
                      server.status === 'offline'
                        ? 'border-red-200 bg-red-50'
                        : gpuOverload || cpuOverload
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-700">{server.name}</p>
                      <Badge
                        variant={server.status === 'online' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {server.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-slate-500">CPU</p>
                        <p
                          className={`text-sm font-bold ${
                            cpuOverload ? 'text-red-600' : 'text-slate-700'
                          }`}
                        >
                          {server.cpuUsage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">GPU</p>
                        <p
                          className={`text-sm font-bold ${
                            gpuOverload ? 'text-orange-600' : 'text-slate-700'
                          }`}
                        >
                          {server.gpuUsage || 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Cams</p>
                        <p className="text-sm font-bold text-slate-700">
                          {server.camerasCount}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
