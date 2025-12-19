import { useState } from 'react'
import { Camera, Settings, ChevronRight, Building2, MapPin, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { CameraAiConfig } from '../types/aiConfigTypes'
import { AI_MODULE_LABELS, AI_MODULE_COLORS } from '../types/aiConfigTypes'

type CameraAiConfigTableProps = {
  configs: CameraAiConfig[]
}

export function CameraAiConfigTable({ configs }: CameraAiConfigTableProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [tenantFilter, setTenantFilter] = useState<string>('ALL')

  // Obter lista unica de tenants
  const tenants = Array.from(new Set(configs.map((c) => c.tenantName)))

  const filteredConfigs = configs.filter((config) => {
    const matchesSearch =
      config.cameraName.toLowerCase().includes(search.toLowerCase()) ||
      config.siteName.toLowerCase().includes(search.toLowerCase())
    const matchesTenant = tenantFilter === 'ALL' || config.tenantName === tenantFilter
    return matchesSearch && matchesTenant
  })

  const getActiveModulesCount = (config: CameraAiConfig) => {
    return config.modules.filter((m) => m.enabled).length
  }

  const getTotalZonesCount = (config: CameraAiConfig) => {
    return config.modules.reduce((total, m) => total + m.zones.length, 0)
  }

  const getSensitivityColor = (value: number) => {
    if (value < 50) return 'text-green-600 bg-green-50'
    if (value < 75) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">
                Buscar Camera ou Site
              </label>
              <Input
                placeholder="Digite para buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">Cliente</label>
              <Select value={tenantFilter} onValueChange={setTenantFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os clientes</SelectItem>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant} value={tenant}>
                      {tenant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cameras */}
      <div className="space-y-3">
        {filteredConfigs.map((config) => (
          <Card
            key={config.cameraId}
            className="border-0 bg-white shadow-sm ring-1 ring-slate-100 hover:ring-slate-200 transition-all cursor-pointer"
            onClick={() => navigate(`/admin/ai-config/camera/${config.cameraId}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Icone Camera */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 flex-shrink-0">
                  <Camera className="h-6 w-6 text-slate-600" />
                </div>

                {/* Info Principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {config.cameraName}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getSensitivityColor(config.globalSensitivity)}`}
                    >
                      <Activity className="mr-1 h-3 w-3" />
                      {config.globalSensitivity}%
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {config.tenantName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {config.siteName}
                    </span>
                  </div>
                </div>

                {/* Modulos Ativos */}
                <div className="hidden md:flex items-center gap-1 flex-wrap max-w-xs">
                  {config.modules
                    .filter((m) => m.enabled)
                    .slice(0, 4)
                    .map((module) => (
                      <Badge
                        key={module.id}
                        variant="outline"
                        className="text-[10px] px-1.5"
                        style={{
                          borderColor: `${AI_MODULE_COLORS[module.type]}40`,
                          backgroundColor: `${AI_MODULE_COLORS[module.type]}10`,
                          color: AI_MODULE_COLORS[module.type]
                        }}
                      >
                        {AI_MODULE_LABELS[module.type].split(' ')[0]}
                      </Badge>
                    ))}
                  {config.modules.filter((m) => m.enabled).length > 4 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      +{config.modules.filter((m) => m.enabled).length - 4}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {getActiveModulesCount(config)}
                    </p>
                    <p className="text-[10px] text-slate-500">Modulos</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {getTotalZonesCount(config)}
                    </p>
                    <p className="text-[10px] text-slate-500">Zonas</p>
                  </div>
                </div>

                {/* Acao */}
                <Button size="sm" variant="ghost" className="flex-shrink-0">
                  <Settings className="mr-1 h-4 w-4" />
                  Configurar
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConfigs.length === 0 && (
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="py-16 text-center">
            <Camera className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">
              Nenhuma camera encontrada com os filtros selecionados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
