import { useState } from 'react'
import { Plus, Search, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { IncidentForm } from '../components/IncidentForm'
import { IncidentCard } from '../components/IncidentCard'
import { MOCK_INCIDENTS, type Incident } from '../mockIncidents'

export function IncidentsPage() {
  const [searchText, setSearchText] = useState('')
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS)
  const [showForm, setShowForm] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<Incident | null>(null)

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(searchText.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchText.toLowerCase()) ||
      incident.cameraName?.toLowerCase().includes(searchText.toLowerCase())
  )

  const openIncidents = filteredIncidents.filter(
    (i) => i.status === 'open' || i.status === 'in-progress'
  )
  const criticalIncidents = filteredIncidents.filter((i) => i.priority === 'critical')
  const resolvedIncidents = filteredIncidents.filter(
    (i) => i.status === 'resolved' || i.status === 'closed'
  )

  const handleAddIncident = () => {
    setEditingIncident(undefined)
    setShowForm(true)
  }

  const handleEditIncident = (incident: Incident) => {
    setEditingIncident(incident)
    setShowForm(true)
  }

  const handleSaveIncident = (incident: Incident) => {
    if (editingIncident) {
      setIncidents(incidents.map((i) => (i.id === incident.id ? incident : i)))
    } else {
      setIncidents([...incidents, incident])
    }
    setShowForm(false)
    setEditingIncident(undefined)
  }

  const handleDeleteIncident = () => {
    if (deleteConfirm) {
      setIncidents(incidents.filter((i) => i.id !== deleteConfirm.id))
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Sistema de Incidentes/Tickets
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe incidentes e atribua a técnicos para resolução
          </p>
        </div>
        <Button onClick={handleAddIncident}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Incidente
        </Button>
      </div>

      {/* Alerta */}
      {criticalIncidents.length > 0 && (
        <Card className="border-0 bg-red-50 shadow-sm ring-1 ring-red-200">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-900">
              <strong>Atenção:</strong> Você tem{' '}
              <strong>{criticalIncidents.length}</strong> incidente
              {criticalIncidents.length !== 1 ? 's' : ''} crítico
              {criticalIncidents.length !== 1 ? 's' : ''} que requer ação imediata!
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Total de Incidentes</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{incidents.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-red-50 shadow-sm ring-1 ring-red-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-red-700">Críticos</p>
            <p className="mt-2 text-2xl font-bold text-red-900">
              {criticalIncidents.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-blue-50 shadow-sm ring-1 ring-blue-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-blue-700">Abertos</p>
            <p className="mt-2 text-2xl font-bold text-blue-900">
              {openIncidents.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-green-50 shadow-sm ring-1 ring-green-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-green-700">Resolvidos</p>
            <p className="mt-2 text-2xl font-bold text-green-900">
              {resolvedIncidents.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar incidentes por título, descrição ou câmera..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Todos ({filteredIncidents.length})
          </TabsTrigger>
          <TabsTrigger value="open">
            Abertos ({openIncidents.length})
          </TabsTrigger>
          <TabsTrigger value="critical">
            Críticos ({criticalIncidents.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolvidos ({resolvedIncidents.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Todos */}
        <TabsContent value="all" className="mt-6 space-y-4">
          {filteredIncidents.length > 0 ? (
            <div className="space-y-3">
              {filteredIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onEdit={handleEditIncident}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">Nenhum incidente encontrado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Abertos */}
        <TabsContent value="open" className="mt-6 space-y-4">
          {openIncidents.length > 0 ? (
            <div className="space-y-3">
              {openIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onEdit={handleEditIncident}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum incidente aberto
                </p>
                <Button className="mt-4" onClick={handleAddIncident}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Incidente
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Críticos */}
        <TabsContent value="critical" className="mt-6 space-y-4">
          {criticalIncidents.length > 0 ? (
            <div className="space-y-3">
              {criticalIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onEdit={handleEditIncident}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum incidente crítico
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Resolvidos */}
        <TabsContent value="resolved" className="mt-6 space-y-4">
          {resolvedIncidents.length > 0 ? (
            <div className="space-y-3">
              {resolvedIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onEdit={handleEditIncident}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum incidente resolvido
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Remover Incidente
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Tem certeza que deseja remover o incidente{' '}
                <strong>"{deleteConfirm?.title}"</strong>? Esta ação não pode ser
                desfeita.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteIncident}
                className="bg-red-600 hover:bg-red-700"
              >
                Remover
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Formulário */}
      <Dialog open={showForm} onOpenChange={() => setShowForm(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="pr-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {editingIncident ? 'Editar Incidente' : 'Novo Incidente'}
            </h2>
            <IncidentForm
              incident={editingIncident}
              onSave={handleSaveIncident}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Box */}
      <Card className="border-0 bg-blue-50 shadow-sm ring-1 ring-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-900">
            ℹ️ Sobre o Sistema de Incidentes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Criação:</strong> Crie incidentes para problemas de câmeras,
            infraestrutura, segurança ou manutenção.
          </p>
          <p>
            <strong>Priorização:</strong> Marque como crítica para itens que
            requerem atenção imediata.
          </p>
          <p>
            <strong>Atribuição:</strong> Atribua incidentes a técnicos específicos
            para acompanhamento.
          </p>
          <p>
            <strong>Status:</strong> Atualize o status conforme o incidente
            progride até sua resolução.
          </p>
          <p>
            <strong>Histórico:</strong> Mantenha um registro completo de todos
            incidentes para auditoria.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
