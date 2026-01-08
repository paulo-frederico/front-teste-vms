/**
 * Sidebar de Câmeras para Video Wall
 * Lista de câmeras com busca, filtros e drag & drop
 */

import { useState, useCallback, memo, useMemo } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Camera,
  Plus,
  Circle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { CameraForWall, CameraGroup, CameraWallStatus } from '@/modules/shared/types/videowall'
import { cameraStatusLabels, cameraStatusColors } from '@/mocks/cameras-wall.mock'

interface CameraSidebarProps {
  cameras: CameraForWall[]
  groups: CameraGroup[]
  onAddCamera: (cameraId: string) => void
  isLoading?: boolean
  activeCameraIds?: string[]
}

// Componente de item de câmera
const CameraItem = memo(function CameraItem({
  camera,
  onAdd,
  isActive,
}: {
  camera: CameraForWall
  onAdd: () => void
  isActive: boolean
}) {
  // Drag & drop support
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', camera.id)
      e.dataTransfer.effectAllowed = 'copy'
    },
    [camera.id]
  )

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-lg cursor-grab transition-colors',
        'hover:bg-muted/50 active:cursor-grabbing',
        isActive && 'bg-muted/30'
      )}
    >
      {/* Thumbnail / Status indicator */}
      <div
        className={cn(
          'relative w-12 h-8 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden'
        )}
      >
        {camera.thumbnailUrl ? (
          <img
            src={camera.thumbnailUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <Camera className="h-4 w-4 text-muted-foreground" />
        )}
        {/* Status dot */}
        <span
          className={cn(
            'absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full border border-white',
            cameraStatusColors[camera.status]
          )}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{camera.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">
          {camera.siteName} {camera.areaName && `/ ${camera.areaName}`}
        </p>
      </div>

      {/* Badge de status e botão adicionar */}
      <div className="flex items-center gap-1 shrink-0">
        {isActive ? (
          <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onAdd()
            }}
            aria-label={`Adicionar ${camera.name} ao mosaico`}
            disabled={camera.status === 'offline'}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
})

// Componente de grupo colapsável
const CameraGroupSection = memo(function CameraGroupSection({
  group,
  cameras,
  onAddCamera,
  activeCameraIds,
  defaultOpen = true,
}: {
  group: CameraGroup
  cameras: CameraForWall[]
  onAddCamera: (cameraId: string) => void
  activeCameraIds: string[]
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const onlineCount = cameras.filter((c) => c.status === 'online').length

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg transition-colors text-left"
          aria-label={`${isOpen ? 'Colapsar' : 'Expandir'} grupo ${group.name}`}
        >
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">{group.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">
              {onlineCount}/{cameras.length}
            </span>
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                onlineCount === cameras.length
                  ? 'bg-green-500'
                  : onlineCount > 0
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              )}
            />
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-2 space-y-0.5">
          {cameras.map((camera) => (
            <CameraItem
              key={camera.id}
              camera={camera}
              onAdd={() => onAddCamera(camera.id)}
              isActive={activeCameraIds.includes(camera.id)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
})

export const CameraSidebar = memo(function CameraSidebar({
  cameras,
  groups,
  onAddCamera,
  isLoading = false,
  activeCameraIds = [],
}: CameraSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<CameraWallStatus[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [showOnlyRecording, setShowOnlyRecording] = useState(false)

  // Filtrar câmeras
  const filteredCameras = useMemo(() => {
    let result = cameras

    // Busca textual
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.siteName?.toLowerCase().includes(query) ||
          c.areaName?.toLowerCase().includes(query) ||
          c.groupName?.toLowerCase().includes(query)
      )
    }

    // Filtro de status
    if (selectedStatuses.length > 0) {
      result = result.filter((c) => selectedStatuses.includes(c.status))
    }

    // Filtro de grupos
    if (selectedGroups.length > 0) {
      result = result.filter((c) => c.groupName && selectedGroups.includes(c.groupName))
    }

    // Filtro de gravação
    if (showOnlyRecording) {
      result = result.filter((c) => c.isRecording)
    }

    return result
  }, [cameras, searchQuery, selectedStatuses, selectedGroups, showOnlyRecording])

  // Agrupar câmeras filtradas por grupo
  const groupedCameras = useMemo(() => {
    const grouped = new Map<string, CameraForWall[]>()

    for (const camera of filteredCameras) {
      const groupName = camera.groupName || 'Sem grupo'
      if (!grouped.has(groupName)) {
        grouped.set(groupName, [])
      }
      grouped.get(groupName)!.push(camera)
    }

    return grouped
  }, [filteredCameras])

  // Handlers de filtro
  const handleStatusToggle = useCallback((status: CameraWallStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }, [])

  const handleGroupToggle = useCallback((groupName: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedStatuses([])
    setSelectedGroups([])
    setShowOnlyRecording(false)
  }, [])

  const hasActiveFilters =
    searchQuery || selectedStatuses.length > 0 || selectedGroups.length > 0 || showOnlyRecording

  // Stats
  const stats = useMemo(() => {
    const online = cameras.filter((c) => c.status === 'online').length
    const offline = cameras.filter((c) => c.status === 'offline').length
    const unstable = cameras.filter((c) => c.status === 'unstable').length
    return { online, offline, unstable, total: cameras.length }
  }, [cameras])

  if (isLoading) {
    return (
      <div className="h-full p-3 space-y-3">
        <div className="h-9 bg-muted animate-pulse rounded-lg" />
        <div className="h-8 bg-muted animate-pulse rounded-lg" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b space-y-2">
        {/* Stats rápidos */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Câmeras</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-green-600">
              <Circle className="h-2 w-2 fill-current" />
              {stats.online}
            </span>
            <span className="flex items-center gap-1 text-yellow-600">
              <Circle className="h-2 w-2 fill-current" />
              {stats.unstable}
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <Circle className="h-2 w-2 fill-current" />
              {stats.offline}
            </span>
          </div>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar câmeras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 pr-8 text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn('h-7 text-xs flex-1', hasActiveFilters && 'border-primary')}
              >
                <Filter className="h-3 w-3 mr-1.5" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[9px]">
                    {(selectedStatuses.length || 0) +
                      (selectedGroups.length || 0) +
                      (showOnlyRecording ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
              {(['online', 'offline', 'unstable', 'maintenance'] as const).map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={() => handleStatusToggle(status)}
                  className="text-xs"
                >
                  <span className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', cameraStatusColors[status])} />
                    {cameraStatusLabels[status]}
                  </span>
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Grupos</DropdownMenuLabel>
              {groups.slice(0, 5).map((group) => (
                <DropdownMenuCheckboxItem
                  key={group.id}
                  checked={selectedGroups.includes(group.name)}
                  onCheckedChange={() => handleGroupToggle(group.name)}
                  className="text-xs"
                >
                  {group.name}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showOnlyRecording}
                onCheckedChange={(checked) => setShowOnlyRecording(checked)}
                className="text-xs"
              >
                Apenas gravando
              </DropdownMenuCheckboxItem>
              {hasActiveFilters && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={clearFilters}
                  >
                    <X className="h-3 w-3 mr-2" />
                    Limpar filtros
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Lista de câmeras */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredCameras.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma câmera encontrada</p>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2 text-primary underline">
                  Limpar filtros
                </Button>
              )}
            </div>
          ) : groupedCameras.size > 1 ? (
            // Exibir por grupos
            Array.from(groupedCameras.entries()).map(([groupName, groupCameras]) => {
              const group = groups.find((g) => g.name === groupName) || {
                id: groupName,
                name: groupName,
                cameras: groupCameras,
                cameraCount: groupCameras.length,
                onlineCount: groupCameras.filter((c) => c.status === 'online').length,
              }

              return (
                <CameraGroupSection
                  key={groupName}
                  group={group}
                  cameras={groupCameras}
                  onAddCamera={onAddCamera}
                  activeCameraIds={activeCameraIds}
                />
              )
            })
          ) : (
            // Exibir lista simples
            filteredCameras.map((camera) => (
              <CameraItem
                key={camera.id}
                camera={camera}
                onAdd={() => onAddCamera(camera.id)}
                isActive={activeCameraIds.includes(camera.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer com dica */}
      <div className="p-2 border-t bg-muted/30">
        <p className="text-[10px] text-muted-foreground text-center">
          Arraste câmeras para o mosaico ou clique em <Plus className="inline h-3 w-3" /> para adicionar
        </p>
      </div>
    </div>
  )
})
