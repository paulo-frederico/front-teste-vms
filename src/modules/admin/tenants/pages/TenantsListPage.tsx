import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ban, CheckCircle, Edit, Eye, Loader2, Plus, Search, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTenants, useDeleteTenant, useChangeStatus } from '@/hooks/useTenants'
import { TenantPlan, TenantStatus } from '@/modules/shared/types/tenant'

interface FiltersState {
  search: string
  status: TenantStatus | ''
  plan: TenantPlan | ''
  page: number
  limit: number
}

const statusStyles: Record<TenantStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  SUSPENDED: 'bg-red-100 text-red-800',
  TRIAL: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
}

const statusLabels: Record<TenantStatus, string> = {
  ACTIVE: 'Ativo',
  SUSPENDED: 'Suspenso',
  TRIAL: 'Trial',
  CANCELLED: 'Cancelado',
}

const planLabels: Record<TenantPlan, string> = {
  BASIC: 'Básico',
  PROFESSIONAL: 'Profissional',
  ENTERPRISE: 'Enterprise',
}

export const TenantsListPage = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    status: '',
    plan: '',
    page: 1,
    limit: 10,
  })

  const queryFilters = {
    search: filters.search || undefined,
    status: filters.status || undefined,
    plan: filters.plan || undefined,
    page: filters.page,
    limit: filters.limit,
  }

  const { data, isLoading, isFetching, error } = useTenants(queryFilters)
  const deleteMutation = useDeleteTenant()
  const changeStatusMutation = useChangeStatus()

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Tem certeza que deseja remover o cliente "${name}"?`)
    if (!confirmed) return
    await deleteMutation.mutateAsync(id)
  }

  const handleChangeStatus = async (id: string, status: TenantStatus) => {
    await changeStatusMutation.mutateAsync({ id, status })
  }

  const tenants = data?.tenants ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(data?.totalPages ?? 1, 1)
  const showingFrom = total ? (filters.page - 1) * filters.limit + 1 : 0
  const showingTo = total ? Math.min(filters.page * filters.limit, total) : 0

  useEffect(() => {
    setFilters((prev) => {
      if (prev.page > totalPages) {
        return { ...prev, page: totalPages }
      }
      return prev
    })
  }, [totalPages])

  const handlePageChange = (direction: 'prev' | 'next') => {
    setFilters((prev) => {
      const nextPage = direction === 'next' ? prev.page + 1 : prev.page - 1
      const clampedPage = Math.min(Math.max(1, nextPage), totalPages)
      return { ...prev, page: clampedPage }
    })
  }

  const handleExportCsv = () => {
    if (!tenants.length) {
      window.alert('Não há clientes para exportar.')
      return
    }

    const headers = ['Nome', 'CNPJ', 'Plano', 'Status', 'Câmeras Ativas', 'Limite de Câmeras']
    const rows = tenants.map((tenant) => [
      tenant.name,
      tenant.fiscalData.cnpj,
      planLabels[tenant.plan],
      statusLabels[tenant.status],
      String(tenant.stats?.activeCameras ?? 0),
      String(tenant.limits.maxCameras),
    ])

    const csvContent = [headers, ...rows].map((line) => line.join(';')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `tenants-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const renderStatusBadge = (status: TenantStatus) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-red-600 text-xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Erro ao carregar clientes
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {error instanceof Error ? error.message : 'Erro desconhecido ao carregar a lista de clientes.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Recarregar Página
                </button>
                <button
                  onClick={() => navigate('/admin-master/dashboard')}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
                >
                  Voltar ao Dashboard
                </button>
              </div>
            </div>
          </div>

          {import.meta.env.DEV && (
            <details className="mt-4">
              <summary className="text-sm text-red-600 cursor-pointer hover:underline">
                Detalhes técnicos (DEV)
              </summary>
              <pre className="mt-2 p-3 bg-red-100 rounded text-xs overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clientes (Tenants)</h1>
          <p className="text-sm text-gray-500">Gestão completa dos clientes e seus recursos.</p>
        </div>
        <Button onClick={() => navigate('/admin-master/tenants/new')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome ou CNPJ..."
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))
              }
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value as TenantStatus | '', page: 1 }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value={TenantStatus.ACTIVE}>Ativo</SelectItem>
              <SelectItem value={TenantStatus.SUSPENDED}>Suspenso</SelectItem>
              <SelectItem value={TenantStatus.TRIAL}>Trial</SelectItem>
              <SelectItem value={TenantStatus.CANCELLED}>Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.plan}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, plan: value as TenantPlan | '', page: 1 }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os planos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os planos</SelectItem>
              <SelectItem value={TenantPlan.BASIC}>Básico</SelectItem>
              <SelectItem value={TenantPlan.PROFESSIONAL}>Profissional</SelectItem>
              <SelectItem value={TenantPlan.ENTERPRISE}>Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExportCsv}>
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3 text-sm text-gray-500">
          <span>{isFetching ? 'Atualizando dados...' : `${total} clientes encontrados`}</span>
          <span>Mostrando {filters.limit} por página</span>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Plano
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Câmeras
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Storage
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tenants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                  Nenhum cliente encontrado com os filtros atuais.
                </td>
              </tr>
            )}
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{tenant.name}</div>
                  <div className="text-sm text-gray-500">{tenant.fiscalData.cnpj}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {planLabels[tenant.plan]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(tenant.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tenant.stats?.activeCameras ?? 0} / {tenant.limits.maxCameras}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tenant.stats?.storageUsedGB ?? 0}GB / {tenant.limits.storageGB}GB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin-master/tenants/${tenant.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin-master/tenants/${tenant.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {tenant.status === TenantStatus.ACTIVE ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChangeStatus(tenant.id, TenantStatus.SUSPENDED)}
                        disabled={changeStatusMutation.isPending}
                      >
                        <Ban className="w-4 h-4 text-orange-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChangeStatus(tenant.id, TenantStatus.ACTIVE)}
                        disabled={changeStatusMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tenant.id, tenant.name)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <span>
          Mostrando {showingFrom} a {showingTo} de {total} clientes
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={filters.page === 1} onClick={() => handlePageChange('prev')}>
            Anterior
          </Button>
          <span>
            Página {filters.page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= totalPages}
            onClick={() => handlePageChange('next')}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
