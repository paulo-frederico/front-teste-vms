import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { LocationDetailsDrawer } from '@/modules/admin/locations/components/LocationDetailsDrawer'
import { LocationFiltersBar } from '@/modules/admin/locations/components/LocationFiltersBar'
import { LocationKpisHeader } from '@/modules/admin/locations/components/LocationKpisHeader'
import { LocationListTable } from '@/modules/admin/locations/components/LocationListTable'
import { CameraDetailsDrawer } from '@/modules/admin/locations/components/CameraDetailsDrawer'
import type { AdminCamera, AdminCameraStatus } from '@/modules/admin/locations/mockCameras'
import type { AdminLocation } from '@/modules/admin/locations/mockLocations'
import { buildLocationKpiStats } from '@/modules/admin/locations/mockLocations'
type LocationsFixturesModule = typeof import('@/fixtures')

let loadLocationsFixtures: () => Promise<LocationsFixturesModule>

if (import.meta.env.DEV) {
  let locationsFixturesPromise: Promise<LocationsFixturesModule> | null = null
  loadLocationsFixtures = async () => {
    if (!locationsFixturesPromise) {
      locationsFixturesPromise = import('@/fixtures')
    }
    return locationsFixturesPromise
  }
} else {
  loadLocationsFixtures = async () => {
    throw new Error('Fixtures não estão disponíveis em produção')
  }
}

export function AdminLocationsPage() {
  const [search, setSearch] = useState('')
  const [tenantFilter, setTenantFilter] = useState<string | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<AdminCameraStatus | 'all'>('all')
  const [cameraModelFilter, setCameraModelFilter] = useState<string | 'all'>('all')
  const [cameraVolume, setCameraVolume] = useState<'all' | 'gt25' | 'gt50' | 'gt100'>('all')
  const [selectedLocation, setSelectedLocation] = useState<AdminLocation | null>(null)
  const [isLocationDrawerOpen, setIsLocationDrawerOpen] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState<AdminCamera | null>(null)
  const [isCameraDrawerOpen, setIsCameraDrawerOpen] = useState(false)

  const [locations, setLocations] = useState<AdminLocation[]>([])
  const [cameras, setCameras] = useState<AdminCamera[]>([])

  useEffect(() => {
    if (import.meta.env.PROD) {
      return
    }

    let isMounted = true

    loadLocationsFixtures()
      .then(({ mockLocations, mockCameras }) => {
        if (isMounted) {
          setLocations(mockLocations as AdminLocation[])
          setCameras(mockCameras as AdminCamera[])
        }
      })
      .catch((error) => {
        console.error('❌ Erro ao carregar fixtures de locais:', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const tenantOptions = useMemo(() => {
    const unique = new Map<string, string>()
    locations.forEach((location) => {
      if (!unique.has(location.tenantId)) {
        unique.set(location.tenantId, location.tenantName)
      }
    })
    return Array.from(unique.entries()).map(([value, label]) => ({ value, label }))
  }, [locations])

  const camerasByLocation = useMemo(() => {
    return cameras.reduce<Record<string, AdminCamera[]>>((acc, camera) => {
      if (!acc[camera.locationId]) {
        acc[camera.locationId] = []
      }
      acc[camera.locationId].push(camera)
      return acc
    }, {})
  }, [cameras])

  const cameraModels = useMemo(() => {
    return Array.from(new Set(cameras.map((camera) => camera.model))).sort()
  }, [cameras])

  const kpiStats = useMemo(() => {
    const stats = buildLocationKpiStats(locations)
    return {
      totalLocations: stats.totalLocations,
      totalCameras: stats.totalCameras,
      onlineCameras: stats.onlineCameras,
      offlineCameras: stats.offlineCameras,
      healthPercentage: stats.healthPercentage,
    }
  }, [locations])

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch =
        search.trim().length === 0 ||
        location.name.toLowerCase().includes(search.toLowerCase()) ||
        location.tenantName.toLowerCase().includes(search.toLowerCase())

      const matchesTenant = tenantFilter === 'all' ? true : location.tenantId === tenantFilter

      const matchesVolume =
        cameraVolume === 'all'
          ? true
          : cameraVolume === 'gt25'
            ? location.cameras > 25
            : cameraVolume === 'gt50'
              ? location.cameras > 50
              : location.cameras > 100

      const locationCameras = camerasByLocation[location.id] ?? []

      const matchesStatus =
        statusFilter === 'all' ? true : locationCameras.some((camera) => camera.status === statusFilter)

      const matchesCameraModel =
        cameraModelFilter === 'all' ? true : locationCameras.some((camera) => camera.model === cameraModelFilter)

      return matchesSearch && matchesTenant && matchesVolume && matchesStatus && matchesCameraModel
    })
  }, [cameraModelFilter, cameraVolume, camerasByLocation, locations, search, statusFilter, tenantFilter])

  const handleSelectLocation = (location: AdminLocation) => {
    setSelectedLocation(location)
    setIsLocationDrawerOpen(true)
  }

  const handleLocationDrawerChange = (open: boolean) => {
    setIsLocationDrawerOpen(open)
    if (!open) {
      setSelectedLocation(null)
    }
  }

  const handleSelectCamera = (camera: AdminCamera) => {
    setSelectedCamera(camera)
    setIsCameraDrawerOpen(true)
  }

  const handleCameraDrawerChange = (open: boolean) => {
    setIsCameraDrawerOpen(open)
    if (!open) {
      setSelectedCamera(null)
    }
  }

  const locationCameras = selectedLocation ? camerasByLocation[selectedLocation.id] ?? [] : []

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Locais &amp; Câmeras</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Mapa completo da operação</h1>
          <p className="text-sm text-slate-500">Estrutura cliente → local → câmeras com status e módulos IA atualizados em tempo real.</p>
        </div>
        <Button type="button" className="h-11 rounded-2xl bg-slate-900 text-white" disabled>
          Novo local
        </Button>
      </header>

      <LocationKpisHeader stats={kpiStats} />

      <LocationFiltersBar
        search={search}
        tenantId={tenantFilter}
        status={statusFilter}
        cameraModel={cameraModelFilter}
        cameraVolume={cameraVolume}
        onSearchChange={setSearch}
        onTenantChange={setTenantFilter}
        onStatusChange={setStatusFilter}
        onCameraModelChange={setCameraModelFilter}
        onCameraVolumeChange={setCameraVolume}
        onResetFilters={() => {
          setSearch('')
          setTenantFilter('all')
          setStatusFilter('all')
          setCameraModelFilter('all')
          setCameraVolume('all')
        }}
        tenantOptions={tenantOptions}
        cameraModels={cameraModels}
      />

      <LocationListTable locations={filteredLocations} onSelectLocation={handleSelectLocation} />

      <LocationDetailsDrawer
        location={selectedLocation}
        cameras={locationCameras}
        open={isLocationDrawerOpen}
        onOpenChange={handleLocationDrawerChange}
        onSelectCamera={handleSelectCamera}
      />

      <CameraDetailsDrawer camera={selectedCamera} open={isCameraDrawerOpen} onOpenChange={handleCameraDrawerChange} />
    </section>
  )
}
