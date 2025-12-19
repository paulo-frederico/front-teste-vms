import { useState } from 'react'
import { Plus, Bell, Search, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog'
import { NotificationProfileForm } from '../components/NotificationProfileForm'
import { NotificationProfileCard } from '../components/NotificationProfileCard'
import {
  MOCK_NOTIFICATION_PROFILES,
  type NotificationProfile
} from '../mockNotifications'

export function NotificationProfilesPage() {
  const [searchText, setSearchText] = useState('')
  const [profiles, setProfiles] = useState<NotificationProfile[]>(MOCK_NOTIFICATION_PROFILES)
  const [showForm, setShowForm] = useState(false)
  const [editingProfile, setEditingProfile] = useState<NotificationProfile | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<NotificationProfile | null>(null)

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchText.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchText.toLowerCase())
  )

  const activeProfiles = filteredProfiles.filter((p) => p.enabled)
  const inactiveProfiles = filteredProfiles.filter((p) => !p.enabled)

  const handleAddProfile = () => {
    setEditingProfile(undefined)
    setShowForm(true)
  }

  const handleEditProfile = (profile: NotificationProfile) => {
    setEditingProfile(profile)
    setShowForm(true)
  }

  const handleSaveProfile = (profile: NotificationProfile) => {
    if (editingProfile) {
      setProfiles(profiles.map((p) => (p.id === profile.id ? profile : p)))
    } else {
      setProfiles([...profiles, profile])
    }
    setShowForm(false)
    setEditingProfile(undefined)
  }

  const handleDeleteProfile = () => {
    if (deleteConfirm) {
      setProfiles(profiles.filter((p) => p.id !== deleteConfirm.id))
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Perfis de Notificação</h1>
          <p className="mt-1 text-sm text-slate-500">
            Crie e gerencie perfis de notificação para diferentes cenários e severidades
          </p>
        </div>
        <Button onClick={handleAddProfile}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Perfil
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Total de Perfis</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{profiles.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-green-50 shadow-sm ring-1 ring-green-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-green-700">Ativos</p>
            <p className="mt-2 text-2xl font-bold text-green-900">{activeProfiles.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-slate-50 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-600">Inativos</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{inactiveProfiles.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar perfis por nome ou descrição..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Bell className="h-4 w-4" />
            Todos ({filteredProfiles.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            Ativos ({activeProfiles.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="gap-2">
            Inativos ({inactiveProfiles.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Todos */}
        <TabsContent value="all" className="mt-6 space-y-4">
          {filteredProfiles.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProfiles.map((profile) => (
                <NotificationProfileCard
                  key={profile.id}
                  profile={profile}
                  onEdit={handleEditProfile}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <Bell className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">Nenhum perfil encontrado</p>
                <Button className="mt-4" onClick={handleAddProfile}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Perfil
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Ativos */}
        <TabsContent value="active" className="mt-6 space-y-4">
          {activeProfiles.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeProfiles.map((profile) => (
                <NotificationProfileCard
                  key={profile.id}
                  profile={profile}
                  onEdit={handleEditProfile}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <Bell className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum perfil ativo com os filtros selecionados
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Inativos */}
        <TabsContent value="inactive" className="mt-6 space-y-4">
          {inactiveProfiles.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {inactiveProfiles.map((profile) => (
                <NotificationProfileCard
                  key={profile.id}
                  profile={profile}
                  onEdit={handleEditProfile}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="py-16 text-center">
                <Bell className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum perfil inativo com os filtros selecionados
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <NotificationProfileForm
            profile={editingProfile}
            onSave={handleSaveProfile}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Remover Perfil</h2>
              <p className="mt-2 text-sm text-slate-600">
                Tem certeza que deseja remover o perfil{' '}
                <strong>{deleteConfirm?.name}</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteProfile}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Box */}
      <Card className="border-0 bg-blue-50 shadow-sm ring-1 ring-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-900">
            <strong>Dica:</strong> Crie múltiplos perfis para diferentes cenários (alertas críticos,
            reportes diários, notificações operacionais, etc) e configure canais, severidades e
            destinatários específicos para cada um.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
