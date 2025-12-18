import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useUser, useUpdateUser } from '@/hooks/useUsers'
import { useTenants } from '@/hooks/useTenants'
import { UserForm } from '../UserForm'
import type { User } from '../userTypes'

export function UserEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { data: userData, isLoading } = useUser(id!)
  const updateUser = useUpdateUser()
  const { data: tenantsData } = useTenants()

  const availableTenants = tenantsData?.tenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
  })) || []

  const handleSubmit = async (data: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>) => {
    if (!id) return
    await updateUser.mutateAsync({ id, data: data as any })
    navigate('/admin/users')
  }

  const handleCancel = () => {
    navigate('/admin/users')
  }

  if (!currentUser) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-slate-500">Carregando usuário...</p>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-slate-500">Usuário não encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar usuário</h1>
          <p className="mt-1 text-sm text-slate-500">Editando: {userData.name}</p>
        </div>
        <Button variant="outline" onClick={handleCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="mx-auto max-w-4xl">
        <UserForm
          mode="edit"
          initialData={userData as any}
          availableTenants={availableTenants}
          currentUserRole={currentUser.role}
          currentUserTenantId={currentUser.tenantId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
