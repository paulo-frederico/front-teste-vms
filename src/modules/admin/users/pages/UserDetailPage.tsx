import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, RotateCcw, Ban, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useUser, useDeleteUser, useResetUserPassword, useSuspendUser, useReactivateUser } from '@/hooks/useUsers'
import { UserRoleBadge } from '../components/UserRoleBadge'
import { UserStatusBadge } from '../components/UserStatusBadge'
import { UserStatus } from '@/modules/shared/types/auth'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: userData, isLoading } = useUser(id!)
  const deleteUser = useDeleteUser()
  const resetPassword = useResetUserPassword()
  const suspendUser = useSuspendUser()
  const reactivateUser = useReactivateUser()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    navigate(`/admin/users/${id}/edit`)
  }

  const handleDelete = async () => {
    if (!id) return
    if (!confirm('Tem certeza que deseja remover este usuário?')) return

    setIsDeleting(true)
    try {
      await deleteUser.mutateAsync(id)
      navigate('/admin/users')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleResetPassword = async () => {
    if (!id) return
    if (!confirm('Tem certeza que deseja resetar a senha deste usuário?')) return

    await resetPassword.mutateAsync(id)
  }

  const handleSuspendUser = async () => {
    if (!id) return
    if (!confirm('Tem certeza que deseja suspender este usuário? Ele não poderá acessar o sistema.')) return

    await suspendUser.mutateAsync(id)
  }

  const handleReactivateUser = async () => {
    if (!id) return
    if (!confirm('Tem certeza que deseja reativar este usuário?')) return

    await reactivateUser.mutateAsync(id)
  }

  const handleBack = () => {
    navigate('/admin/users')
  }

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

  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Detalhes do usuário</h1>
          <p className="mt-1 text-sm text-slate-500">{userData.name}</p>
        </div>
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Informações principais */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{userData.name}</h3>
                <p className="text-sm text-slate-500">{userData.email}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-500">Perfil</p>
                <div className="mt-1">
                  <UserRoleBadge role={userData.role} />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Status</p>
                <div className="mt-1">
                  <UserStatusBadge status={userData.status} />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Telefone</p>
                <p className="mt-1 text-sm text-slate-900">{userData.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Cliente/Tenant</p>
                <p className="mt-1 text-sm text-slate-900">{userData.tenantName || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Criado em</p>
                <p className="mt-1 text-sm text-slate-900">
                  {dateFormatter.format(new Date(userData.createdAt))}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Último acesso</p>
                <p className="mt-1 text-sm text-slate-900">
                  {userData.lastLogin
                    ? dateFormatter.format(new Date(userData.lastLogin))
                    : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissões */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Permissões</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(userData.permissions).map(([key, value]) => {
                const label = key
                  .replace(/^can/, '')
                  .replace(/([A-Z])/g, ' $1')
                  .trim()
                return (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    {value ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Ban className="h-4 w-4 text-slate-300" />
                    )}
                    <span className={value ? 'text-slate-900' : 'text-slate-400'}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Ações</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleResetPassword} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Resetar senha
              </Button>
              {userData.status === UserStatus.ACTIVE && (
                <Button
                  variant="outline"
                  onClick={handleSuspendUser}
                  disabled={suspendUser.isPending}
                  className="gap-2 text-orange-600 hover:bg-orange-50"
                >
                  <Ban className="h-4 w-4" />
                  {suspendUser.isPending ? 'Suspendendo...' : 'Suspender usuário'}
                </Button>
              )}
              {userData.status === UserStatus.SUSPENDED && (
                <Button
                  variant="outline"
                  onClick={handleReactivateUser}
                  disabled={reactivateUser.isPending}
                  className="gap-2 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  {reactivateUser.isPending ? 'Reativando...' : 'Reativar usuário'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
