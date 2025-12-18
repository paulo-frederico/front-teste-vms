import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Eye, Edit, Trash2, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useAreas, useDeleteArea } from '@/hooks/useAreas'
import { AreaType, AreaStatus, getAreaTypeLabel, getAreaStatusLabel } from '@/modules/shared/types/area'

export function AreasListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    search: '',
    type: 'ALL' as AreaType | 'ALL',
    status: 'ALL' as AreaStatus | 'ALL',
  })

  const { data, isLoading, isError } = useAreas({
    search: filters.search || undefined,
    type: filters.type === 'ALL' ? undefined : filters.type,
    status: filters.status === 'ALL' ? undefined : filters.status,
  })

  const deleteMutation = useDeleteArea()

  const areas = data || []

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover a área "${name}"?\n\nEsta ação não pode ser desfeita.`)) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const getStatusBadgeClass = (status: AreaStatus) => {
    const classes = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-300',
      INACTIVE: 'bg-gray-100 text-gray-800 border-gray-300',
      UNDER_CONSTRUCTION: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      RESTRICTED: 'bg-red-100 text-red-800 border-red-300',
    }
    return classes[status]
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Áreas</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie todas as áreas do sistema</p>
        </div>
        <Button onClick={() => navigate('/admin/areas/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova área
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar por nome, site ou tenant..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value as AreaType | 'ALL' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                {Object.values(AreaType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {getAreaTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value as AreaStatus | 'ALL' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os status</SelectItem>
                {Object.values(AreaStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {getAreaStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Total de Áreas</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{areas.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Ativas</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {areas.filter((a) => a.status === AreaStatus.ACTIVE).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Câmeras Total</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {areas.reduce((acc, a) => acc + a.totalCameras, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Câmeras Online</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {areas.reduce((acc, a) => acc + a.onlineCameras, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="py-16 text-center">
            <p className="text-sm text-slate-500">Carregando áreas...</p>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="py-16 text-center">
            <p className="text-sm text-red-500">Erro ao carregar áreas</p>
          </CardContent>
        </Card>
      ) : areas.length === 0 ? (
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="py-16 text-center">
            <MapPin className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">Nenhuma área encontrada</p>
            <Button onClick={() => navigate('/admin/areas/new')} className="mt-4 gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Criar primeira área
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-5 py-3 text-left">Área</th>
                    <th className="px-5 py-3 text-left">Tipo</th>
                    <th className="px-5 py-3 text-left">Site</th>
                    <th className="px-5 py-3 text-left">Tenant</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-center">Câmeras</th>
                    <th className="px-5 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map((area) => (
                    <tr
                      key={area.id}
                      className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                      onClick={() => navigate(`/admin/areas/${area.id}`)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{area.name}</span>
                          {area.description && (
                            <span className="text-xs text-slate-500">{area.description}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-700">{getAreaTypeLabel(area.type)}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{area.siteName}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{area.tenantName}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(area.status)}`}
                        >
                          {getAreaStatusLabel(area.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-slate-900">{area.totalCameras}</span>
                          <span className="text-xs text-green-600">{area.onlineCameras} online</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/admin/areas/${area.id}`)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/admin/areas/${area.id}/edit`)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(area.id, area.name)
                            }}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
