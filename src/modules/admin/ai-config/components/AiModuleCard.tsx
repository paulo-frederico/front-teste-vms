import { useState } from 'react'
import {
  Shield,
  ArrowLeftRight,
  Car,
  Users,
  Truck,
  Clock,
  HardHat,
  Settings,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { AiModuleConfig, AiModuleType } from '../types/aiConfigTypes'
import {
  AI_MODULE_LABELS,
  AI_MODULE_DESCRIPTIONS,
  AI_MODULE_COLORS
} from '../types/aiConfigTypes'

const MODULE_ICONS: Record<AiModuleType, React.ElementType> = {
  intrusion: Shield,
  line_cross: ArrowLeftRight,
  lpr: Car,
  people_count: Users,
  vehicle_count: Truck,
  loitering: Clock,
  epi: HardHat
}

type AiModuleCardProps = {
  module: AiModuleConfig
  onToggle: (moduleId: string, enabled: boolean) => void
  onSensitivityChange: (moduleId: string, sensitivity: number) => void
  onConfigureZones: (moduleId: string) => void
}

export function AiModuleCard({
  module,
  onToggle,
  onSensitivityChange,
  onConfigureZones
}: AiModuleCardProps) {
  const [expanded, setExpanded] = useState(false)

  const Icon = MODULE_ICONS[module.type]
  const label = AI_MODULE_LABELS[module.type]
  const description = AI_MODULE_DESCRIPTIONS[module.type]
  const color = AI_MODULE_COLORS[module.type]

  const getSensitivityLabel = (value: number) => {
    if (value < 30) return 'Baixa'
    if (value < 60) return 'Media'
    if (value < 80) return 'Alta'
    return 'Muito Alta'
  }

  const getSensitivityColor = (value: number) => {
    if (value < 30) return 'text-green-600'
    if (value < 60) return 'text-yellow-600'
    if (value < 80) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <Card
      className={`border-0 bg-white shadow-sm ring-1 transition-all ${
        module.enabled ? 'ring-slate-200' : 'ring-slate-100 opacity-75'
      }`}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
              <p className="mt-0.5 text-xs text-slate-500 max-w-xs">{description}</p>
            </div>
          </div>
          <Switch
            checked={module.enabled}
            onCheckedChange={(checked) => onToggle(module.id, checked)}
          />
        </div>

        {/* Status e Zonas */}
        <div className="mt-4 flex items-center gap-2">
          <Badge
            variant={module.enabled ? 'default' : 'secondary'}
            className="text-xs"
            style={
              module.enabled
                ? { backgroundColor: `${color}20`, color, borderColor: `${color}40` }
                : undefined
            }
          >
            {module.enabled ? 'Ativo' : 'Inativo'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Layers className="mr-1 h-3 w-3" />
            {module.zones.length} {module.zones.length === 1 ? 'zona' : 'zonas'}
          </Badge>
          {module.schedule?.enabled && (
            <Badge variant="outline" className="text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Agendado
            </Badge>
          )}
        </div>

        {/* Expandir/Colapsar */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" /> Recolher
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> Configurar
            </>
          )}
        </button>

        {/* Configuracoes Expandidas */}
        {expanded && module.enabled && (
          <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
            {/* Sensibilidade */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-600">Sensibilidade</label>
                <span className={`text-xs font-semibold ${getSensitivityColor(module.sensitivity)}`}>
                  {module.sensitivity}% - {getSensitivityLabel(module.sensitivity)}
                </span>
              </div>
              <Slider
                value={[module.sensitivity]}
                onValueChange={(value) => onSensitivityChange(module.id, value[0])}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-400">Menos falsos positivos</span>
                <span className="text-[10px] text-slate-400">Mais deteccoes</span>
              </div>
            </div>

            {/* Zonas configuradas */}
            {module.zones.length > 0 && (
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">
                  Zonas Configuradas
                </label>
                <div className="space-y-1">
                  {module.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5"
                    >
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-xs text-slate-700">{zone.name}</span>
                      <span className="text-[10px] text-slate-400 capitalize">({zone.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agendamento */}
            {module.schedule?.enabled && module.schedule.periods.length > 0 && (
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">
                  Horarios Ativos
                </label>
                <div className="space-y-1">
                  {module.schedule.periods.map((period) => (
                    <div
                      key={period.id}
                      className="text-xs text-slate-600 bg-slate-50 rounded-md px-2 py-1.5"
                    >
                      <span className="font-medium">
                        {period.days.map(d => d.substring(0, 3).toUpperCase()).join(', ')}
                      </span>
                      {' '}das {period.startTime} as {period.endTime}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botao Configurar Zonas */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onConfigureZones(module.id)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Editar Zonas de Deteccao
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
