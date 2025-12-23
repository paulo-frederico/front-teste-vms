import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { type Incident } from '../mockIncidents'

type IncidentFormProps = {
  incident?: Incident
  onSave: (incident: Incident) => void
  onCancel: () => void
}

// Mock data
const MOCK_CAMERAS = [
  { id: 'cam-001', name: 'Câmera Entrada' },
  { id: 'cam-002', name: 'Câmera Corredor' },
  { id: 'cam-003', name: 'Câmera Almoxarifado' },
  { id: 'cam-004', name: 'Câmera Estacionamento' },
  { id: 'cam-005', name: 'Câmera Portaria' },
  { id: 'cam-006', name: 'Câmera Sala de Servidores' }
]

const MOCK_TECHNICIANS = [
  { id: 'tech-001', name: 'João Silva', email: 'joao.silva@unifique.com' },
  { id: 'tech-002', name: 'Maria Santos', email: 'maria.santos@unifique.com' },
  { id: 'tech-003', name: 'Carlos Mendes', email: 'carlos.mendes@unifique.com' },
  { id: 'tech-004', name: 'Ana Costa', email: 'ana.costa@unifique.com' }
]

const INCIDENT_TYPES = [
  { value: 'camera-offline', label: '📷 Câmera Offline' },
  { value: 'ai-error', label: '🤖 Erro de IA' },
  { value: 'performance', label: '⚡ Performance' },
  { value: 'security', label: '🔒 Segurança' },
  { value: 'maintenance', label: '🔧 Manutenção' },
  { value: 'other', label: '❓ Outro' }
]

export function IncidentForm({ incident, onSave, onCancel }: IncidentFormProps) {
  const isEditing = !!incident

  const [title, setTitle] = useState(incident?.title || '')
  const [description, setDescription] = useState(incident?.description || '')
  const [type, setType] = useState<string>(incident?.type || 'other')
  const [priority, setPriority] = useState<string>(incident?.priority || 'medium')
  const [cameraId, setCameraId] = useState(incident?.cameraId || '')
  const [status, setStatus] = useState<string>(incident?.status || 'open')
  const [assignedTechnicianId, setAssignedTechnicianId] = useState(
    incident?.assignedTechnicianId || ''
  )
  const [resolutionNotes, setResolutionNotes] = useState(
    incident?.resolutionNotes || ''
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Título do incidente é obrigatório')
      return
    }

    if (!description.trim()) {
      alert('Descrição é obrigatória')
      return
    }

    const selectedCamera = MOCK_CAMERAS.find((c) => c.id === cameraId)
    const selectedTechnician = MOCK_TECHNICIANS.find(
      (t) => t.id === assignedTechnicianId
    )

    const newIncident: Incident = {
      id: incident?.id || `incident-${crypto.randomUUID()}`,
      title,
      description,
      type: type as Incident['type'],
      priority: priority as Incident['priority'],
      status: status as Incident['status'],
      cameraId: cameraId || undefined,
      cameraName: selectedCamera?.name,
      assignedTechnicianId: assignedTechnicianId || undefined,
      assignedTechnicianName: selectedTechnician?.name,
      assignedTechnicianEmail: selectedTechnician?.email,
      createdAt: incident?.createdAt || new Date().toISOString(),
      createdBy: incident?.createdBy || 'admin@unifique.com',
      updatedAt: new Date().toISOString(),
      resolutionNotes: resolutionNotes || undefined,
      attachments: incident?.attachments || [],
      comments: incident?.comments || []
    }

    onSave(newIncident)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="assignment">Atribuição</TabsTrigger>
        </TabsList>

        {/* Tab: Geral */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Título do Incidente
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Câmera offline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Descrição Detalhada
                </Label>
                <textarea
                  id="description"
                  placeholder="Descreva o problema em detalhes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-2 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type" className="text-sm font-medium">
                    Tipo de Incidente
                  </Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INCIDENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Prioridade
                  </Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">🔴 Crítica</SelectItem>
                      <SelectItem value="high">🟠 Alta</SelectItem>
                      <SelectItem value="medium">🟡 Média</SelectItem>
                      <SelectItem value="low">🟢 Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="camera" className="text-sm font-medium">
                  Câmera Relacionada (opcional)
                </Label>
                <Select value={cameraId} onValueChange={setCameraId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione uma câmera" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CAMERAS.map((cam) => (
                      <SelectItem key={cam.id} value={cam.id}>
                        {cam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">🔴 Aberto</SelectItem>
                    <SelectItem value="in-progress">🟡 Em Progresso</SelectItem>
                    <SelectItem value="waiting-customer">
                      ⏸️ Aguardando Cliente
                    </SelectItem>
                    <SelectItem value="resolved">✅ Resolvido</SelectItem>
                    <SelectItem value="closed">🔒 Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(status === 'resolved' || status === 'closed') && (
                <div>
                  <Label htmlFor="resolution" className="text-sm font-medium">
                    Notas de Resolução
                  </Label>
                  <textarea
                    id="resolution"
                    placeholder="Descreva como o problema foi resolvido..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={3}
                    className="mt-2 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Atribuição */}
        <TabsContent value="assignment" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Atribuição de Incidente</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="technician" className="text-sm font-medium">
                  Atribuir a Técnico (opcional)
                </Label>
                <Select
                  value={assignedTechnicianId}
                  onValueChange={setAssignedTechnicianId}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione um técnico" />
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

              {assignedTechnicianId && (
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 text-sm text-blue-900">
                  <p>
                    <strong>Técnico selecionado:</strong>{' '}
                    {MOCK_TECHNICIANS.find((t) => t.id === assignedTechnicianId)
                      ?.name}
                  </p>
                  <p>
                    <strong>Email:</strong>{' '}
                    {MOCK_TECHNICIANS.find((t) => t.id === assignedTechnicianId)
                      ?.email}
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Informações:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Incidentes críticos devem ser atribuídos a um técnico
                    responsável
                  </li>
                  <li>
                    O técnico receberá notificação quando atribuído ao
                    incidente
                  </li>
                  <li>
                    O status muda para "Em Progresso" quando técnico começa a
                    trabalhar
                  </li>
                  <li>Adicione comentários para comunicação com a equipe</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Incidente'}
        </Button>
      </div>
    </form>
  )
}
