import { useState } from 'react'
import { Plus, Search, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TemporaryAccessForm } from '../components/TemporaryAccessForm'
import { TemporaryAccessCard } from '../components/TemporaryAccessCard'
import {
  MOCK_TEMPORARY_ACCESS,
  type TemporaryTechnicianAccess
} from '../mockTemporaryAccess'

export function TemporaryTechnicianAccessPage() {
  const [searchText, setSearchText] = useState('')
  const [accesses, setAccesses] = useState<TemporaryTechnicianAccess[]>(
    MOCK_TEMPORARY_ACCESS
  )
  const [showForm, setShowForm] = useState(false)
  const [editingAccess, setEditingAccess] = useState<TemporaryTechnicianAccess | undefined>()
  const [revokeConfirm, setRevokeConfirm] = useState<TemporaryTechnicianAccess | null>(null)

  const filteredAccesses = accesses.filter(
    (access) =>
      access.technicianName.toLowerCase().includes(searchText.toLowerCase()) ||
      access.technicianEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      access.reason.toLowerCase().includes(searchText.toLowerCase())
  )

  const activeAccesses = filteredAccesses.filter(
    (a) => a.status === 'active' && new Date(a.endTime) > new Date()
  )
  const expiredAccesses = filteredAccesses.filter(
    (a) => a.status === 'expired' || (a.status === 'active' && new Date(a.endTime) <= new Date())
  )
  const revokedAccesses = filteredAccesses.filter((a) => a.status === 'revoked')

  const handleAddAccess = () => {
    setEditingAccess(undefined)
    setShowForm(true)
  }

  const handleEditAccess = (access: TemporaryTechnicianAccess) => {
    setEditingAccess(access)
    setShowForm(true)
  }

  const handleSaveAccess = (access: TemporaryTechnicianAccess) => {
    if (editingAccess) {
      setAccesses(accesses.map((a) => (a.id === access.id ? access : a)))
    } else {
      setAccesses([...accesses, access])
    }
    setShowForm(false)
    setEditingAccess(undefined)
  }

  const handleRevokeAccess = () => {
    if (revokeConfirm) {
      setAccesses(
        accesses.map((a) =>
          a.id === revokeConfirm.id
            ? {
                ...a,
                status: 'revoked' as const,
                revokedAt: new Date().toISOString()
              }
            : a
        )
      )
      setRevokeConfirm(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Acesso Temporário para Técnicos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Conceda acesso temporário e revogável para técnicos em campo durante
            instalação ou manutenção
          </p>
        </div>
        <Button onClick={handleAddAccess}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Acesso
        </Button>
      </div>

      {/* Alerta informativo */}
      <Card className="border-0 bg-green-50 shadow-sm ring-1 ring-green-200">
        <CardContent className="p-4 flex gap-3">
          <Clock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-900">
            <strong>Live View Temporário:</strong> Técnicos com acesso temporário
            podem visualizar câmeras em tempo real durante instalação, com revogação
            automática após expiração.
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Total de Acessos</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{accesses.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-green-50 shadow-sm ring-1 ring-green-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-green-700">Ativos</p>
            <p className="mt-2 text-2xl font-bold text-green-900">
              {activeAccesses.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-amber-50 shadow-sm ring-1 ring-amber-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-amber-700">Expirados</p>
            <p className="mt-2 text-2xl font-bold text-amber-900">
              {expiredAccesses.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-red-50 shadow-sm ring-1 ring-red-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-red-700">Revogados</p>
            <p className="mt-2 text-2xl font-bold text-red-900">
              {revokedAccesses.length}
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
              placeholder="Buscar por técnico, email ou motivo..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">
            Ativos ({activeAccesses.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expirados ({expiredAccesses.length})
          </TabsTrigger>
          <TabsTrigger value="revoked">
            Revogados ({revokedAccesses.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todos ({filteredAccesses.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Ativos */}
        <TabsContent value="active" className="mt-6 space-y-4">
          {activeAccesses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeAccesses.map((access) => (
                <TemporaryAccessCard
                  key={access.id}
                  access={access}
                  onEdit={handleEditAccess}
                  onRevoke={setRevokeConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <Clock className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum acesso ativo no momento
                </p>
                <Button className="mt-4" onClick={handleAddAccess}>
                  <Plus className="mr-2 h-4 w-4" />
                  Conceder Acesso
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Expirados */}
        <TabsContent value="expired" className="mt-6 space-y-4">
          {expiredAccesses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {expiredAccesses.map((access) => (
                <TemporaryAccessCard key={access.id} access={access} />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum acesso expirado
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Revogados */}
        <TabsContent value="revoked" className="mt-6 space-y-4">
          {revokedAccesses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {revokedAccesses.map((access) => (
                <TemporaryAccessCard key={access.id} access={access} />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum acesso revogado manualmente
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Todos */}
        <TabsContent value="all" className="mt-6 space-y-4">
          {filteredAccesses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAccesses.map((access) => (
                <TemporaryAccessCard
                  key={access.id}
                  access={access}
                  onEdit={handleEditAccess}
                  onRevoke={setRevokeConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <Clock className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">Nenhum acesso encontrado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Confirmação de Revogação */}
      <Dialog open={!!revokeConfirm} onOpenChange={() => setRevokeConfirm(null)}>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Revogar Acesso Temporário
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Tem certeza que deseja revogar o acesso do técnico{' '}
                <strong>{revokeConfirm?.technicianName}</strong>? Ele perderá
                acesso imediatamente.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRevokeConfirm(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleRevokeAccess}
                className="bg-red-600 hover:bg-red-700"
              >
                Revogar
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
              {editingAccess ? 'Editar Acesso Temporário' : 'Novo Acesso Temporário'}
            </h2>
            <TemporaryAccessForm
              access={editingAccess}
              onSave={handleSaveAccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Box */}
      <Card className="border-0 bg-blue-50 shadow-sm ring-1 ring-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-900">
            ℹ️ Como Funciona o Acesso Temporário
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Criação:</strong> Defina o técnico, duração e permissões
            específicas do acesso.
          </p>
          <p>
            <strong>Ativação Imediata:</strong> O acesso é ativado imediatamente
            após criação e o técnico recebe notificação.
          </p>
          <p>
            <strong>Live View:</strong> Técnico pode visualizar câmeras ao vivo
            durante instalação ou manutenção.
          </p>
          <p>
            <strong>Revogação Automática:</strong> Acesso é automaticamente
            revogado após expiração da duração.
          </p>
          <p>
            <strong>Revogação Manual:</strong> Você pode revogar o acesso antes
            da expiração se necessário.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
