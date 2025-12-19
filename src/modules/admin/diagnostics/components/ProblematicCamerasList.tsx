import { useState, useMemo } from 'react'
import { AlertCircle, Clock, Activity, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { ProblematicCamera } from '../mockDiagnostics'
import { MOCK_PROBLEMATIC_CAMERAS } from '../mockDiagnostics'

type ProblematicCamerasListProps = {
  cameras?: ProblematicCamera[]
}

export function ProblematicCamerasList({
  cameras = MOCK_PROBLEMATIC_CAMERAS
}: ProblematicCamerasListProps) {
  const [statusFilter, setStatusFilter] = useState<ProblematicCamera['status'] | 'ALL'>('ALL')
  const [tenantFilter, setTenantFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')

  const tenants = useMemo(() => {
    return Array.from(new Set(cameras.map((cam) => cam.tenant))).sort()
  }, [cameras])

  const filteredCameras = useMemo(() => {
    return cameras.filter((camera) => {
      const matchesStatus = statusFilter === 'ALL' || camera.status === statusFilter
      const matchesTenant = tenantFilter === 'ALL' || camera.tenant === tenantFilter
      const matchesSearch =
        searchText === '' ||
        camera.name.toLowerCase().includes(searchText.toLowerCase()) ||
        camera.site.toLowerCase().includes(searchText.toLowerCase())

      return matchesStatus && matchesTenant && matchesSearch
    })
  }, [cameras, statusFilter, tenantFilter, searchText])

  const getStatusIcon = (status: ProblematicCamera['status']) => {
    switch (status) {
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'degraded':
        return <Activity className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: ProblematicCamera['status']) => {
    switch (status) {
      case 'offline':
        return 'bg-red-100 text-red-800'
      case 'error':
        return 'bg-orange-100 text-orange-800'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: ProblematicCamera['status']) => {
    switch (status) {
      case 'offline':
        return 'Offline'
      case 'error':
        return 'Erro'
      case 'degraded':
        return 'Degradado'
      default:
        return status
    }
  }

  const stats = useMemo(() => {
    return {
      total: filteredCameras.length,
      offline: filteredCameras.filter((c) => c.status === 'offline').length,
      error: filteredCameras.filter((c) => c.status === 'error').length,
      degraded: filteredCameras.filter((c) => c.status === 'degraded').length
    }
  }, [filteredCameras])

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Total</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-red-50 shadow-sm ring-1 ring-red-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-red-700">Offline</p>
            <p className="mt-2 text-2xl font-bold text-red-900">{stats.offline}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-orange-50 shadow-sm ring-1 ring-orange-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-orange-700">Erros</p>
            <p className="mt-2 text-2xl font-bold text-orange-900">{stats.error}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-yellow-50 shadow-sm ring-1 ring-yellow-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-yellow-700">Degradado</p>
            <p className="mt-2 text-2xl font-bold text-yellow-900">{stats.degraded}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">Status</label>
              <Select
                value={statusFilter}
                onValueChange={(value: any) => setStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os status</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                  <SelectItem value="degraded">Degradado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">Cliente</label>
              <Select value={tenantFilter} onValueChange={setTenantFilter}>
                <SelectTrigger>
                  <SelectValue />
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

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">Buscar</label>
              <Input
                placeholder="Buscar camera ou local..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cameras */}
      <div className="space-y-3">
        {filteredCameras.length > 0 ? (
          filteredCameras.map((camera) => (
            <Card
              key={camera.id}
              className="border-0 bg-white shadow-sm ring-1 ring-slate-100 hover:ring-slate-200 transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Info Principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(camera.status)}
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{camera.name}</h3>
                        <p className="text-xs text-slate-600">{camera.site}</p>
                      </div>
                    </div>

                    {/* Metricas */}
                    <div className="mt-3 flex flex-wrap gap-3">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
                        <span>
                          <span className="font-medium">{camera.errorCount}</span> erros
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Zap className="h-3.5 w-3.5 text-blue-500" />
                        <span>
                          <span className="font-medium">{camera.avgLatency}ms</span> latencia
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          Ultimo acesso:{' '}
                          {new Date(camera.lastOnline).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge className={`text-xs font-medium h-fit ${getStatusBadge(camera.status)}`}>
                    {getStatusLabel(camera.status)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardContent className="py-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm text-slate-500">
                Nenhuma camera problematica encontrada com os filtros selecionados
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
