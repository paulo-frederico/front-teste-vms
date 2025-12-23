import { useEffect, useMemo, useState } from 'react'
import { History, Loader2, PlayCircle, Plus, Search, Video } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CameraForm } from '@/modules/admin/cameras/CameraForm'
import { CameraDetailsDrawer } from '@/modules/admin/cameras/CameraDetailsDrawer'
import { createCameraMock, listCamerasMock } from '@/modules/admin/cameras/cameraMocks'
import type { Camera, CameraStatus } from '@/modules/admin/cameras/cameraTypes'
import { listSitesMock } from '@/modules/admin/sites/siteMocks'
import { listTenantsMock } from '@/modules/admin/tenants/tenantMocks'
import { useAuth } from '@/contexts'
import { SystemRole } from '@/modules/shared/types/auth'

const statusConfig: Record<CameraStatus, { label: string; badge: string }> = {
  ONLINE: { label: 'Online', badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  OFFLINE: { label: 'Offline', badge: 'bg-slate-200 text-slate-600 border border-slate-300' },
  ERROR: { label: 'Erro', badge: 'bg-red-100 text-red-700 border border-red-200' },
  MAINTENANCE: { label: 'Manutenção', badge: 'bg-amber-100 text-amber-700 border border-amber-200' },
}

type TenantOption = { id: string; name: string }
type SiteOption = { id: string; name: string; tenantId: string }

type CameraFilterStatus = 'ALL' | CameraStatus

type CameraFilterTenant = 'ALL' | string

type CameraFilterSite = 'ALL' | string

export function CameraList() {
  const { user } = useAuth()
  const [cameras, setCameras] = useState<Camera[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CameraFilterStatus>('ALL')
  const [tenantFilter, setTenantFilter] = useState<CameraFilterTenant>('ALL')
  const [siteFilter, setSiteFilter] = useState<CameraFilterSite>('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [tenantOptions, setTenantOptions] = useState<TenantOption[]>([])
  const [siteOptions, setSiteOptions] = useState<SiteOption[]>([])

  const isCentralAdmin = user?.role === SystemRole.ADMIN_MASTER || user?.role === SystemRole.ADMIN
  const currentTenantId = user?.tenantId

  useEffect(() => {
    listTenantsMock().then((tenants) => {
      const mapped = tenants.map((tenant) => ({ id: tenant.id, name: tenant.name }))
      setTenantOptions(mapped)
      if (!isCentralAdmin && currentTenantId) {
        setTenantFilter(currentTenantId)
      }
    })
  }, [isCentralAdmin, currentTenantId])

  useEffect(() => {
    const tenantId = !isCentralAdmin ? currentTenantId : undefined
    listSitesMock(tenantId ? { tenantId } : undefined).then((sites) => {
      const mapped = sites.map((site) => ({ id: site.id, name: site.name, tenantId: site.tenantId }))
      setSiteOptions(mapped)
    })
  }, [isCentralAdmin, currentTenantId])

  const loadCameras = async () => {
    setIsLoading(true)
    const params: {
      tenantId?: string
      siteId?: string
      status?: CameraStatus
    } = {}

    if (!isCentralAdmin && currentTenantId) {
      params.tenantId = currentTenantId
    } else if (isCentralAdmin && tenantFilter !== 'ALL') {
      params.tenantId = tenantFilter
    }

    if (siteFilter !== 'ALL') {
      params.siteId = siteFilter
    }

    if (statusFilter !== 'ALL') {
      params.status = statusFilter
    }

    const data = await listCamerasMock(params)
    setCameras(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadCameras()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCentralAdmin, tenantFilter, siteFilter, statusFilter, currentTenantId])

  const visibleSites = useMemo(() => {
    if (!isCentralAdmin) {
      return siteOptions.filter((site) => site.tenantId === currentTenantId)
    }

    if (tenantFilter === 'ALL') {
      return siteOptions
    }

    return siteOptions.filter((site) => site.tenantId === tenantFilter)
  }, [isCentralAdmin, siteOptions, tenantFilter, currentTenantId])

  const filteredCameras = useMemo(() => {
    if (!searchTerm.trim()) return cameras
    return cameras.filter((camera) => {
      const term = searchTerm.toLowerCase()
      return (
        camera.name.toLowerCase().includes(term) ||
        camera.siteName.toLowerCase().includes(term) ||
        camera.tenantName.toLowerCase().includes(term)
      )
    })
  }, [cameras, searchTerm])

  const handleOpenDrawer = (cameraId: string) => {
    setSelectedCameraId(cameraId)
    setIsDrawerOpen(true)
  }

  const availableTenantOptions = isCentralAdmin
    ? tenantOptions
    : tenantOptions.filter((tenant) => tenant.id === currentTenantId)

  const availableSiteOptions = !isCentralAdmin && currentTenantId ? visibleSites : siteOptions

  const handleCreateCamera = async (data: Omit<Camera, 'id' | 'createdAt' | 'lastSeenAt'>) => {
    await createCameraMock(data)
    await loadCameras()
    setIsCreateModalOpen(false)
  }

  const formatLastSeen = (value?: string) => {
    if (!value) return '—'
    return new Date(value).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!user) {
    return (
      <Card className="border-0 bg-white/70 shadow-sm">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Carregando contexto de usuário...
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Inventário de câmeras</h2>
          <p className="text-sm text-muted-foreground">Controle centralizado de conectividade, IA e gravação.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 self-start">
            <Plus className="h-4 w-4" /> Nova câmera
          </Button>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Cadastrar nova câmera</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Informe tenant, site e perfis de stream antes de ativar a operação.
              </p>
            </DialogHeader>
            <CameraForm
              mode="create"
              availableTenants={availableTenantOptions}
              availableSites={availableSiteOptions}
              currentUserRole={user.role}
              currentUserTenantId={currentTenantId}
              onSubmit={handleCreateCamera}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por câmera, site ou tenant"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        {isCentralAdmin ? (
          <Select
            value={tenantFilter}
            onValueChange={(value) => {
              setTenantFilter(value as CameraFilterTenant)
              setSiteFilter('ALL')
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tenant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os tenants</SelectItem>
              {tenantOptions.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        <Select value={siteFilter} onValueChange={(value) => setSiteFilter(value as CameraFilterSite)}>
          <SelectTrigger>
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os sites</SelectItem>
            {visibleSites.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CameraFilterStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Status de operação</SelectItem>
            {Object.entries(statusConfig).map(([status, config]) => (
              <SelectItem key={status} value={status}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 bg-white shadow-sm ring-1 ring-muted/30">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Consultando câmeras...
            </div>
          ) : filteredCameras.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nenhuma câmera encontrada com os filtros atuais.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Câmera</th>
                    <th className="px-4 py-3">Site</th>
                    {isCentralAdmin ? <th className="px-4 py-3">Tenant</th> : null}
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">IA</th>
                    <th className="px-4 py-3">Gravação</th>
                    <th className="px-4 py-3">Último contato</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCameras.map((camera) => (
                    <tr key={camera.id} className="border-b last:border-0">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-foreground">{camera.name}</p>
                        <p className="text-xs text-muted-foreground">ID {camera.id}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{camera.siteName}</td>
                      {isCentralAdmin ? (
                        <td className="px-4 py-4 text-sm text-muted-foreground">{camera.tenantName}</td>
                      ) : null}
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusConfig[camera.status].badge}`}>
                          {statusConfig[camera.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${camera.iaSettings.enabled ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {camera.iaSettings.enabled ? 'Ligada' : 'Desligada'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${camera.recordingSettings.enabled ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {camera.recordingSettings.enabled ? 'Gravando' : 'Inativa'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{formatLastSeen(camera.lastSeenAt)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-muted-foreground"
                            onClick={() => console.log('Abrir Live', camera.id)}
                          >
                            <PlayCircle className="h-4 w-4" /> Live
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-muted-foreground"
                            onClick={() => console.log('Abrir Playback', camera.id)}
                          >
                            <History className="h-4 w-4" /> Playback
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleOpenDrawer(camera.id)}>
                            <Video className="h-4 w-4" /> Ver / Editar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CameraDetailsDrawer
        cameraId={selectedCameraId}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        availableTenants={availableTenantOptions}
        availableSites={availableSiteOptions}
        currentUserRole={user.role}
        currentUserTenantId={currentTenantId}
        onCameraUpdated={loadCameras}
      />
    </section>
  )
}
