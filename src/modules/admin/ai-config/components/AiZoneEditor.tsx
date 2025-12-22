import { useState } from 'react'
import { Trash2, Move, Square, Minus, Pentagon, RotateCcw, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AiZone, AiModuleType } from '../types/aiConfigTypes'
import { AI_MODULE_COLORS } from '../types/aiConfigTypes'

type AiZoneEditorProps = {
  zones: AiZone[]
  moduleType: AiModuleType
  onSave: (zones: AiZone[]) => void
  onCancel: () => void
}

type DrawingTool = 'select' | 'polygon' | 'line' | 'rectangle'

export function AiZoneEditor({ zones, moduleType, onSave, onCancel }: AiZoneEditorProps) {
  const [currentZones, setCurrentZones] = useState<AiZone[]>(zones)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<DrawingTool>('select')
  const [newZoneName, setNewZoneName] = useState('')

  const defaultColor = AI_MODULE_COLORS[moduleType]

  const handleAddZone = (type: 'polygon' | 'line' | 'rectangle') => {
    if (!newZoneName.trim()) {
      return
    }

    const newZone: AiZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName,
      type,
      color: defaultColor,
      moduleType,
      points:
        type === 'line'
          ? [
              { x: 20, y: 50 },
              { x: 80, y: 50 }
            ]
          : type === 'rectangle'
          ? [
              { x: 20, y: 20 },
              { x: 80, y: 20 },
              { x: 80, y: 80 },
              { x: 20, y: 80 }
            ]
          : [
              { x: 30, y: 20 },
              { x: 70, y: 20 },
              { x: 80, y: 50 },
              { x: 70, y: 80 },
              { x: 30, y: 80 },
              { x: 20, y: 50 }
            ]
    }

    setCurrentZones([...currentZones, newZone])
    setNewZoneName('')
    setSelectedZone(newZone.id)
  }

  const handleDeleteZone = (zoneId: string) => {
    setCurrentZones(currentZones.filter((z) => z.id !== zoneId))
    if (selectedZone === zoneId) {
      setSelectedZone(null)
    }
  }

  const handleResetZones = () => {
    setCurrentZones(zones)
    setSelectedZone(null)
  }

  const handleSave = () => {
    onSave(currentZones)
  }

  const renderZoneSvg = (zone: AiZone, isSelected: boolean) => {
    if (zone.type === 'line') {
      return (
        <line
          x1={`${zone.points[0].x}%`}
          y1={`${zone.points[0].y}%`}
          x2={`${zone.points[1].x}%`}
          y2={`${zone.points[1].y}%`}
          stroke={zone.color}
          strokeWidth={isSelected ? 4 : 3}
          strokeDasharray={isSelected ? '8,4' : undefined}
          className="cursor-pointer transition-all"
          onClick={() => setSelectedZone(zone.id)}
        />
      )
    }

    const pointsStr = zone.points.map((p) => `${p.x}%,${p.y}%`).join(' ')
    return (
      <polygon
        points={pointsStr}
        fill={`${zone.color}30`}
        stroke={zone.color}
        strokeWidth={isSelected ? 3 : 2}
        strokeDasharray={isSelected ? '8,4' : undefined}
        className="cursor-pointer transition-all"
        onClick={() => setSelectedZone(zone.id)}
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Preview da Camera com Zonas */}
      <div className="lg:col-span-2">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Visualizacao da Camera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
              {/* Simulacao de imagem da camera */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <div className="text-4xl mb-2">📹</div>
                    <p className="text-sm">Preview da Camera</p>
                    <p className="text-xs mt-1">Clique nas zonas para editar</p>
                  </div>
                </div>
              </div>

              {/* SVG de Zonas */}
              <svg className="absolute inset-0 w-full h-full">
                {currentZones.map((zone) => (
                  <g key={zone.id}>{renderZoneSvg(zone, zone.id === selectedZone)}</g>
                ))}
              </svg>

              {/* Labels das zonas */}
              {currentZones.map((zone) => {
                const centerX =
                  zone.points.reduce((sum, p) => sum + p.x, 0) / zone.points.length
                const centerY =
                  zone.points.reduce((sum, p) => sum + p.y, 0) / zone.points.length
                return (
                  <div
                    key={`label-${zone.id}`}
                    className="absolute text-xs font-medium text-white bg-black/60 px-1.5 py-0.5 rounded pointer-events-none"
                    style={{
                      left: `${centerX}%`,
                      top: `${centerY}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {zone.name}
                  </div>
                )
              })}
            </div>

            {/* Toolbar */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                <Button
                  size="sm"
                  variant={activeTool === 'select' ? 'secondary' : 'ghost'}
                  onClick={() => setActiveTool('select')}
                  title="Selecionar"
                >
                  <Move className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={activeTool === 'rectangle' ? 'secondary' : 'ghost'}
                  onClick={() => setActiveTool('rectangle')}
                  title="Retangulo"
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={activeTool === 'line' ? 'secondary' : 'ghost'}
                  onClick={() => setActiveTool('line')}
                  title="Linha"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={activeTool === 'polygon' ? 'secondary' : 'ghost'}
                  onClick={() => setActiveTool('polygon')}
                  title="Poligono"
                >
                  <Pentagon className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1" />

              <Button size="sm" variant="outline" onClick={handleResetZones}>
                <RotateCcw className="mr-1 h-4 w-4" />
                Resetar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel de Zonas */}
      <div className="space-y-4">
        {/* Adicionar Nova Zona */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Adicionar Zona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Nome da Zona</Label>
              <Input
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Ex: Area Restrita"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddZone('rectangle')}
                disabled={!newZoneName.trim()}
              >
                <Square className="mr-1 h-3 w-3" />
                Rect
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddZone('line')}
                disabled={!newZoneName.trim()}
              >
                <Minus className="mr-1 h-3 w-3" />
                Linha
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddZone('polygon')}
                disabled={!newZoneName.trim()}
              >
                <Pentagon className="mr-1 h-3 w-3" />
                Poly
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Zonas */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Zonas ({currentZones.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentZones.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                Nenhuma zona configurada
              </p>
            ) : (
              <div className="space-y-2">
                {currentZones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                      selectedZone === zone.id
                        ? 'bg-slate-100 ring-1 ring-slate-300'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                    onClick={() => setSelectedZone(zone.id)}
                  >
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: zone.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {zone.name}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{zone.type}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteZone(zone.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acoes */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Zonas
          </Button>
        </div>
      </div>
    </div>
  )
}
