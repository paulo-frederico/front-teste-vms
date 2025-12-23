import { useState } from 'react'
import { AlertCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { type TemporaryTechnicianAccess } from '../mockTemporaryAccess'

type TemporaryAccessFormProps = {
  access?: TemporaryTechnicianAccess
  onSave: (access: TemporaryTechnicianAccess) => void
  onCancel: () => void
}

// Mock data de técnicos e câmeras
const MOCK_TECHNICIANS = [
  { id: 'tech-001', name: 'João Silva', email: 'joao.silva@unifique.com' },
  { id: 'tech-002', name: 'Maria Santos', email: 'maria.santos@unifique.com' },
  { id: 'tech-003', name: 'Carlos Mendes', email: 'carlos.mendes@unifique.com' },
  { id: 'tech-004', name: 'Ana Costa', email: 'ana.costa@unifique.com' }
]

const MOCK_CAMERAS = [
  { id: 'cam-001', name: 'Câmera Entrada' },
  { id: 'cam-002', name: 'Câmera Corredor' },
  { id: 'cam-003', name: 'Câmera Almoxarifado' },
  { id: 'cam-004', name: 'Câmera Estacionamento' },
  { id: 'cam-005', name: 'Câmera Portaria' },
  { id: 'cam-006', name: 'Câmera Sala de Servidores' }
]

const DURATION_PRESETS = [
  { label: '30 minutos', minutes: 30 },
  { label: '1 hora', minutes: 60 },
  { label: '2 horas', minutes: 120 },
  { label: '4 horas', minutes: 240 },
  { label: '8 horas', minutes: 480 },
  { label: '1 dia', minutes: 1440 },
  { label: 'Customizado', minutes: 0 }
]

export function TemporaryAccessForm({
  access,
  onSave,
  onCancel
}: TemporaryAccessFormProps) {
  const isEditing = !!access
  const isExpired = access && new Date(access.endTime) < new Date()

  const [selectedTechnician, setSelectedTechnician] = useState<string>(
    access?.technicianId || ''
  )
  const [accessType, setAccessType] = useState<'full' | 'limited'>(
    access?.accessType || 'limited'
  )
  const [selectedCameras, setSelectedCameras] = useState<Set<string>>(
    new Set(access?.cameraIds || [])
  )
  const [accessLevel, setAccessLevel] = useState<'view-only' | 'view-livestream' | 'full-control'>(
    access?.accessLevel || 'view-livestream'
  )
  const [durationMinutes, setDurationMinutes] = useState<number>(
    access?.duration || 120
  )
  const [customDuration, setCustomDuration] = useState<string>(
    String(access?.duration || '')
  )
  const [reason, setReason] = useState<string>(access?.reason || '')
  const [notes, setNotes] = useState<string>(access?.notes || '')
  const [useCustomDuration, setUseCustomDuration] = useState(
    !DURATION_PRESETS.map((p) => p.minutes).includes(access?.duration || 0)
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTechnician) {
      alert('Selecione um técnico')
      return
    }

    if (!reason.trim()) {
      alert('Descreva o motivo do acesso')
      return
    }

    if (accessType === 'limited' && selectedCameras.size === 0) {
      alert('Selecione pelo menos uma câmera para acesso limitado')
      return
    }

    const finalDuration = useCustomDuration
      ? parseInt(customDuration) || 60
      : durationMinutes

    if (finalDuration <= 0) {
      alert('Duração deve ser maior que zero')
      return
    }

    const tech = MOCK_TECHNICIANS.find((t) => t.id === selectedTechnician)
    if (!tech) return

    const now = new Date()
    const startTime = new Date()
    const endTime = new Date(now.getTime() + finalDuration * 60 * 1000)

    const newAccess: TemporaryTechnicianAccess = {
      id: access?.id || `temp-access-${Date.now()}`,
      technicianId: selectedTechnician,
      technicianName: tech.name,
      technicianEmail: tech.email,
      cameraIds: accessType === 'full' ? [] : Array.from(selectedCameras),
      accessType,
      accessLevel,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: finalDuration,
      reason,
      status: 'active',
      createdAt: access?.createdAt || new Date().toISOString(),
      createdBy: 'admin@unifique.com',
      notes
    }

    onSave(newAccess)
  }

  const toggleCamera = (cameraId: string) => {
    const newSelected = new Set(selectedCameras)
    if (newSelected.has(cameraId)) {
      newSelected.delete(cameraId)
    } else {
      newSelected.add(cameraId)
    }
    setSelectedCameras(newSelected)
  }

  const handleDurationChange = (minutes: number) => {
    if (minutes === 0) {
      setUseCustomDuration(true)
    } else {
      setDurationMinutes(minutes)
      setUseCustomDuration(false)
    }
  }

  const technician = MOCK_TECHNICIANS.find((t) => t.id === selectedTechnician)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="access">Acesso</TabsTrigger>
          <TabsTrigger value="duration">Duração</TabsTrigger>
        </TabsList>

        {/* Tab: Geral */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-6 space-y-4">
              {isExpired && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <strong>Acesso Expirado:</strong> Este acesso temporário já
                    expirou e não pode ser modificado.
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="technician" className="text-sm font-medium">
                  Selecionar Técnico
                </Label>
                <Select
                  value={selectedTechnician}
                  onValueChange={setSelectedTechnician}
                  disabled={isExpired}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Escolha um técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_TECHNICIANS.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name} ({tech.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {technician && (
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 text-sm text-blue-900">
                  <p>
                    <strong>Técnico selecionado:</strong> {technician.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {technician.email}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="reason" className="text-sm font-medium">
                  Motivo do Acesso
                </Label>
                <Input
                  id="reason"
                  placeholder="Ex: Instalação de novos cabos de rede"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isExpired}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notas Adicionais (opcional)
                </Label>
                <Input
                  id="notes"
                  placeholder="Notas sobre o acesso"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isExpired}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Acesso */}
        <TabsContent value="access" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configuração de Acesso</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Tipo de Acesso
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      id="access-full"
                      name="accessType"
                      value="full"
                      checked={accessType === 'full'}
                      onChange={() => setAccessType('full')}
                      disabled={isExpired}
                    />
                    <label
                      htmlFor="access-full"
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <strong>Todas as câmeras</strong>
                      <p className="text-xs text-slate-500">
                        Acesso a todas as câmeras do sistema
                      </p>
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      id="access-limited"
                      name="accessType"
                      value="limited"
                      checked={accessType === 'limited'}
                      onChange={() => setAccessType('limited')}
                      disabled={isExpired}
                    />
                    <label
                      htmlFor="access-limited"
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <strong>Câmeras selecionadas</strong>
                      <p className="text-xs text-slate-500">
                        Acesso apenas às câmeras escolhidas
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {accessType === 'limited' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Selecione as Câmeras
                  </Label>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-md border">
                    {MOCK_CAMERAS.map((camera) => (
                      <div key={camera.id} className="flex items-center gap-2">
                        <Checkbox
                          id={camera.id}
                          checked={selectedCameras.has(camera.id)}
                          onCheckedChange={() => toggleCamera(camera.id)}
                          disabled={isExpired}
                        />
                        <label
                          htmlFor={camera.id}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {camera.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {selectedCameras.size} câmera{selectedCameras.size !== 1 ? 's' : ''} selecionada{selectedCameras.size !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="accessLevel" className="text-sm font-medium">
                  Nível de Acesso
                </Label>
                <Select
                  value={accessLevel}
                  onValueChange={(value) => setAccessLevel(value as 'view-only' | 'view-livestream' | 'full-control')}
                  disabled={isExpired}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view-only">
                      Apenas Visualização
                    </SelectItem>
                    <SelectItem value="view-livestream">
                      Visualização ao Vivo
                    </SelectItem>
                    <SelectItem value="full-control">
                      Controle Total
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-2">
                  {accessLevel === 'view-only'
                    ? 'Acesso somente à gravação e histórico'
                    : accessLevel === 'view-livestream'
                      ? 'Visualização ao vivo com qualidade completa'
                      : 'Acesso total para reconfigurações e controle'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Duração */}
        <TabsContent value="duration" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Duração do Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleDurationChange(preset.minutes)}
                    disabled={isExpired}
                    className={`p-3 rounded-md border-2 text-sm font-medium transition-colors ${
                      useCustomDuration && preset.minutes === 0
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : !useCustomDuration && durationMinutes === preset.minutes
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {useCustomDuration && (
                <div>
                  <Label htmlFor="customDuration" className="text-sm font-medium">
                    Duração Customizada (minutos)
                  </Label>
                  <Input
                    id="customDuration"
                    type="number"
                    min="1"
                    placeholder="120"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    disabled={isExpired}
                    className="mt-2"
                  />
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-900">
                  <strong>Será ativado imediatamente por:</strong>
                </p>
                <p className="text-lg font-bold text-blue-700 mt-2">
                  {useCustomDuration
                    ? customDuration
                    : durationMinutes}  minutos
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Acesso expirado automaticamente: Revogação automática após a duração
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex gap-2 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>
                  <strong>Nota:</strong> O acesso será automaticamente revogado após a
                  duração especificada.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isExpired}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700"
          disabled={isExpired}
        >
          {isEditing ? 'Atualizar Acesso' : 'Criar Acesso Temporário'}
        </Button>
      </div>
    </form>
  )
}
