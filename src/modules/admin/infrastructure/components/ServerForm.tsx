import { useState } from 'react'
import { Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import type { InfraServer, InfraServerType, InfraServerStatus } from '../mockServers'

type ServerFormProps = {
  server?: InfraServer
  onSave: (server: InfraServer) => void
  onCancel: () => void
}

const SERVER_TYPE_OPTIONS: { value: InfraServerType; label: string }[] = [
  { value: 'IA', label: 'Servidor de IA' },
  { value: 'RECORDING', label: 'Servidor de Gravacao' },
  { value: 'STREAMING', label: 'Servidor de Streaming' },
  { value: 'CORE', label: 'Servidor Core' }
]

const SERVER_STATUS_OPTIONS: { value: InfraServerStatus; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'degraded', label: 'Degradado' },
  { value: 'offline', label: 'Offline' },
  { value: 'maintenance', label: 'Manutencao' }
]

const REGION_OPTIONS = [
  'SC - Data Center 01',
  'SC - Data Center 02',
  'SP - Data Center 03',
  'SP - Zona Cloud 02',
  'RJ - Data Center 01',
  'SC - CDN Norte',
  'SC - Rede Privada'
]

export function ServerForm({ server, onSave, onCancel }: ServerFormProps) {
  const { toast } = useToast()
  const isEditing = !!server

  const [formData, setFormData] = useState<Partial<InfraServer>>(
    server || {
      name: '',
      type: 'IA',
      status: 'offline',
      host: '',
      ip: '',
      cpuUsage: 0,
      ramUsage: 0,
      diskUsage: 0,
      gpuUsage: undefined,
      tenantsCount: 0,
      camerasCount: 0,
      region: 'SC - Data Center 01',
      lastHeartbeat: new Date().toISOString()
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.host || !formData.ip) {
      toast({
        title: 'Erro de validacao',
        description: 'Preencha todos os campos obrigatorios.',
        variant: 'destructive'
      })
      return
    }

    const newServer: InfraServer = {
      id: server?.id || `srv-${Date.now()}`,
      name: formData.name!,
      type: formData.type as InfraServerType,
      status: formData.status as InfraServerStatus,
      host: formData.host!,
      ip: formData.ip!,
      cpuUsage: formData.cpuUsage || 0,
      ramUsage: formData.ramUsage || 0,
      diskUsage: formData.diskUsage || 0,
      gpuUsage: formData.type === 'IA' ? (formData.gpuUsage || 0) : undefined,
      tenantsCount: formData.tenantsCount || 0,
      camerasCount: formData.camerasCount || 0,
      region: formData.region,
      lastHeartbeat: new Date().toISOString()
    }

    onSave(newServer)
    toast({
      title: isEditing ? 'Servidor atualizado' : 'Servidor criado',
      description: `O servidor ${newServer.name} foi ${isEditing ? 'atualizado' : 'criado'} com sucesso.`
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {isEditing ? 'Editar Servidor' : 'Novo Servidor'}
        </h3>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informacoes Basicas */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informacoes Basicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Nome do Servidor *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Cluster IA 04"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-xs">Tipo de Servidor *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: InfraServerType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVER_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Status Inicial</Label>
              <Select
                value={formData.status}
                onValueChange={(value: InfraServerStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVER_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Regiao / Data Center</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGION_OPTIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configuracao de Rede */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuracao de Rede</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Hostname *</Label>
              <Input
                value={formData.host || ''}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                placeholder="Ex: srv-ia-04.unifique.local"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-xs">Endereco IP *</Label>
              <Input
                value={formData.ip || ''}
                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                placeholder="Ex: 10.0.10.8"
                className="mt-1"
                pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                required
              />
            </div>

            {isEditing && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Tenants Conectados</Label>
                    <Input
                      type="number"
                      value={formData.tenantsCount || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, tenantsCount: parseInt(e.target.value) || 0 })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Cameras Processando</Label>
                    <Input
                      type="number"
                      value={formData.camerasCount || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, camerasCount: parseInt(e.target.value) || 0 })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Metricas (apenas para edicao) */}
        {isEditing && (
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100 md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Metricas de Uso (Simulado)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs">CPU (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.cpuUsage || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, cpuUsage: parseInt(e.target.value) || 0 })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">RAM (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.ramUsage || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, ramUsage: parseInt(e.target.value) || 0 })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Disco (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.diskUsage || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, diskUsage: parseInt(e.target.value) || 0 })
                    }
                    className="mt-1"
                  />
                </div>
                {formData.type === 'IA' && (
                  <div>
                    <Label className="text-xs">GPU (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.gpuUsage || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, gpuUsage: parseInt(e.target.value) || 0 })
                      }
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </form>
  )
}
