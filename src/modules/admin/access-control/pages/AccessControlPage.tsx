import { useState } from 'react'
import { Plus, Search, Lock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AccessLevelForm } from '../components/AccessLevelForm'
import { AccessLevelCard } from '../components/AccessLevelCard'
import {
  MOCK_ACCESS_LEVELS,
  type AccessLevel,
  DEFAULT_ACCESS_LEVELS
} from '../mockAccessLevels'

export function AccessControlPage() {
  const [searchText, setSearchText] = useState('')
  const [levels, setLevels] = useState<AccessLevel[]>(MOCK_ACCESS_LEVELS)
  const [showForm, setShowForm] = useState(false)
  const [editingLevel, setEditingLevel] = useState<AccessLevel | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<AccessLevel | null>(null)

  const filteredLevels = levels.filter((level) =>
    level.name.toLowerCase().includes(searchText.toLowerCase()) ||
    level.description.toLowerCase().includes(searchText.toLowerCase())
  )

  const customLevels = filteredLevels.filter((l: AccessLevel) => l.isCustom)
  const defaultLevels = filteredLevels.filter((l: AccessLevel) => !l.isCustom)

  const handleAddLevel = () => {
    setEditingLevel(undefined)
    setShowForm(true)
  }

  const handleEditLevel = (level: AccessLevel) => {
    setEditingLevel(level)
    setShowForm(true)
  }

  const handleSaveLevel = (level: AccessLevel) => {
    if (editingLevel) {
      setLevels(levels.map((l) => (l.id === level.id ? level : l)))
    } else {
      setLevels([...levels, level])
    }
    setShowForm(false)
    setEditingLevel(undefined)
  }

  const handleDeleteLevel = () => {
    if (deleteConfirm) {
      setLevels(levels.filter((l) => l.id !== deleteConfirm.id))
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Controle de Acesso Avançado
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Crie e gerencie níveis de acesso customizados com granularidade de
            permissões
          </p>
        </div>
        <Button onClick={handleAddLevel}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Nível
        </Button>
      </div>

      {/* Alerta informativo */}
      <Card className="border-0 bg-amber-50 shadow-sm ring-1 ring-amber-200">
        <CardContent className="p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <strong>Dica:</strong> Níveis padrão (Admin Master, Técnico,
            Visualizador) não podem ser modificados. Crie novos níveis customizados
            baseando-se nestes.
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Total de Níveis</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{levels.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-blue-50 shadow-sm ring-1 ring-blue-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-blue-700">Customizados</p>
            <p className="mt-2 text-2xl font-bold text-blue-900">
              {levels.filter((l) => l.isCustom).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-green-50 shadow-sm ring-1 ring-green-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-green-700">Ativos</p>
            <p className="mt-2 text-2xl font-bold text-green-900">
              {levels.filter((l) => l.enabled).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-slate-50 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-600">Padrão</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {DEFAULT_ACCESS_LEVELS.length}
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
              placeholder="Buscar níveis por nome ou descrição..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            Todos ({filteredLevels.length})
          </TabsTrigger>
          <TabsTrigger value="custom">
            Customizados ({customLevels.length})
          </TabsTrigger>
          <TabsTrigger value="default">
            Padrão ({defaultLevels.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Todos */}
        <TabsContent value="all" className="mt-6 space-y-4">
          {filteredLevels.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLevels.map((level: AccessLevel) => (
                <AccessLevelCard
                  key={level.id}
                  level={level}
                  onEdit={handleEditLevel}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <Lock className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">Nenhum nível encontrado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Customizados */}
        <TabsContent value="custom" className="mt-6 space-y-4">
          {customLevels.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {customLevels.map((level: AccessLevel) => (
                <AccessLevelCard
                  key={level.id}
                  level={level}
                  onEdit={handleEditLevel}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <Lock className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum nível customizado criado ainda
                </p>
                <Button className="mt-4" onClick={handleAddLevel}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Nível
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Padrão */}
        <TabsContent value="default" className="mt-6 space-y-4">
          {defaultLevels.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {defaultLevels.map((level: AccessLevel) => (
                <AccessLevelCard
                  key={level.id}
                  level={level}
                  onEdit={handleEditLevel}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <Lock className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum nível padrão com os filtros selecionados
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
                Remover Nível de Acesso
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Tem certeza que deseja remover o nível{' '}
                <strong>{deleteConfirm?.name}</strong>? Esta ação não pode ser
                desfeita.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteLevel}
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
              {editingLevel ? 'Editar Nível' : 'Novo Nível de Acesso'}
            </h2>
            <AccessLevelForm
              level={editingLevel}
              onSave={handleSaveLevel}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Box */}
      <Card className="border-0 bg-blue-50 shadow-sm ring-1 ring-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-900">
            ℹ️ Sobre Níveis de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Níveis Padrão:</strong> Admin Master, Técnico e Visualizador
            são predefinidos e não podem ser modificados.
          </p>
          <p>
            <strong>Níveis Customizados:</strong> Você pode criar novos níveis
            baseando-se nos padrões, adicionando ou removendo permissões específicas.
          </p>
          <p>
            <strong>Herança:</strong> Quando um nível é baseado em outro, ele
            herda todas as permissões do nível pai e pode adicionar mais.
          </p>
          <p>
            <strong>Granularidade:</strong> Cada nível pode ter permissões
            customizadas para câmeras, usuários, infraestrutura, análises e sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
