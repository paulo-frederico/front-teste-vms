import { useState } from 'react'
import { Settings, Server, Sliders, Save, RefreshCw } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import type { GlobalAiConfig, AiModuleType } from '../types/aiConfigTypes'
import { AI_MODULE_LABELS, AI_MODULE_COLORS } from '../types/aiConfigTypes'

type GlobalAiConfigPanelProps = {
  config: GlobalAiConfig
  onSave: (config: GlobalAiConfig) => void
}

const ALL_MODULES: AiModuleType[] = [
  'intrusion',
  'line_cross',
  'lpr',
  'people_count',
  'vehicle_count',
  'loitering',
  'epi'
]

const MOCK_SERVERS = [
  { id: 'srv-ia-core-01', name: 'Cluster IA 01' },
  { id: 'srv-ia-gpu-02', name: 'Cluster IA 02' },
  { id: 'srv-ia-gpu-03', name: 'Cluster IA 03' }
]

export function GlobalAiConfigPanel({ config, onSave }: GlobalAiConfigPanelProps) {
  const { toast } = useToast()
  const [localConfig, setLocalConfig] = useState<GlobalAiConfig>(config)

  const handleModuleToggle = (moduleType: AiModuleType) => {
    const isEnabled = localConfig.modulesEnabled.includes(moduleType)
    const newModules = isEnabled
      ? localConfig.modulesEnabled.filter((m) => m !== moduleType)
      : [...localConfig.modulesEnabled, moduleType]
    setLocalConfig({ ...localConfig, modulesEnabled: newModules })
  }

  const handleSave = () => {
    onSave(localConfig)
    toast({
      title: 'Configuracoes salvas',
      description: 'As configuracoes globais de IA foram atualizadas com sucesso.'
    })
  }

  const handleReset = () => {
    setLocalConfig(config)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Configuracoes Globais de IA
          </h3>
          <p className="text-sm text-slate-500">
            {config.tenantName || 'Configuracao padrao da plataforma'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Resetar
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Modulos Habilitados */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Modulos de IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ALL_MODULES.map((moduleType) => {
              const isEnabled = localConfig.modulesEnabled.includes(moduleType)
              const color = AI_MODULE_COLORS[moduleType]
              return (
                <div
                  key={moduleType}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
                    isEnabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: isEnabled ? color : '#cbd5e1' }}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isEnabled ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {AI_MODULE_LABELS[moduleType]}
                    </span>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => handleModuleToggle(moduleType)}
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Configuracoes de Servidor */}
        <div className="space-y-6">
          {/* Sensibilidade Padrao */}
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sliders className="h-4 w-4" />
                Sensibilidade Padrao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Nivel de sensibilidade</span>
                  <Badge variant="outline" className="font-mono">
                    {localConfig.defaultSensitivity}%
                  </Badge>
                </div>
                <Slider
                  value={[localConfig.defaultSensitivity]}
                  onValueChange={(value) =>
                    setLocalConfig({ ...localConfig, defaultSensitivity: value[0] })
                  }
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Menos falsos positivos</span>
                  <span>Mais deteccoes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Servidor de IA */}
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="h-4 w-4" />
                Servidor de Processamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Modo de Atribuicao</Label>
                <Select
                  value={localConfig.serverAssignment}
                  onValueChange={(value: 'auto' | 'manual') =>
                    setLocalConfig({ ...localConfig, serverAssignment: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatico (Recomendado)</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localConfig.serverAssignment === 'manual' && (
                <div>
                  <Label className="text-xs">Servidor</Label>
                  <Select
                    value={localConfig.assignedServerId || ''}
                    onValueChange={(value) =>
                      setLocalConfig({
                        ...localConfig,
                        assignedServerId: value,
                        assignedServerName: MOCK_SERVERS.find((s) => s.id === value)?.name
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione um servidor" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_SERVERS.map((server) => (
                        <SelectItem key={server.id} value={server.id}>
                          {server.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="text-xs">Balanceamento de Carga</Label>
                <Select
                  value={localConfig.loadBalancing}
                  onValueChange={(value: 'round_robin' | 'least_load' | 'priority') =>
                    setLocalConfig({ ...localConfig, loadBalancing: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round_robin">Round Robin</SelectItem>
                    <SelectItem value="least_load">Menor Carga</SelectItem>
                    <SelectItem value="priority">Prioridade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Max. Cameras por Modulo</Label>
                <Input
                  type="number"
                  value={localConfig.maxCamerasPerModule}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      maxCamerasPerModule: parseInt(e.target.value) || 50
                    })
                  }
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
