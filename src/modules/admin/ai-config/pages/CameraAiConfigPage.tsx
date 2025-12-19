import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Camera,
  Building2,
  MapPin,
  Save,
  Plus,
  Activity,
  Clock
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { AiModuleCard } from '../components/AiModuleCard'
import { AiZoneEditor } from '../components/AiZoneEditor'
import { getCameraAiConfig, CAMERA_AI_CONFIGS } from '../mockAiConfig'
import type { AiModuleConfig, AiZone, AiModuleType } from '../types/aiConfigTypes'
import { AI_MODULE_LABELS, AI_MODULE_COLORS } from '../types/aiConfigTypes'

const AVAILABLE_MODULES: AiModuleType[] = [
  'intrusion',
  'line_cross',
  'lpr',
  'people_count',
  'vehicle_count',
  'loitering',
  'epi'
]

export function CameraAiConfigPage() {
  const { cameraId } = useParams<{ cameraId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const cameraConfig = getCameraAiConfig(cameraId || '')

  const [modules, setModules] = useState<AiModuleConfig[]>(
    cameraConfig?.modules || []
  )
  const [globalSensitivity, setGlobalSensitivity] = useState(
    cameraConfig?.globalSensitivity || 70
  )
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [showAddModuleDialog, setShowAddModuleDialog] = useState(false)

  if (!cameraConfig) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <Camera className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-sm text-slate-500">Camera nao encontrada</p>
          <Button className="mt-4" onClick={() => navigate('/admin/ai-config')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    setModules(
      modules.map((m) => (m.id === moduleId ? { ...m, enabled } : m))
    )
  }

  const handleSensitivityChange = (moduleId: string, sensitivity: number) => {
    setModules(
      modules.map((m) => (m.id === moduleId ? { ...m, sensitivity } : m))
    )
  }

  const handleZonesSave = (moduleId: string, zones: AiZone[]) => {
    setModules(modules.map((m) => (m.id === moduleId ? { ...m, zones } : m)))
    setEditingModuleId(null)
    toast({
      title: 'Zonas atualizadas',
      description: 'As zonas de deteccao foram salvas com sucesso.'
    })
  }

  const handleAddModule = (moduleType: AiModuleType) => {
    const newModule: AiModuleConfig = {
      id: `mod-${Date.now()}`,
      type: moduleType,
      enabled: true,
      sensitivity: globalSensitivity,
      zones: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setModules([...modules, newModule])
    setShowAddModuleDialog(false)
    toast({
      title: 'Modulo adicionado',
      description: `${AI_MODULE_LABELS[moduleType]} foi adicionado. Configure as zonas de deteccao.`
    })
  }

  const handleSaveAll = () => {
    toast({
      title: 'Configuracoes salvas',
      description: 'Todas as configuracoes de IA desta camera foram atualizadas.'
    })
  }

  const editingModule = editingModuleId
    ? modules.find((m) => m.id === editingModuleId)
    : null

  const usedModuleTypes = modules.map((m) => m.type)
  const availableModulesToAdd = AVAILABLE_MODULES.filter(
    (type) => !usedModuleTypes.includes(type)
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/ai-config')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {cameraConfig.cameraName}
              </h1>
              <Badge variant="outline" className="text-xs">
                <Activity className="mr-1 h-3 w-3" />
                {globalSensitivity}% Sensibilidade
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {cameraConfig.tenantName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {cameraConfig.siteName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Atualizado em{' '}
                {new Date(cameraConfig.lastUpdated).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={handleSaveAll}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Tudo
        </Button>
      </div>

      {/* Sensibilidade Global */}
      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sensibilidade Global da Camera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">
                Aplicado a novos modulos
              </span>
              <Badge variant="outline" className="font-mono">
                {globalSensitivity}%
              </Badge>
            </div>
            <Slider
              value={[globalSensitivity]}
              onValueChange={(value) => setGlobalSensitivity(value[0])}
              max={100}
              step={5}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Menos falsos positivos</span>
              <span className="text-xs text-slate-400">Mais deteccoes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modulos de IA */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Modulos de IA ({modules.length})
          </h2>
          {availableModulesToAdd.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddModuleDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Modulo
            </Button>
          )}
        </div>

        {modules.length === 0 ? (
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardContent className="py-16 text-center">
              <Activity className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm text-slate-500">
                Nenhum modulo de IA configurado para esta camera
              </p>
              <Button
                className="mt-4"
                onClick={() => setShowAddModuleDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Modulo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <AiModuleCard
                key={module.id}
                module={module}
                onToggle={handleModuleToggle}
                onSensitivityChange={handleSensitivityChange}
                onConfigureZones={(id) => setEditingModuleId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialog de Adicionar Modulo */}
      <Dialog open={showAddModuleDialog} onOpenChange={setShowAddModuleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Modulo de IA</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {availableModulesToAdd.map((moduleType) => (
              <button
                key={moduleType}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left hover:border-slate-300 hover:bg-slate-50 transition-all"
                onClick={() => handleAddModule(moduleType)}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: AI_MODULE_COLORS[moduleType] }}
                />
                <div>
                  <p className="font-medium text-slate-900">
                    {AI_MODULE_LABELS[moduleType]}
                  </p>
                  <p className="text-xs text-slate-500">
                    Clique para adicionar
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Editor de Zonas */}
      <Dialog
        open={!!editingModule}
        onOpenChange={(open) => !open && setEditingModuleId(null)}
      >
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              Editar Zonas -{' '}
              {editingModule && AI_MODULE_LABELS[editingModule.type]}
            </DialogTitle>
          </DialogHeader>
          {editingModule && (
            <AiZoneEditor
              zones={editingModule.zones}
              moduleType={editingModule.type}
              onSave={(zones) => handleZonesSave(editingModule.id, zones)}
              onCancel={() => setEditingModuleId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
